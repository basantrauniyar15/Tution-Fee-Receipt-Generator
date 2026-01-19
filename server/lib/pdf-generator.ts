import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { type InsertReceipt } from '@shared/schema';
import { getTuitionPeriod } from './nepali-date';

export async function generatePdf(data: InsertReceipt): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // --- ASSETS GENERATION ---
      // Generate QR Codes
      const bankQrBuffer = await QRCode.toBuffer('09301000009700'); // Bank Account
      const esewaQrBuffer = await QRCode.toBuffer('9804028522');     // Esewa ID

      // --- LAYOUT ---

      // 1. Title
      doc.font('Helvetica-Bold').fontSize(20).text('TUITION FEE REMINDER', { align: 'center' });
      doc.moveDown(1.5);

      // 2. Header Info (Left & Right)
      const startY = doc.y;
      
      // Left: Date Issued, Issued By
      doc.fontSize(10).font('Helvetica');
      doc.text(`Date Issued: ${new Date().toISOString().split('T')[0]}`); // Simple YYYY-MM-DD
      doc.text('Issued By: Bablu Rauniyar');

      // Right: Contact Info
      doc.text('misubabul@gmail.com', 400, startY, { align: 'right' });
      doc.text('+977-9804028522', 400, doc.y, { align: 'right' });

      doc.moveDown(2);

      // 3. Main Body
      const { from, to } = getTuitionPeriod(data.year, data.month, data.day);

      doc.font('Helvetica').fontSize(12);
      doc.text(`I hereby request you to pay the tuition fee of Master/Miss ${data.studentName}`, 50, doc.y, { align: 'left' });
      doc.moveDown(0.5);
      doc.text(`from ${from} to ${to}.`, { align: 'left' });
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text(`Amount: ${data.fee}`, { continued: true });
      doc.font('Helvetica').text(' Kindly make the payment on time.');
      
      doc.moveDown(2);

      // 4. Quote
      doc.font('Helvetica-Oblique').fontSize(12).text('“Keep learning, keep growing.”', { align: 'center' });
      
      doc.moveDown(2);

      // 5. Payment Info Section
      doc.font('Helvetica-Bold').fontSize(12).text('Payment Info:', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(10).font('Helvetica');
      doc.text('Citizen Bank International LTD.');
      doc.text('Account No: 09301000009700');
      doc.text('Account Name: Bablu Kumar Rauniyar');
      doc.moveDown(0.5);
      doc.text('Esewa ID: 9804028522');

      doc.moveDown(1);

      // 6. QR Codes
      const qrY = doc.y;
      // Bank QR
      doc.image(bankQrBuffer, 50, qrY, { fit: [100, 100] });
      doc.text('Bank QR', 50, qrY + 105, { width: 100, align: 'center' });

      // Esewa QR
      doc.image(esewaQrBuffer, 180, qrY, { fit: [100, 100] });
      doc.text('Esewa QR', 180, qrY + 105, { width: 100, align: 'center' });

      // 7. Signature
      // Since we don't have an image, we'll use a script-like font or just text "Signed"
      // Standard fonts in PDFKit: Courier, Helvetica, Times, Symbol, ZapfDingbats.
      // None are script. We'll simulate a signature with Italic.
      
      doc.fontSize(12).font('Times-Italic');
      doc.text('Bablu Rauniyar', 400, qrY + 80, { align: 'right' });
      doc.fontSize(10).font('Helvetica').text('Signature', 400, qrY + 95, { align: 'right' });

      // 8. Footer
      doc.moveDown(4);
      doc.fontSize(14).font('Helvetica-Bold').text('THANK YOU', { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}
