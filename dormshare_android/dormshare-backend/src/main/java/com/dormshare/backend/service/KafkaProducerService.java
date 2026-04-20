package com.dormshare.backend.service;

import com.dormshare.backend.model.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private static final String TOPIC = "handoff-events";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendHandoffEvent(Transaction transaction) {
        kafkaTemplate.send(TOPIC, transaction);
    }
}
