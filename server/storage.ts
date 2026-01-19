import { type Receipt, type InsertReceipt } from "@shared/schema";

export interface IStorage {
  // We strictly don't need persistent storage as per requirements, 
  // but we'll keep the interface for future extensibility.
  logReceipt(receipt: InsertReceipt): Promise<Receipt>;
}

export class MemStorage implements IStorage {
  private receipts: Receipt[] = [];
  private idCounter = 1;

  async logReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const receipt: Receipt = {
      ...insertReceipt,
      id: this.idCounter++,
      generatedAt: new Date().toISOString()
    };
    this.receipts.push(receipt);
    return receipt;
  }
}

export const storage = new MemStorage();
