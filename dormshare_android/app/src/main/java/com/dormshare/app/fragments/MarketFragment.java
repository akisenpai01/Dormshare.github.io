package com.dormshare.app.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Intent;
import android.text.Editable;
import android.text.TextWatcher;
import com.dormshare.app.AddItemActivity;
import com.dormshare.app.ItemDetailsActivity;
import com.dormshare.app.LoginActivity;
import com.dormshare.app.MainActivity;
import com.dormshare.app.R;
import com.dormshare.app.adapters.ItemAdapter;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.Item;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MarketFragment extends Fragment {
    private RecyclerView recyclerView;
    private ItemAdapter adapter;
    private EditText etSearch;
    private SessionManager sessionManager;
    private FloatingActionButton fabAdd;
    private final List<Item> itemList = new ArrayList<>();
    private final List<Item> filteredList = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_market, container, false);
        
        sessionManager = new SessionManager(requireContext());
        
        recyclerView = view.findViewById(R.id.recycler_market);
        etSearch = view.findViewById(R.id.et_search);
        fabAdd = view.findViewById(R.id.fab_add_item);
        
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        
        adapter = new ItemAdapter(filteredList, new ItemAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Item item) {
                Intent intent = new Intent(getActivity(), ItemDetailsActivity.class);
                intent.putExtra("itemId", item.id);
                startActivity(intent);
            }

            @Override
            public void onBorrowClick(Item item) {
                Intent intent = new Intent(getActivity(), ItemDetailsActivity.class);
                intent.putExtra("itemId", item.id);
                startActivity(intent);
            }
        });
        
        recyclerView.setAdapter(adapter);
        
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterItems(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        fabAdd.setOnClickListener(v -> {
            startActivity(new Intent(getActivity(), AddItemActivity.class));
        });

        loadMarketItems();
        return view;
    }

    private void filterItems(String query) {
        filteredList.clear();
        for (Item item : itemList) {
            if (item.name.toLowerCase().contains(query.toLowerCase()) || 
                item.category.toLowerCase().contains(query.toLowerCase())) {
                filteredList.add(item);
            }
        }
        adapter.notifyDataSetChanged();
    }

    private void loadMarketItems() {
        String userId = String.valueOf(sessionManager.getUserId());
        String token = sessionManager.getToken();

        ApiClient.getService().getMarketItems(token, userId).enqueue(new Callback<List<Item>>() {
            @Override
            public void onResponse(Call<List<Item>> call, Response<List<Item>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    itemList.clear();
                    itemList.addAll(response.body());
                    filterItems(etSearch.getText().toString());
                } else if (response.code() == 401) {
                    sessionManager.logout();
                    startActivity(new Intent(getActivity(), LoginActivity.class));
                }
            }

            @Override
            public void onFailure(Call<List<Item>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Failed to load market", Toast.LENGTH_SHORT).show();
            }
        });
    }
}

