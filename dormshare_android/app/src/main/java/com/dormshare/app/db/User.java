package com.dormshare.app.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "users")
public class User {
    @PrimaryKey
    @NonNull
    public String id;
    public String name;
    public String email;
    public String password;
    public String hostelBlock;
    public String dormAddress;
    public int tokens;
    public double trustScore;

    public User(@NonNull String id, String name, String email, String password, String hostelBlock, String dormAddress, int tokens, double trustScore) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.hostelBlock = hostelBlock;
        this.dormAddress = dormAddress;
        this.tokens = tokens;
        this.trustScore = trustScore;
    }
}
