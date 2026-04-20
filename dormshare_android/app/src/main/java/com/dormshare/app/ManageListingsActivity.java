package com.dormshare.app;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.dormshare.app.adapters.ItemAdapter;
import com.dormshare.app.db.AppDatabase;
import com.dormshare.app.db.Item;
import com.dormshare.app.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ManageListingsActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private ItemAdapter adapter;
    private final List<Item> myListings = new ArrayList<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manage_listings);

        sessionManager = new SessionManager(this);
        recyclerView = findViewById(R.id.recycler_my_items);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        adapter = new ItemAdapter(myListings, new ItemAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Item item) {
                // View my own item details
            }

            @Override
            public void onBorrowClick(Item item) {
                // Can't borrow my own item
            }
        });
        recyclerView.setAdapter(adapter);

        loadMyListings();
    }

    private void loadMyListings() {
        executor.execute(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            List<Item> items = db.dormDao().getMyItems(sessionManager.getUserId());
            runOnUiThread(() -> {
                myListings.clear();
                myListings.addAll(items);
                adapter.notifyDataSetChanged();
            });
        });
    }
}
