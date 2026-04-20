package com.dormshare.app.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.BarcodeEncoder;

public class QRHelper {
    
    /**
     * Generates a QR code bitmap for a transaction handoff.
     * @param txnId The transaction ID to embed in the QR.
     * @return Bitmap of the QR code.
     */
    public static Bitmap generateHandoffQR(String txnId) {
        MultiFormatWriter writer = new MultiFormatWriter();
        try {
            BitMatrix bitMatrix = writer.encode("DORMSHARE_TXN_" + txnId, BarcodeFormat.QR_CODE, 512, 512);
            BarcodeEncoder encoder = BarcodeEncoder.getInstance();
            return encoder.createBitmap(bitMatrix);
        } catch (WriterException e) {
            e.printStackTrace();
            return null;
        }
    }
}
