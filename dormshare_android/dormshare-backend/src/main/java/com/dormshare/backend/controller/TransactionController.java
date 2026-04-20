package com.dormshare.backend.controller;

import com.dormshare.backend.model.Item;
import com.dormshare.backend.model.Transaction;
import com.dormshare.backend.repository.ItemRepository;
import com.dormshare.backend.repository.TransactionRepository;
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
    TransactionRepository transactionRepository;

    @Autowired
    ItemRepository itemRepository;

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
            notificationService.broadcastTransactionUpdate();
            return ResponseEntity.ok("Feedback submitted");
        }
        return ResponseEntity.badRequest().body("Transaction not found");
    }

    @GetMapping("/history")
    public List<Transaction> getHistory(@RequestParam String userId) {
        return transactionRepository.findByBorrowerIdOrLenderId(userId, userId);
    }
}
