package com.dormshare.backend.repository;

import com.dormshare.backend.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByTransactionIdOrderByTimestampAsc(String transactionId);
}
