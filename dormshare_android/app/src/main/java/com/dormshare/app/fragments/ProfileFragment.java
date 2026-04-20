package com.dormshare.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.dormshare.app.AddItemActivity;
import com.dormshare.app.LoginActivity;
import com.dormshare.app.MainActivity;
import com.dormshare.app.R;
import com.dormshare.app.adapters.ItemAdapter;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.Item;
import com.dormshare.app.db.User;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {
    private TextView tvName, tvLocation, tvReliability, tvActiveLoans, tvTotalEarnings;
    private FloatingActionButton fabAdd;
    private View btnLogout;
    private RecyclerView recyclerView;
    private ItemAdapter adapter;
    private final List<Item> myItems = new ArrayList<>();
    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_profile, container, false);
        
        sessionManager = new SessionManager(requireContext());
        
        tvName = view.findViewById(R.id.tv_profile_name);
        tvLocation = view.findViewById(R.id.tv_profile_location);
        tvReliability = view.findViewById(R.id.tv_reliability_score);
        tvActiveLoans = view.findViewById(R.id.tv_active_loans);
        tvTotalEarnings = view.findViewById(R.id.tv_total_earnings);
        fabAdd = view.findViewById(R.id.fab_add_listing);
        btnLogout = view.findViewById(R.id.btn_logout);
        recyclerView = view.findViewById(R.id.recycler_my_listings);

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        adapter = new ItemAdapter(myItems, new ItemAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Item item) {
                // Handle item click
            }

            @Override
            public void onBorrowClick(Item item) {
                // Not used in lending dashboard
            }
        });
        recyclerView.setAdapter(adapter);

        loadUserData();
        loadUserListings();

        btnLogout.setOnClickListener(v -> {
            sessionManager.logout();
            Intent intent = new Intent(getActivity(), LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });

        fabAdd.setOnClickListener(v -> {
            startActivity(new Intent(getActivity(), AddItemActivity.class));
        });

        return view;
    }

    private void loadUserData() {
        if (getActivity() instanceof MainActivity) {
            User user = ((MainActivity) getActivity()).getCurrentUser();
            if (user != null) {
                tvName.setText(user.name);
                tvLocation.setText("UPES Student • " + user.hostelBlock);
                tvReliability.setText(String.format("%.1f%% Reliable", user.trustScore * 20));
                tvTotalEarnings.setText(user.tokens + " Tokens");
            }
        }
    }

    private void loadUserListings() {
        String userId = String.valueOf(sessionManager.getUserId());
        String token = sessionManager.getToken();

        ApiClient.getService().getUserItems(token, userId).enqueue(new Callback<List<Item>>() {
            @Override
            public void onResponse(Call<List<Item>> call, Response<List<Item>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    myItems.clear();
                    myItems.addAll(response.body());
                    adapter.notifyDataSetChanged();
                    tvActiveLoans.setText(String.valueOf(myItems.size()));
                }
            }

            @Override
            public void onFailure(Call<List<Item>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Failed to load listings", Toast.LENGTH_SHORT).show();
            }
        });
    }
}

