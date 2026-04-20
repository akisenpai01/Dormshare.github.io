package com.dormshare.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "items")
public class Item {
    @Id
    private String id;
    private String ownerId;
    private String name;
    private String category;
    private int tokenCost;
    private String status; // available, pending, borrowed
    private String pickupLocation;
    private String description;
    private String imageUrl;
}
