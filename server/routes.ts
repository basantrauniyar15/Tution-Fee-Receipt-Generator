import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { generatePdf } from "./lib/pdf-generator";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.receipts.generate.path, async (req, res) => {
    try {
      const input = api.receipts.generate.input.parse(req.body);
      
      // Log for debugging/history (optional)
      await storage.logReceipt(input);

      const pdfBuffer = await generatePdf(input);

      const filename = `Tuition_Fee_${input.studentName.replace(/\s+/g, '_')}_${input.year}-${input.month}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(pdfBuffer);

    } catch (err) {
      console.error('PDF Generation Error:', err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  return httpServer;
}
