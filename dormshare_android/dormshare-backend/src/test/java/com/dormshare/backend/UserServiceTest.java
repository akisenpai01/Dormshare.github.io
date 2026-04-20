package com.dormshare.backend;

import com.dormshare.backend.model.User;
import com.dormshare.backend.repository.UserRepository;
import com.dormshare.backend.security.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class UserServiceTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    public void testAuthenticationLogic() {
        User mockUser = new User("Test User", "test@stu.upes.ac.in", "pass123", "Block A");
        mockUser.setId("12345");

        when(userRepository.findByEmail("test@stu.upes.ac.in")).thenReturn(Optional.of(mockUser));

        // Test Token Generation
        String token = jwtUtils.generateJwtToken(mockUser.getEmail());
        assertNotNull(token);

        // Test Token Validation
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("test@stu.upes.ac.in", jwtUtils.getEmailFromJwtToken(token));
    }

    @Test
    public void testUserCreation() {
        User newUser = new User("New Student", "new@stu.upes.ac.in", "securePassword", "Block B");
        
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        
        userRepository.save(newUser);
        verify(userRepository, times(1)).save(newUser);
    }
}
