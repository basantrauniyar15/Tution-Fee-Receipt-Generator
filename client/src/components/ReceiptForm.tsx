import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReceiptSchema, type InsertReceipt } from "@shared/schema";
import { useGenerateReceipt } from "@/hooks/use-receipts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Download, Receipt, Calendar, CreditCard, User } from "lucide-react";
import { motion } from "framer-motion";

const MONTHS = [
  "Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export function ReceiptForm() {
  const { mutate, isPending } = useGenerateReceipt();

  const form = useForm<InsertReceipt>({
    resolver: zodResolver(insertReceiptSchema),
    defaultValues: {
      studentName: "",
      year: 2081,
      month: 1,
      day: 1,
      fee: 0,
    },
  });

  const onSubmit = (data: InsertReceipt) => {
    mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
              <Receipt className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Generate Receipt
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter student details to generate a tuition fee PDF
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <User className="w-3.5 h-3.5" /> Student Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Aarav Sharma" 
                        className="glass-input h-12 rounded-xl text-base px-4" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" /> Year (BS)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            className="glass-input h-12 rounded-xl text-base px-4"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-7 md:col-span-5">
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Month
                        </FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(parseInt(val))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="glass-input h-12 rounded-xl text-base px-4">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MONTHS.map((month, index) => (
                              <SelectItem key={index + 1} value={(index + 1).toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-5 md:col-span-3">
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Day
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={32}
                            className="glass-input h-12 rounded-xl text-base px-4"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5" /> Tuition Fee (NPR)
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">Rs.</span>
                        <Input 
                          type="number" 
                          className="glass-input h-12 rounded-xl text-base pl-12 pr-4"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Receipt PDF
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
}
