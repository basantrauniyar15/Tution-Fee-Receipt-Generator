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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Download, Receipt, Calendar, CreditCard, User, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from 'html-to-image';
import { useRef, useState } from "react";
import { getTuitionPeriod } from "@/lib/nepali-date-utils";

const MONTHS = [
  "Baisakh", "Jestha", "Ashad", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export function ReceiptForm() {
  const { mutate, isPending: isPdfPending } = useGenerateReceipt();
  const [isImagePending, setIsImagePending] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const form = useForm<InsertReceipt>({
    resolver: zodResolver(insertReceiptSchema),
    defaultValues: {
      studentName: "",
      year: 2082,
      month: 1,
      day: 1,
      fee: 0,
      format: "pdf",
    },
  });

  const onSubmit = async (data: InsertReceipt) => {
    if (data.format === "image") {
      setIsImagePending(true);
      try {
        // Wait a bit for the hidden receipt to render
        await new Promise(resolve => setTimeout(resolve, 100));
        if (receiptRef.current) {
          const dataUrl = await toPng(receiptRef.current, {
            quality: 0.95,
            backgroundColor: '#fff',
          });
          const link = document.createElement('a');
          link.download = `Tuition_Fee_${data.studentName.replace(/\s+/g, '_')}_${data.year}-${data.month}.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.error('Image generation failed', err);
      } finally {
        setIsImagePending(false);
      }
    } else {
      mutate(data);
    }
  };

  const formData = form.watch();
  const period = getTuitionPeriod(formData.year, formData.month, formData.day);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden Receipt for Image Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div 
          ref={receiptRef}
          className="bg-white p-12 w-[800px] text-black font-sans"
          style={{ minHeight: '1100px' }}
        >
          <div className="border-2 border-black p-8 h-full flex flex-col">
            <h1 className="text-4xl font-bold text-center mb-12 uppercase">Tuition Fee Reminder</h1>
            
            <div className="flex justify-between mb-12 text-lg">
              <div>
                <p>Date Issued: {new Date().toISOString().split('T')[0]}</p>
                <p>Issued By: Bablu Rauniyar</p>
              </div>
              <div className="text-right">
                <p>misubablu1@gmail.com</p>
                <p>+977-9804028522</p>
              </div>
            </div>

            <div className="text-xl leading-relaxed mb-12">
              <p>I hereby request you to pay the tuition fee of Master/Miss <span className="font-bold underline">{formData.studentName || "________________"}</span></p>
              <p className="mt-4">from <span className="font-bold">{period.from}</span> to <span className="font-bold">{period.to}</span>.</p>
              <p className="mt-4 font-bold">Amount: {formData.fee} <span className="font-normal">Kindly make the payment on time.</span></p>
            </div>

            <p className="text-2xl italic text-center mb-12">“Keep learning, keep growing.”</p>

            <div className="mt-auto">
              <h3 className="text-xl font-bold underline mb-4">Payment Info:</h3>
              <p>Citizen Bank International LTD.</p>
              <p>Account No: 0930100000097010</p>
              <p>Account Name: Bablu Kumar Rauniyar</p>
              <p className="mt-4 font-bold">Esewa ID: 9804028522</p>

              <div className="flex items-end justify-between mt-8">
                <div className="flex gap-8">
                  <div className="text-center">
                    <img src="/assets/bank_qr.jpg" className="w-32 h-32 border border-gray-200" />
                    <p className="text-sm mt-2">Bank QR</p>
                  </div>
                  <div className="text-center">
                    <img src="/assets/esewa_qr.jpg" className="w-32 h-32 border border-gray-200" />
                    <p className="text-sm mt-2">Esewa QR</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-center">
                  <div className="relative">
                    <img src="/assets/signature.png" className="w-48 h-24 object-contain" />
                  </div>
                  <p className="text-sm border-t border-black pt-1 w-32 text-center">Bablu Rauniyar</p>
                  <p className="text-xs text-center uppercase tracking-wider text-muted-foreground mt-1">Signature</p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mt-12">THANK YOU</h2>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
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
                Enter student details to generate a tuition fee receipt
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
                          placeholder="e.g. Basant Rauniyar" 
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
                            <SelectContent className="max-h-[500px] w-[300px]">
                              <div className="grid grid-cols-2 gap-2 p-3">
                                {MONTHS.map((month, index) => (
                                  <SelectItem 
                                    key={index + 1} 
                                    value={(index + 1).toString()}
                                    className="cursor-pointer hover:bg-accent rounded-lg justify-center py-2 px-1 focus:bg-accent"
                                  >
                                    {month}
                                  </SelectItem>
                                ))}
                              </div>
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

                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Download Format
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="pdf" className="sr-only" />
                            </FormControl>
                            <FormLabel 
                              className={`flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${field.value === 'pdf' ? 'border-primary bg-primary/5 shadow-inner' : ''}`}
                            >
                              <FileText className={`mb-2 h-6 w-6 ${field.value === 'pdf' ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-sm font-medium">PDF Document</span>
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="image" className="sr-only" />
                            </FormControl>
                            <FormLabel 
                              className={`flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all ${field.value === 'image' ? 'border-primary bg-primary/5 shadow-inner' : ''}`}
                            >
                              <ImageIcon className={`mb-2 h-6 w-6 ${field.value === 'image' ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-sm font-medium">PNG Image</span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPdfPending || isImagePending}
                  className="w-full h-14 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  {(isPdfPending || isImagePending) ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      {form.watch("format") === "pdf" ? "Download Receipt PDF" : "Download Receipt Image"}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
