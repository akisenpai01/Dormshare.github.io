package com.dormshare.backend.controller;

import com.dormshare.backend.model.ChatMessage;
import com.dormshare.backend.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final String UPLOAD_DIR = "uploads/chat/";

    @GetMapping("/{transactionId}")
    public List<ChatMessage> getChatHistory(@PathVariable String transactionId) {
        return chatMessageRepository.findByTransactionIdOrderByTimestampAsc(transactionId);
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(String.valueOf(System.currentTimeMillis()));
        ChatMessage saved = chatMessageRepository.save(chatMessage);
        
        // Broadcast to the specific transaction topic
        messagingTemplate.convertAndSend("/topic/messages/" + chatMessage.getTransactionId(), saved);
    }

    @PostMapping("/image")
    public String uploadChatImage(@RequestParam("file") MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/chat/" + fileName;
    }
}
