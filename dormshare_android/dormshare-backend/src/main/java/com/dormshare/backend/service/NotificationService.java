package com.dormshare.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastMarketUpdate() {
        messagingTemplate.convertAndSend("/topic/market", "DATA_UPDATE");
    }

    public void broadcastTransactionUpdate() {
        messagingTemplate.convertAndSend("/topic/transactions", "DATA_UPDATE");
    }

    public void sendTargetedNotification(String userId, Object payload) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", payload);
    }
}
