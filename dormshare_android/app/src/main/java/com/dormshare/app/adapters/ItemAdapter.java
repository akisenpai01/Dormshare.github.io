package com.dormshare.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.dormshare.app.R;
import com.dormshare.app.db.Item;
import java.util.List;

public class ItemAdapter extends RecyclerView.Adapter<ItemAdapter.ItemViewHolder> {
    private final List<Item> items;
    private final OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(Item item);
        void onBorrowClick(Item item);
    }

    public ItemAdapter(List<Item> items, OnItemClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_card, parent, false);
        return new ItemViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        Item item = items.get(position);
        holder.tvName.setText(item.name);
        holder.tvCost.setText("$" + item.tokenCost + "/day");
        holder.tvCategory.setText(item.category);
        holder.tvBadge.setText("● " + item.status.toUpperCase());
        
        holder.tvFooterText.setText("Listed by you");
        holder.tvStatusMeta.setText("Borrowed by Sarah K.");

        // Show chat button if the item is borrowed
        if ("borrowed".equals(item.status)) {
            holder.btnChat.setVisibility(View.VISIBLE);
            holder.btnChat.setOnClickListener(v -> {
                android.content.Intent intent = new android.content.Intent(v.getContext(), com.dormshare.app.ChatActivity.class);
                // We'd ideally have a transactionId here. For now, we'll use item ID or a placeholder.
                intent.putExtra("transactionId", "item_" + item.id); 
                v.getContext().startActivity(intent);
            });
        } else {
            holder.btnChat.setVisibility(View.GONE);
        }

        holder.itemView.setOnClickListener(v -> listener.onItemClick(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ItemViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvCost, tvBadge, tvCategory, tvFooterText, tvStatusMeta;
        ImageView ivItemImage;
        View btnChat;

        public ItemViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.item_name);
            tvCost = itemView.findViewById(R.id.item_cost);
            tvBadge = itemView.findViewById(R.id.item_badge);
            tvCategory = itemView.findViewById(R.id.item_category);
            tvFooterText = itemView.findViewById(R.id.item_footer_text);
            tvStatusMeta = itemView.findViewById(R.id.item_status_meta);
            ivItemImage = itemView.findViewById(R.id.iv_item_image);
            btnChat = itemView.findViewById(R.id.btn_item_chat);
        }
    }
}


