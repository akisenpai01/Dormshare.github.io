package com.dormshare.app.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Intent;
import android.widget.Toast;
import com.dormshare.app.MainActivity;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.Item;
import com.dormshare.app.db.Transaction;
import com.dormshare.app.db.User;
import com.dormshare.app.utils.SessionManager;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HistoryFragment extends Fragment {
    private TextView walletBalance;
    private RecyclerView recyclerView;
    private HistoryAdapter adapter;
    private SessionManager sessionManager;
    private final List<Transaction> transactionList = new ArrayList<>();
    private final Map<String, Item> itemsMap = new HashMap<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_history, container, false);
        
        sessionManager = new SessionManager(requireContext());
        
        walletBalance = view.findViewById(R.id.wallet_balance);
        recyclerView = view.findViewById(R.id.recycler_history);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        
        loadData();
        return view;
    }

    private void loadData() {
        MainActivity activity = (MainActivity) getActivity();
        if (activity == null) return;
        
        String userId = sessionManager.getUserId();
        String token = sessionManager.getToken();

        ApiClient.getService().getHistory(token, userId).enqueue(new Callback<List<Transaction>>() {
            @Override
            public void onResponse(Call<List<Transaction>> call, Response<List<Transaction>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    transactionList.clear();
                    transactionList.addAll(response.body());
                    
                    adapter = new HistoryAdapter(transactionList, itemsMap, sessionManager.getUserId(), (tx, mode) -> {
                        Intent intent = new Intent(getActivity(), VerifyActivity.class);
                        intent.putExtra("txId", tx.id);
                        intent.putExtra("mode", mode);
                        startActivity(intent);
                    });
                    recyclerView.setAdapter(adapter);
                }
            }

            @Override
            public void onFailure(Call<List<Transaction>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Failed to load history", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        loadData();
    }
}
