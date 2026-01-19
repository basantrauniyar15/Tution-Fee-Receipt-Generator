import { ReceiptForm } from "@/components/ReceiptForm";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary bg-primary/10 rounded-full uppercase border border-primary/20">
            Official System
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-4">
            Tuition Fee <br className="md:hidden" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              PDF Generator
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed">
            Create professional, QR-coded receipts for student tuition fees instantly. 
            Optimized for Nepali calendar dates.
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 w-full">
        <ReceiptForm />
      </main>

      <footer className="relative z-10 mt-16 text-center text-sm text-muted-foreground/60">
        <p>© {new Date().getFullYear()} Tuition Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
