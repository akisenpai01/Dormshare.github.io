package com.dormshare.app.db;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "transactions")
public class Transaction {
    @PrimaryKey
    @NonNull
    public String id;
    public String itemId;
    public String borrowerId;
    public String lenderId;
    public int tokenCost;
    public String status; // pending_verify, active, returned
    public String date;

    public Transaction(@NonNull String id, String itemId, String borrowerId, String lenderId, int tokenCost, String status, String date) {
        this.id = id;
        this.itemId = itemId;
        this.borrowerId = borrowerId;
        this.lenderId = lenderId;
        this.tokenCost = tokenCost;
        this.status = status;
        this.date = date;
    }
}
