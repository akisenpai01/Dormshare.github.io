import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.db.User;
import com.dormshare.app.utils.SessionManager;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {
    private User currentUser;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        sessionManager = new SessionManager(this);
        if (!sessionManager.isLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_main);

        setupNavigation();
        loadUser();
    }

    private void setupNavigation() {
        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment);
        if (navHostFragment != null) {
            NavController navController = navHostFragment.getNavController();
            BottomNavigationView bottomNav = findViewById(R.id.bottom_nav);
            NavigationUI.setupWithNavController(bottomNav, navController);
        }
    }

    private void loadUser() {
        // In a real app, I'd fetch the latest user profile from the backend.
        // For now, we rely on the session being valid. 
        // If the session exists, we assume the user is authorized.
        String userId = sessionManager.getUserId();
        if (userId == null) {
            sessionManager.logout();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        }
    }

    public com.dormshare.app.db.User getCurrentUser() {
        // Return a dummy user or fetch from backend
        return null;
    }
}
