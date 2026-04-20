package com.dormshare.app.db;

import java.io.Serializable;

public class ChatMessage implements Serializable {
    public String id;
    public String transactionId;
    public String senderId;
    public String content;
    public String imageUrl;
    public String timestamp;

    public ChatMessage() {}

    public ChatMessage(String transactionId, String senderId, String content, String imageUrl) {
        this.transactionId = transactionId;
        this.senderId = senderId;
        this.content = content;
        this.imageUrl = imageUrl;
    }
}
