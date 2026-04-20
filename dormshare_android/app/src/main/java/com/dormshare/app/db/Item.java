package com.dormshare.app.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "items")
public class Item {
    @PrimaryKey
    @NonNull
    public String id;
    public String ownerId;
    public String name;
    public String category;
    public String condition;
    public int tokenCost;
    public String status; // available, pending, borrowed
    public String pickupLocation;
    public String description;

    public Item(@NonNull String id, String ownerId, String name, String category, String condition, int tokenCost, String status, String pickupLocation, String description) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.category = category;
        this.condition = condition;
        this.tokenCost = tokenCost;
        this.status = status;
        this.pickupLocation = pickupLocation;
        this.description = description;
    }
}
