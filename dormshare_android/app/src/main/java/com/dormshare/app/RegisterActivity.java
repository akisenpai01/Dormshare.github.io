package com.dormshare.app;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.User;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {
    private TextInputEditText etName, etEmail, etPassword, etBlock;
    private MaterialButton btnRegister;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        sessionManager = new SessionManager(this);

        etName = findViewById(R.id.et_name);
        etEmail = findViewById(R.id.et_email);
        etPassword = findViewById(R.id.et_password);
        etBlock = findViewById(R.id.et_block);
        btnRegister = findViewById(R.id.btn_register);

        btnRegister.setOnClickListener(v -> handleRegister());
    }

    private void handleRegister() {
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String block = etBlock.getText().toString().trim();

        if (name.isEmpty() || email.isEmpty() || password.isEmpty() || block.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!email.endsWith("@stu.upes.ac.in")) {
            Toast.makeText(this, "Please use your UPES student email", Toast.LENGTH_SHORT).show();
            return;
        }

        // Generate a temporary ID or let backend handle it (Backend is preferred)
        // For registration, we'll send a User object with a dummy ID that backend will override.
        com.dormshare.backend.model.User backendUser = new com.dormshare.backend.model.User(name, email, password, block);

        ApiClient.getService().register(backendUser).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(RegisterActivity.this, "Registration successful! Please login.", Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    Toast.makeText(RegisterActivity.this, "Registration failed", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(RegisterActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
