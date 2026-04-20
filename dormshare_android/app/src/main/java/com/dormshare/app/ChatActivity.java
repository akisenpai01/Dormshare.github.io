package com.dormshare.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.dormshare.app.adapters.ChatAdapter;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.ChatMessage;
import com.dormshare.app.network.StompClientManager;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private ChatAdapter adapter;
    private EditText etMessage;
    private FloatingActionButton btnSend;
    private View btnAttach;
    
    private StompClientManager stompManager;
    private SessionManager sessionManager;
    private String transactionId;
    private final List<ChatMessage> messages = new ArrayList<>();

    private final ActivityResultLauncher<String> imagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    uploadImage(uri);
                }
            }
    );

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        sessionManager = new SessionManager(this);
        transactionId = getIntent().getStringExtra("transactionId");

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setNavigationOnClickListener(v -> finish());

        recyclerView = findViewById(R.id.recycler_chat);
        etMessage = findViewById(R.id.et_message);
        btnSend = findViewById(R.id.btn_send);
        btnAttach = findViewById(R.id.btn_attach);

        adapter = new ChatAdapter(messages, sessionManager.getUserId());
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        stompManager = new StompClientManager("http://10.0.2.2:8080/", sessionManager.getToken());

        loadHistory();
        connectWebSocket();

        btnSend.setOnClickListener(v -> sendMessage());
        btnAttach.setOnClickListener(v -> imagePickerLauncher.launch("image/*"));
    }

    private void connectWebSocket() {
        stompManager.connect(transactionId, new StompClientManager.ChatMessageListener() {
            @Override
            public void onNewMessage(ChatMessage message) {
                runOnUiThread(() -> {
                    messages.add(message);
                    adapter.notifyItemInserted(messages.size() - 1);
                    recyclerView.smoothScrollToPosition(messages.size() - 1);
                });
            }

            @Override
            public void onError(Throwable e) {
                runOnUiThread(() -> Toast.makeText(ChatActivity.this, "WebSocket Error", Toast.LENGTH_SHORT).show());
            }
        });
    }

    private void loadHistory() {
        ApiClient.getService().getChatHistory(sessionManager.getToken(), transactionId).enqueue(new Callback<List<ChatMessage>>() {
            @Override
            public void onResponse(Call<List<ChatMessage>> call, Response<List<ChatMessage>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    messages.addAll(response.body());
                    adapter.notifyDataSetChanged();
                    if (!messages.isEmpty()) recyclerView.scrollToPosition(messages.size() - 1);
                }
            }

            @Override
            public void onFailure(Call<List<ChatMessage>> call, Throwable t) {
                Toast.makeText(ChatActivity.this, "Failed to load history", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void sendMessage() {
        String content = etMessage.getText().toString().trim();
        if (content.isEmpty()) return;

        ChatMessage msg = new ChatMessage(transactionId, sessionManager.getUserId(), content, null);
        stompManager.sendMessage(msg);
        etMessage.setText("");
    }

    private void uploadImage(Uri uri) {
        try {
            File file = new File(getCacheDir(), "temp_chat_image.jpg");
            InputStream is = getContentResolver().openInputStream(uri);
            FileOutputStream fos = new FileOutputStream(file);
            byte[] buf = new byte[1024];
            int len;
            while ((len = is.read(buf)) > 0) fos.write(buf, 0, len);
            fos.close();
            is.close();

            RequestBody requestFile = RequestBody.create(MediaType.parse("image/jpeg"), file);
            MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);

            ApiClient.getService().uploadChatImage(sessionManager.getToken(), body).enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        try {
                            String imageUrl = response.body().string();
                            ChatMessage msg = new ChatMessage(transactionId, sessionManager.getUserId(), "", imageUrl);
                            stompManager.sendMessage(msg);
                        } catch (Exception e) { e.printStackTrace(); }
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(ChatActivity.this, "Image upload failed", Toast.LENGTH_SHORT).show();
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (stompManager != null) stompManager.disconnect();
    }
}
