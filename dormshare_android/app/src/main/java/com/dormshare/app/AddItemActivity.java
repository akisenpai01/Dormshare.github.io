package com.dormshare.app;

import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.dormshare.app.db.AppDatabase;
import com.dormshare.app.db.Item;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.dormshare.app.api.ApiClient;
import java.util.UUID;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddItemActivity extends AppCompatActivity {
    private TextInputEditText etName, etCategory, etCost, etLocation, etDescription;
    private MaterialButton btnSubmit;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_item);

        sessionManager = new SessionManager(this);

        etName = findViewById(R.id.add_et_name);
        etCategory = findViewById(R.id.add_et_category);
        etCost = findViewById(R.id.add_et_cost);
        etLocation = findViewById(R.id.add_et_location);
        etDescription = findViewById(R.id.add_et_description);
        btnSubmit = findViewById(R.id.btn_submit_item);

        btnSubmit.setOnClickListener(v -> handleSubmit());
    }

    private void handleSubmit() {
        String name = etName.getText().toString().trim();
        String category = etCategory.getText().toString().trim();
        String costStr = etCost.getText().toString().trim();
        String location = etLocation.getText().toString().trim();
        String description = etDescription.getText().toString().trim();

        if (name.isEmpty() || category.isEmpty() || costStr.isEmpty() || location.isEmpty() || description.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        int cost = Integer.parseInt(costStr);
        String token = sessionManager.getToken();
        String userId = sessionManager.getUserId();

        Item newItem = new Item(
            UUID.randomUUID().toString(),
            userId,
            name,
            category,
            "New",
            cost,
            "available",
            location,
            description
        );

        ApiClient.getService().addItem(token, newItem).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(AddItemActivity.this, "Item listed successfully!", Toast.LENGTH_SHORT).show();
                    finish();
                } else {
                    Toast.makeText(AddItemActivity.this, "Server error", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(AddItemActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
