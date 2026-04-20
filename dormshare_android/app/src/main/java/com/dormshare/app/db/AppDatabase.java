package com.dormshare.app.db;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

@Database(entities = {User.class, Item.class, Transaction.class}, version = 2)
@Database(entities = {User.class, Item.class, Transaction.class}, version = 3)
public abstract class AppDatabase extends RoomDatabase {
    private static AppDatabase instance;

    public abstract DormDao dormDao();

    public static synchronized AppDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(context.getApplicationContext(),
                            AppDatabase.class, "dormshare_db")
                    .fallbackToDestructiveMigration()
                    .build();
        }
        return instance;
    }
}
