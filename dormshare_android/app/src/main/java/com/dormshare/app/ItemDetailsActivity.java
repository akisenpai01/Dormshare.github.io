package com.dormshare.app;

import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.Item;
import com.dormshare.app.db.Transaction;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.button.MaterialButton;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ItemDetailsActivity extends AppCompatActivity {
    private TextView tvName, tvLocation;
    private MaterialButton btnRequest;
    private SessionManager sessionManager;
    private String itemId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_item_details);

        sessionManager = new SessionManager(this);
        itemId = getIntent().getStringExtra("itemId");

        tvName = findViewById(R.id.details_name);
        tvLocation = findViewById(R.id.details_location);
        btnRequest = findViewById(R.id.btn_request);

        loadItemDetails();

        btnRequest.setOnClickListener(v -> handleRequest());
    }

    private void loadItemDetails() {
        // In a real app, load item by ID. For now, name is handled by the intent or default.
        if (itemId != null) {
            // tvName.setText(...);
        }
    }

    private void handleRequest() {
        if (itemId == null) return;
        
        String token = sessionManager.getToken();
        String userId = sessionManager.getUserId();
        String date = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());

        Transaction tx = new Transaction(java.util.UUID.randomUUID().toString(), itemId, userId, "owner_id", 0, "pending", date);

        ApiClient.getService().requestItem(token, tx).enqueue(new Callback<Transaction>() {
            @Override
            public void onResponse(Call<Transaction> call, Response<Transaction> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(ItemDetailsActivity.this, "Borrow Request Sent!", Toast.LENGTH_SHORT).show();
                    btnRequest.setEnabled(false);
                    btnRequest.setText("Pending...");
                } else {
                    Toast.makeText(ItemDetailsActivity.this, "Request failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Transaction> call, Throwable t) {
                Toast.makeText(ItemDetailsActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }
}

