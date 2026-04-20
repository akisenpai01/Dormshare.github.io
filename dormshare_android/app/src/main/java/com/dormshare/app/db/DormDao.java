package com.dormshare.app.db;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface DormDao {
    // Users
    @Insert
    void insertUser(User user);

    @Query("SELECT * FROM users WHERE email = :email AND password = :password")
    User login(String email, String password);

    @Query("SELECT * FROM users WHERE email = :email")
    User getUserByEmail(String email);

    @Query("SELECT * FROM users WHERE id = :id")
    User getUserById(String id);

    @Update
    void updateUser(User user);

    // Items
    @Insert
    void insertItem(Item item);

    @Query("SELECT * FROM items WHERE status = 'available' AND ownerId != :currentUserId")
    List<Item> getMarketItems(String currentUserId);

    @Query("SELECT * FROM items WHERE ownerId = :userId")
    List<Item> getMyItems(String userId);

    @Query("SELECT * FROM items WHERE id = :id")
    Item getItemById(String id);

    @Update
    void updateItem(Item item);

    // Transactions
    @Insert
    void insertTransaction(Transaction transaction);

    @Query("SELECT * FROM transactions WHERE borrowerId = :userId OR lenderId = :userId ORDER BY id DESC")
    List<Transaction> getTransactions(String userId);

    @Query("SELECT * FROM transactions WHERE id = :id")
    Transaction getTransactionById(String id);

    @Update
    void updateTransaction(Transaction transaction);
}
