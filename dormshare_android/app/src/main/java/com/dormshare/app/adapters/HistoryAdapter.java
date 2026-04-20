package com.dormshare.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.dormshare.app.R;
import com.dormshare.app.db.Item;
import com.dormshare.app.db.Transaction;
import com.google.android.material.button.MaterialButton;
import java.util.List;
import java.util.Map;

public class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.HistoryViewHolder> {
    private final List<Transaction> transactions;
    private final Map<String, Item> itemsMap;
    private final String currentUserId;
    private final OnTransactionClickListener listener;

    public interface OnTransactionClickListener {
        void onVerifyClick(Transaction transaction, String mode);
    }

    public HistoryAdapter(List<Transaction> transactions, Map<String, Item> itemsMap, String currentUserId, OnTransactionClickListener listener) {
        this.transactions = transactions;
        this.itemsMap = itemsMap;
        this.currentUserId = currentUserId;
        this.listener = listener;
    }

    @NonNull
    @Override
    public HistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.transaction_item_card, parent, false);
        return new HistoryViewHolder(view);
    }

    static class HistoryViewHolder extends RecyclerView.ViewHolder {
        TextView tvItemName, tvStatus, tvRole, tvDate;
        MaterialButton btnVerify, btnChat;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            tvItemName = itemView.findViewById(R.id.tx_item_name);
            tvStatus = itemView.findViewById(R.id.tx_status);
            tvRole = itemView.findViewById(R.id.tx_role);
            tvDate = itemView.findViewById(R.id.tx_date);
            btnVerify = itemView.findViewById(R.id.btn_verify);
            btnChat = itemView.findViewById(R.id.btn_chat);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull HistoryViewHolder holder, int position) {
        Transaction tx = transactions.get(position);
        Item item = itemsMap.get(tx.itemId);
        
        holder.tvItemName.setText(item != null ? item.name : "Unknown Item");
        holder.tvStatus.setText(tx.status.toUpperCase());
        holder.tvDate.setText("Date: " + tx.date);

        holder.btnChat.setOnClickListener(v -> {
            android.content.Intent intent = new android.content.Intent(v.getContext(), com.dormshare.app.ChatActivity.class);
            intent.putExtra("transactionId", tx.id);
            v.getContext().startActivity(intent);
        });

        if (tx.lenderId.equals(currentUserId)) {
            holder.tvRole.setText("Lending to Borrower #" + tx.borrowerId.substring(0, 5) + "...");
            if ("pending".equals(tx.status)) {
                holder.btnVerify.setVisibility(View.VISIBLE);
                holder.btnVerify.setText("Show QR");
                holder.btnVerify.setOnClickListener(v -> listener.onVerifyClick(tx, "show"));
            } else {
                holder.btnVerify.setVisibility(View.GONE);
            }
        } else {
            holder.tvRole.setText("Borrowing from Lender #" + tx.lenderId.substring(0, 5) + "...");
            if ("pending".equals(tx.status)) {
                holder.btnVerify.setVisibility(View.VISIBLE);
                holder.btnVerify.setText("Scan QR");
                holder.btnVerify.setOnClickListener(v -> listener.onVerifyClick(tx, "scan"));
            } else {
                holder.btnVerify.setVisibility(View.GONE);
            }
        }
    }

    @Override
    public int getItemCount() {
        return transactions.size();
    }
}
