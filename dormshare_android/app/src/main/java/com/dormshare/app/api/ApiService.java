package com.dormshare.app.api;

import com.dormshare.backend.model.Item;
import com.dormshare.backend.model.Transaction;
import com.dormshare.backend.model.User;
import java.util.List;
import java.util.Map;
import com.dormshare.app.db.ChatMessage;
import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    @POST("api/auth/signin")
    Call<Map<String, Object>> login(@Body Map<String, String> credentials);

    @POST("api/auth/signup")
    Call<Void> register(@Body User user);

    @GET("api/market/items")
    Call<List<com.dormshare.app.db.Item>> getMarketItems(@Header("Authorization") String token, @Query("currentUserId") String userId);

    @POST("api/market/add")
    Call<Void> addItem(@Header("Authorization") String token, @Body com.dormshare.app.db.Item item);

    @POST("api/transactions/request")
    Call<com.dormshare.app.db.Transaction> requestItem(@Header("Authorization") String token, @Body com.dormshare.app.db.Transaction tx);

    @POST("api/transactions/verify/{id}")
    Call<Void> verifyHandoff(@Header("Authorization") String token, @Path("id") String txId);

    @GET("api/transactions/history")
    Call<List<com.dormshare.app.db.Transaction>> getHistory(@Header("Authorization") String token, @Query("userId") String userId);

    @GET("api/chat/{transactionId}")
    Call<List<ChatMessage>> getChatHistory(@Header("Authorization") String token, @Path("transactionId") String transactionId);

    @Multipart
    @POST("api/chat/image")
    Call<ResponseBody> uploadChatImage(@Header("Authorization") String token, @Part MultipartBody.Part file);
}
