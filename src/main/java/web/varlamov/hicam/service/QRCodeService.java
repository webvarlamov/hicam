package web.varlamov.hicam.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import org.springframework.stereotype.Service;

@Service
public class QRCodeService {
  QRCodeWriter qrCodeWriter = new QRCodeWriter();

  public BufferedImage getQRCodeBufferedImage(String text) throws WriterException {
    BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200);
    return MatrixToImageWriter.toBufferedImage(bitMatrix);
  }

  public byte[] getQRCodeByteArray(String text) throws WriterException, IOException {
    BufferedImage bufferedImage = getQRCodeBufferedImage(text);
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    ImageIO.write(bufferedImage, "png", byteArrayOutputStream);
    return byteArrayOutputStream.toByteArray();
  }
}
