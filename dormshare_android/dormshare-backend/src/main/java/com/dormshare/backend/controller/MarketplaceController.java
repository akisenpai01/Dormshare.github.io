package com.dormshare.backend.controller;

import com.dormshare.backend.model.Item;
import com.dormshare.backend.model.User;
import com.dormshare.backend.repository.ItemRepository;
import com.dormshare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/market")
public class MarketplaceController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    com.dormshare.backend.service.NotificationService notificationService;

    @Autowired
    com.dormshare.backend.service.CloudinaryService cloudinaryService;

    @GetMapping("/items")
    public List<Item> getAllItems(@RequestParam String currentUserId) {
        return itemRepository.findByStatusAndOwnerIdNot("available", currentUserId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addItem(@RequestBody Item item) {
        item.setStatus("available");
        
        // Fetch and set owner reputation
        userRepository.findById(item.getOwnerId()).ifPresent(u -> {
            item.setOwnerReputation(u.getTrustScore());
        });
        
        itemRepository.save(item);
        notificationService.broadcastMarketUpdate();
        return ResponseEntity.ok("Item listed successfully!");
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            String url = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(java.util.Map.of("url", url));
        } catch (java.io.IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/my-items")
    public List<Item> getMyItems(@RequestParam String userId) {
        return itemRepository.findByOwnerId(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable String id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            notificationService.broadcastMarketUpdate();
            return ResponseEntity.ok("Item deleted successfully");
        }
        return ResponseEntity.badRequest().body("Item not found");
    }
}
