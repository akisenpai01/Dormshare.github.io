package com.dormshare.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "token_transactions")
public class TokenTransaction {
    @Id
    private String id;
    private String userId;
    private int amount;
    private String type; // EARN, SPEND
    private String description;
    private Date timestamp;
    private String relatedTransactionId;

    public TokenTransaction(String userId, int amount, String type, String description, String relatedTransactionId) {
        this.userId = userId;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.relatedTransactionId = relatedTransactionId;
        this.timestamp = new Date();
    }
}
