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

    @GetMapping("/items")
    public List<Item> getAllItems(@RequestParam String currentUserId) {
        return itemRepository.findByStatusAndOwnerIdNot("available", currentUserId);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addItem(@RequestBody Item item) {
        item.setStatus("available");
        itemRepository.save(item);
        return ResponseEntity.ok("Item listed successfully!");
    }

    @GetMapping("/my-items")
    public List<Item> getMyItems(@RequestParam String userId) {
        return itemRepository.findByOwnerId(userId);
    }
}
