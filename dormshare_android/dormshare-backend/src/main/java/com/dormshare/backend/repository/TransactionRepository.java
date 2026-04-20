package com.dormshare.backend.repository;

import com.dormshare.backend.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByBorrowerIdOrLenderId(String borrowerId, String lenderId);
}
