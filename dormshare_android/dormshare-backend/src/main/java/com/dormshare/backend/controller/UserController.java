package com.dormshare.backend.controller;

import com.dormshare.backend.model.TokenTransaction;
import com.dormshare.backend.model.User;
import com.dormshare.backend.repository.TokenTransactionRepository;
import com.dormshare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenTransactionRepository tokenTransactionRepository;

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/wallet/{id}")
    public List<TokenTransaction> getWalletHistory(@PathVariable String id) {
        return tokenTransactionRepository.findByUserIdOrderByTimestampDesc(id);
    }
}
