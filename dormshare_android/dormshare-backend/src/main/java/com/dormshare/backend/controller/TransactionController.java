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

    @PostMapping("/request")
    public ResponseEntity<?> requestItem(@RequestBody Transaction tx) {
        tx.setStatus("pending");
        transactionRepository.save(tx);
        
        // Update item status
        Optional<Item> item = itemRepository.findById(tx.getItemId());
        if (item.isPresent()) {
            item.get().setStatus("pending");
            itemRepository.save(item.get());
        }
        
        return ResponseEntity.ok(tx);
    }

    @PostMapping("/verify/{id}")
    public ResponseEntity<?> verifyHandoff(@PathVariable String id) {
        Optional<Transaction> tx = transactionRepository.findById(id);
        if (tx.isPresent()) {
            tx.get().setStatus("active");
            transactionRepository.save(tx.get());

            // Update item status
            Optional<Item> item = itemRepository.findById(tx.get().getItemId());
            if (item.isPresent()) {
                item.get().setStatus("borrowed");
                itemRepository.save(item.get());
            }

            // PRODUCE EVENT TO KAFKA for Spark to calculate trust scores and analytics
            kafkaProducerService.sendHandoffEvent(tx.get());

            return ResponseEntity.ok("Handoff verified and event broadcasted to Kafka");
        }
        return ResponseEntity.badRequest().body("Transaction not found");
    }

    @GetMapping("/history")
    public List<Transaction> getHistory(@RequestParam String userId) {
        return transactionRepository.findByBorrowerIdOrLenderId(userId, userId);
    }
}
