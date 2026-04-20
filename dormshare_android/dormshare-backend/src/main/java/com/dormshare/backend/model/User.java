package com.dormshare.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String hostelBlock;
    private int tokens;
    private double trustScore;
    private int totalTrades;

    public User(String name, String email, String password, String hostelBlock) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.hostelBlock = hostelBlock;
        this.tokens = 10;
        this.trustScore = 5.0;
        this.totalTrades = 0;
    }
}
