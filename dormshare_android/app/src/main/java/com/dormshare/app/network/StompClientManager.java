package com.dormshare.app.network;

import android.util.Log;
import com.dormshare.app.db.ChatMessage;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import io.reactivex.CompletableTransformer;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import ua.naiksoftware.stomp.Stomp;
import ua.naiksoftware.stomp.StompClient;
import ua.naiksoftware.stomp.dto.StompHeader;

public class StompClientManager {
    private static final String TAG = "StompClientManager";
    private StompClient mStompClient;
    private CompositeDisposable compositeDisposable;
    private final Gson gson = new Gson();
    private ChatMessageListener listener;

    public interface ChatMessageListener {
        void onNewMessage(ChatMessage message);
        void onError(Throwable e);
    }

    public StompClientManager(String baseUrl, String token) {
        // Build the websocket URL. e.g. ws://10.0.2.2:8080/ws-chat
        String wsUrl = baseUrl.replace("http", "ws") + "ws-chat";
        
        List<StompHeader> headers = new ArrayList<>();
        headers.add(new StompHeader("Authorization", token));

        mStompClient = Stomp.over(Stomp.ConnectionProvider.OKHTTP, wsUrl);
        mStompClient.withClientHeartbeat(10000).withServerHeartbeat(10000);
    }

    public void connect(String transactionId, ChatMessageListener listener) {
        this.listener = listener;
        if (compositeDisposable != null) compositeDisposable.dispose();
        compositeDisposable = new CompositeDisposable();

        mStompClient.lifecycle()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(lifecycleEvent -> {
                    switch (lifecycleEvent.getType()) {
                        case OPENED:
                            Log.d(TAG, "Stomp connection opened");
                            break;
                        case ERROR:
                            Log.e(TAG, "Stomp connection error", lifecycleEvent.getException());
                            if (listener != null) listener.onError(lifecycleEvent.getException());
                            break;
                        case CLOSED:
                            Log.d(TAG, "Stomp connection closed");
                            break;
                    }
                });

        mStompClient.connect();

        // Subscribe to messages for this transaction
        Disposable topicDisposable = mStompClient.topic("/topic/messages/" + transactionId)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(topicMessage -> {
                    Log.d(TAG, "Received message: " + topicMessage.getPayload());
                    ChatMessage msg = gson.fromJson(topicMessage.getPayload(), ChatMessage.class);
                    if (listener != null) listener.onNewMessage(msg);
                }, throwable -> {
                    Log.e(TAG, "Error on subscribe", throwable);
                });

        compositeDisposable.add(topicDisposable);
    }

    public void sendMessage(ChatMessage message) {
        String json = gson.toJson(message);
        compositeDisposable.add(mStompClient.send("/app/chat.send", json)
                .compose(applySchedulers())
                .subscribe(() -> {
                    Log.d(TAG, "STOMP echo send successfully");
                }, throwable -> {
                    Log.e(TAG, "Error send STOMP echo", throwable);
                }));
    }

    public void disconnect() {
        if (mStompClient != null) mStompClient.disconnect();
        if (compositeDisposable != null) compositeDisposable.dispose();
    }

    protected CompletableTransformer applySchedulers() {
        return upstream -> upstream
                .unsubscribeOn(Schedulers.newThread())
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }
}
