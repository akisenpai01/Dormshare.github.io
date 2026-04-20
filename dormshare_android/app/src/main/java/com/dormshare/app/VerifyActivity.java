package com.dormshare.app;

import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.dormshare.app.api.ApiClient;
import com.dormshare.app.utils.SessionManager;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.BarcodeEncoder;
import com.journeyapps.barcodescanner.CompoundBarcodeView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VerifyActivity extends AppCompatActivity {
    private ImageView qrImage;
    private CompoundBarcodeView barcodeScanner;
    private TextView tvTitle, tvSubtitle, tvRole;
    private SessionManager sessionManager;
    
    private String txId;
    private String mode; // "show" or "scan"

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verify);

        sessionManager = new SessionManager(this);
        txId = getIntent().getStringExtra("txId");
        mode = getIntent().getStringExtra("mode");

        qrImage = findViewById(R.id.qr_image);
        barcodeScanner = findViewById(R.id.barcode_scanner);
        tvTitle = findViewById(R.id.tv_verify_title);
        tvSubtitle = findViewById(R.id.tv_verify_subtitle);
        tvRole = findViewById(R.id.tv_verify_role);

        if ("show".equals(mode)) {
            tvRole.setText("LENDER VIEW");
            tvTitle.setText("Handoff Verification");
            tvSubtitle.setText("Show this code to the borrower to\nconfirm the item transfer.");
            qrImage.setVisibility(View.VISIBLE);
            generateQR();
        } else {
            tvRole.setText("BORROWER VIEW");
            tvTitle.setText("Scan Lender's Code");
            tvSubtitle.setText("Scan the QR code on the lender's\ndevice to complete the handoff.");
            barcodeScanner.setVisibility(View.VISIBLE);
            startScanning();
        }
    }

    private void generateQR() {
        String data = "dormshare:handoff:" + txId;
        MultiFormatWriter writer = new MultiFormatWriter();
        try {
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, 512, 512);
            BarcodeEncoder encoder = new BarcodeEncoder();
            Bitmap bitmap = encoder.createBitmap(bitMatrix);
            qrImage.setImageBitmap(bitmap);
        } catch (WriterException e) {
            e.printStackTrace();
        }
    }

    private void startScanning() {
        barcodeScanner.decodeSingle(result -> {
            String content = result.getText();
            if (content.startsWith("dormshare:handoff:")) {
                String scannedTxId = content.replace("dormshare:handoff:", "");
                if (scannedTxId.equals(txId)) {
                    completeHandoff();
                } else {
                    Toast.makeText(this, "Invalid Transaction QR", Toast.LENGTH_SHORT).show();
                    startScanning();
                }
            } else {
                Toast.makeText(this, "Not a DormShare QR", Toast.LENGTH_SHORT).show();
                startScanning();
            }
        });
        barcodeScanner.resume();
    }

    private void completeHandoff() {
        String token = sessionManager.getToken();

        ApiClient.getService().verifyHandoff(token, txId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(VerifyActivity.this, "Handoff Successful!", Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    Toast.makeText(VerifyActivity.this, "Verification failed on server", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(VerifyActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if ("scan".equals(mode)) barcodeScanner.resume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if ("scan".equals(mode)) barcodeScanner.pause();
    }
}

