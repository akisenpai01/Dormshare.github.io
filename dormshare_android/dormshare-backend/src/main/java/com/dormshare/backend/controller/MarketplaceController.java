package com.dormshare.backend.controller;

import com.dormshare.backend.model.Item;
import com.dormshare.backend.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/market")
public class MarketplaceController {
    @Autowired
    ItemRepository itemRepository;

    @Autowired
    com.dormshare.backend.service.NotificationService notificationService;

    @GetMapping("/items")
    public List<Item> getAllItems(@RequestParam String currentUserId) {
        return itemRepository.findByStatusAndOwnerIdNot("available", currentUserId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addItem(@RequestBody Item item) {
        item.setStatus("available");
        itemRepository.save(item);
        notificationService.broadcastMarketUpdate();
        return ResponseEntity.ok("Item listed successfully!");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        // Simple mock for direct web-base64 or URL assignment in the web client
        // Real upload logic would save to /uploads/ folder
        return ResponseEntity.ok("File uploaded successfully");
    }

    @GetMapping("/my-items")
    public List<Item> getMyItems(@RequestParam String userId) {
        return itemRepository.findByOwnerId(userId);
    }
}
