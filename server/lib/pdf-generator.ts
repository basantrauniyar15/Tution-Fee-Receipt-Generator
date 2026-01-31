import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { type InsertReceipt } from '@shared/schema';
import { getTuitionPeriod } from './nepali-date';

import path from 'path';
import fs from 'fs';

export async function generatePdf(data: InsertReceipt): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // --- ASSETS ---
      const assetsDir = path.join(process.cwd(), 'client', 'public', 'assets');
      const bankQrPath = path.join(assetsDir, 'bank_qr.jpg');
      const esewaQrPath = path.join(assetsDir, 'esewa_qr.jpg');
      const signaturePath = path.join(assetsDir, 'signature.png');

      // --- LAYOUT ---
      // 1. Title
      doc.font('Helvetica-Bold').fontSize(20).text('TUITION FEE REMINDER', { align: 'center' });
      doc.moveDown(1.5);

      // 2. Header Info (Left & Right)
      const startY = doc.y;
      
      // Left: Date Issued, Issued By
      doc.fontSize(10).font('Helvetica');
      doc.text(`Date Issued: ${new Date().toISOString().split('T')[0]}`);
      doc.text('Issued By: Bablu Rauniyar');

      // Right: Contact Info
      doc.text('misubablu1@gmail.com', 400, startY, { align: 'right' });
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
      doc.text('Account No: 0930100000097010');
      doc.text('Account Name: Bablu Kumar Rauniyar');
      doc.moveDown(0.5);
      doc.text('Esewa ID: 9804028522');

      doc.moveDown(1);

      // 6. QR Codes
      const qrY = doc.y;
      
      // Bank QR
      if (fs.existsSync(bankQrPath)) {
        doc.image(bankQrPath, 50, qrY, { fit: [120, 120] });
      }
      doc.text('Bank QR', 50, qrY + 125, { width: 120, align: 'center' });

      // Esewa QR
      if (fs.existsSync(esewaQrPath)) {
        doc.image(esewaQrPath, 200, qrY, { fit: [120, 120] });
      }
      doc.text('Esewa QR', 200, qrY + 125, { width: 120, align: 'center' });

      // 7. Signature
      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, 420, qrY + 10, { fit: [140, 70] });
      }
      // Draw line manually for signature
      doc.moveTo(420, qrY + 82).lineTo(560, qrY + 82).stroke();
      doc.fontSize(11).font('Helvetica-Bold').text('Bablu Rauniyar', 420, qrY + 85, { width: 140, align: 'center' });
      doc.fontSize(9).font('Helvetica').text('Signature', 420, qrY + 100, { width: 140, align: 'center' });

      // 8. Footer
      doc.moveDown(4);
      doc.fontSize(14).font('Helvetica-Bold').text('THANK YOU', { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}
