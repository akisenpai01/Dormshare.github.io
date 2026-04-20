package com.dormshare.backend.repository;

import com.dormshare.backend.model.TokenTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TokenTransactionRepository extends MongoRepository<TokenTransaction, String> {
    List<TokenTransaction> findByUserIdOrderByTimestampDesc(String userId);
}
