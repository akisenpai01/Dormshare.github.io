package com.dormshare.backend.controller;

import com.dormshare.backend.model.TokenTransaction;
import com.dormshare.backend.model.User;
import com.dormshare.backend.repository.ItemRepository;
import com.dormshare.backend.repository.TokenTransactionRepository;
import com.dormshare.backend.repository.TransactionRepository;
import com.dormshare.backend.repository.UserRepository;
import com.dormshare.backend.service.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TokenTransactionRepository tokenTransactionRepository;

    @Autowired
    KafkaProducerService kafkaProducerService;

    @Autowired
    com.dormshare.backend.service.NotificationService notificationService;

    @PostMapping("/request")
    public ResponseEntity<?> requestItem(@RequestBody Transaction tx) {
        tx.setStatus("pending");
        // Generate a 6-digit random verification code
        String vCode = String.valueOf((int)((Math.random() * 900000) + 100000));
        tx.setVerificationCode(vCode);
        transactionRepository.save(tx);
        
        // Update item status
        Optional<Item> item = itemRepository.findById(tx.getItemId());
        if (item.isPresent()) {
            item.get().setStatus("pending");
            itemRepository.save(item.get());
        }
        
        notificationService.broadcastTransactionUpdate();
        return ResponseEntity.ok(tx);
    }

    @PostMapping("/verify/{id}")
    public ResponseEntity<?> verifyHandoff(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {
        Optional<Transaction> tx = transactionRepository.findById(id);
        if (tx.isPresent()) {
            String submittedCode = body.get("code");
            if (submittedCode == null || !submittedCode.equals(tx.get().getVerificationCode())) {
                return ResponseEntity.badRequest().body("Invalid verification code");
            }

            tx.get().setStatus("active");
            transactionRepository.save(tx.get());

            // Update item status
            Optional<Item> item = itemRepository.findById(tx.get().getItemId());
            if (item.isPresent()) {
                item.get().setStatus("borrowed");
                itemRepository.save(item.get());
            }

            kafkaProducerService.sendHandoffEvent(tx.get());

            // Wallet Logic: Record Token Transaction
            tokenTransactionRepository.save(new TokenTransaction(
                tx.get().getBorrowerId(), tx.get().getTokenCost(), "SPEND", 
                "Borrowed gear: " + id, tx.get().getId()
            ));
            tokenTransactionRepository.save(new TokenTransaction(
                tx.get().getLenderId(), tx.get().getTokenCost(), "EARN", 
                "Lent gear: " + id, tx.get().getId()
            ));

            // Increase Transaction Counts
            userRepository.findById(tx.get().getBorrowerId()).ifPresent(u -> { u.setTotalTrades(u.getTotalTrades()+1); userRepository.save(u); });
            userRepository.findById(tx.get().getLenderId()).ifPresent(u -> { u.setTotalTrades(u.getTotalTrades()+1); userRepository.save(u); });

            notificationService.broadcastTransactionUpdate();
            notificationService.broadcastMarketUpdate();

            return ResponseEntity.ok("Handoff verified successfully!");
        }
        return ResponseEntity.badRequest().body("Transaction not found");
    }

    @PostMapping("/feedback/{id}")
    public ResponseEntity<?> submitFeedback(@PathVariable String id, @RequestBody Transaction feedback) {
        Optional<Transaction> tx = transactionRepository.findById(id);
        if (tx.isPresent()) {
            // Update the ratings/feedback depending on who is sending it
            if (feedback.getBorrowerFeedback() != null) tx.get().setBorrowerFeedback(feedback.getBorrowerFeedback());
            if (feedback.getBorrowerRating() > 0) tx.get().setBorrowerRating(feedback.getBorrowerRating());
            if (feedback.getLenderFeedback() != null) tx.get().setLenderFeedback(feedback.getLenderFeedback());
            if (feedback.getLenderRating() > 0) tx.get().setLenderRating(feedback.getLenderRating());
            
            transactionRepository.save(tx.get());

            // Update Reputation Logic
            String subjectId = (feedback.getLenderRating() > 0) ? tx.get().getLenderId() : tx.get().getBorrowerId();
            int newRating = (feedback.getLenderRating() > 0) ? feedback.getLenderRating() : feedback.getBorrowerRating();
            
            userRepository.findById(subjectId).ifPresent(u -> {
                double currentScore = u.getTrustScore();
                int total = u.getTotalTrades();
                // Weighted average: simplified simulation
                double newScore = ((currentScore * 4) + newRating) / 5.0; 
                u.setTrustScore(newScore);
                userRepository.save(u);
            });

            notificationService.broadcastTransactionUpdate();
            return ResponseEntity.ok("Feedback submitted");
        }
        return ResponseEntity.badRequest().body("Transaction not found");
    }

    @GetMapping("/history")
    public List<Transaction> getHistory(@RequestParam String userId) {
        return transactionRepository.findByBorrowerIdOrLenderId(userId, userId);
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<?> returnItem(@PathVariable String id) {
        Optional<Transaction> tx = transactionRepository.findById(id);
        if (tx.isPresent()) {
            tx.get().setStatus("returned");
            transactionRepository.save(tx.get());
            
            // Update item status back to available
            itemRepository.findById(tx.get().getItemId()).ifPresent(i -> {
                i.setStatus("available");
                itemRepository.save(i);
            });
            
            notificationService.broadcastTransactionUpdate();
            notificationService.broadcastMarketUpdate();
            return ResponseEntity.ok("Item returned");
        }
        return ResponseEntity.badRequest().body("Transaction not found");
    }
}
