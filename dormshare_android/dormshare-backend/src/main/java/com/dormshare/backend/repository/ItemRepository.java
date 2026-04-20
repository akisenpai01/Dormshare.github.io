package com.dormshare.backend.repository;

import com.dormshare.backend.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByStatusAndOwnerIdNot(String status, String ownerId);
    List<Item> findByOwnerId(String ownerId);
}
