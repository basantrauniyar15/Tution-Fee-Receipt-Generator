import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  day: integer("day").notNull(),
  fee: integer("fee").notNull(),
  generatedAt: text("generated_at").notNull(),
});

export const insertReceiptSchema = createInsertSchema(receipts).pick({
  studentName: true,
  year: true,
  month: true,
  day: true,
  fee: true,
});

export const generatePdfSchema = insertReceiptSchema;

export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receipts.$inferSelect;
