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
    public String verificationCode;
    public int borrowerRating;
    public int lenderRating;
    public String borrowerFeedback;
    public String lenderFeedback;

    public Transaction(@NonNull String id, String itemId, String borrowerId, String lenderId, int tokenCost, String status, String date, String verificationCode, int borrowerRating, int lenderRating, String borrowerFeedback, String lenderFeedback) {
        this.id = id;
        this.itemId = itemId;
        this.borrowerId = borrowerId;
        this.lenderId = lenderId;
        this.tokenCost = tokenCost;
        this.status = status;
        this.date = date;
        this.verificationCode = verificationCode;
        this.borrowerRating = borrowerRating;
        this.lenderRating = lenderRating;
        this.borrowerFeedback = borrowerFeedback;
        this.lenderFeedback = lenderFeedback;
    }
}
