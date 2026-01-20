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
      year: 2081,
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
    <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
      {/* Hidden Receipt for Image Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div 
          ref={receiptRef}
          className="bg-white p-12 w-[800px] text-black font-sans"
          style={{ minHeight: '1100px' }}
        >
          <div className="border-2 border-black p-8 h-full flex flex-col">
            <h1 className="text-4xl font-bold text-center mb-12 uppercase tracking-tight">Tuition Fee Reminder</h1>
            
            <div className="flex justify-between mb-12 text-lg">
              <div className="space-y-1">
                <p><span className="font-semibold">Date Issued:</span> {new Date().toISOString().split('T')[0]}</p>
                <p><span className="font-semibold">Issued By:</span> Bablu Rauniyar</p>
              </div>
              <div className="text-right space-y-1">
                <p>misubabul@gmail.com</p>
                <p>+977-9804028522</p>
              </div>
            </div>

            <div className="text-xl leading-relaxed mb-12">
              <p>I hereby request you to pay the tuition fee of Master/Miss <span className="font-bold underline decoration-2 underline-offset-4">{formData.studentName || "________________"}</span></p>
              <p className="mt-6">from <span className="font-bold">{period.from}</span> to <span className="font-bold">{period.to}</span>.</p>
              <p className="mt-6 font-bold text-2xl">Amount: NPR {formData.fee} <span className="font-normal text-lg block mt-2 text-gray-700">Kindly make the payment on time.</span></p>
            </div>

            <p className="text-2xl italic text-center mb-16 font-serif">“Keep learning, keep growing.”</p>

            <div className="mt-auto border-t-2 border-black pt-8">
              <h3 className="text-xl font-bold underline decoration-2 underline-offset-4 mb-6">Payment Info:</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1 text-lg">
                  <p className="font-bold">Citizen Bank International LTD.</p>
                  <p>Account No: 09301000009700</p>
                  <p>Account Name: Bablu Kumar Rauniyar</p>
                  <p className="mt-4 font-bold text-primary">Esewa ID: 9804028522</p>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <img src="/assets/bank_qr.jpg" className="w-28 h-28 border-2 border-gray-100 rounded-lg shadow-sm" />
                      <p className="text-xs font-bold uppercase tracking-wider mt-2 text-gray-600">Bank QR</p>
                    </div>
                    <div className="text-center">
                      <img src="/assets/esewa_qr.jpg" className="w-28 h-28 border-2 border-gray-100 rounded-lg shadow-sm" />
                      <p className="text-xs font-bold uppercase tracking-wider mt-2 text-gray-600">Esewa QR</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-center ml-8">
                    <div className="relative mb-2">
                      <img src="/assets/signature.png" className="w-40 h-20 object-contain" />
                    </div>
                    <div className="w-32 border-t-2 border-black pt-2">
                      <p className="text-sm font-bold text-center">Bablu Rauniyar</p>
                      <p className="text-[10px] text-center uppercase tracking-widest text-gray-500 mt-1">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-black text-center mt-16 tracking-[0.2em] opacity-20">THANK YOU</h2>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-12"
      >
        <div className="glass-panel rounded-[2rem] p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-primary/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            <div className="mb-10 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
                <Receipt className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Generate Receipt
              </h2>
              <p className="text-muted-foreground text-base max-w-[280px] mx-auto sm:max-w-none">
                Enter student details to generate a professional tuition fee receipt
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                        <User className="w-4 h-4" /> Student Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Basant Rauniyar" 
                          className="glass-input h-14 rounded-2xl text-lg px-6 focus:ring-4 focus:ring-primary/10 transition-all border-2" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="font-medium" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-4">
                  <div className="col-span-1 sm:col-span-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                            <Calendar className="w-4 h-4" /> Year (BS)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="glass-input h-14 rounded-2xl text-lg px-6 focus:ring-4 focus:ring-primary/10 transition-all border-2"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-5">
                    <FormField
                      control={form.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                            Month
                          </FormLabel>
                          <Select 
                            onValueChange={(val) => field.onChange(parseInt(val))}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="glass-input h-14 rounded-2xl text-lg px-6 focus:ring-4 focus:ring-primary/10 transition-all border-2">
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl">
                              {MONTHS.map((month, index) => (
                                <SelectItem key={index + 1} value={(index + 1).toString()} className="rounded-xl py-3 px-4">
                                  {month}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-3">
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                            Day
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={32}
                              className="glass-input h-14 rounded-2xl text-lg px-6 focus:ring-4 focus:ring-primary/10 transition-all border-2"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                        <CreditCard className="w-4 h-4" /> Tuition Fee (NPR)
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg group-focus-within:text-primary transition-colors">Rs.</span>
                          <Input 
                            type="number" 
                            className="glass-input h-16 rounded-2xl text-xl font-bold pl-16 pr-6 focus:ring-4 focus:ring-primary/10 transition-all border-2"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem className="space-y-5">
                      <FormLabel className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                        Download Format
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="pdf" className="sr-only" />
                            </FormControl>
                            <FormLabel 
                              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-6 sm:p-8 hover:bg-accent/50 cursor-pointer transition-all duration-300 ${field.value === 'pdf' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-4 ring-primary/5' : 'border-muted bg-popover/50'}`}
                            >
                              <div className={`p-4 rounded-xl mb-3 ${field.value === 'pdf' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                <FileText className="h-8 w-8" />
                              </div>
                              <span className="text-base font-bold">PDF Document</span>
                              <span className="text-xs text-muted-foreground mt-1">High quality for printing</span>
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="image" className="sr-only" />
                            </FormControl>
                            <FormLabel 
                              className={`flex flex-col items-center justify-center rounded-2xl border-2 p-6 sm:p-8 hover:bg-accent/50 cursor-pointer transition-all duration-300 ${field.value === 'image' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-4 ring-primary/5' : 'border-muted bg-popover/50'}`}
                            >
                              <div className={`p-4 rounded-xl mb-3 ${field.value === 'image' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                <ImageIcon className="h-8 w-8" />
                              </div>
                              <span className="text-base font-bold">PNG Image</span>
                              <span className="text-xs text-muted-foreground mt-1">Perfect for sharing</span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="font-medium" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPdfPending || isImagePending}
                  className="w-full h-16 rounded-2xl text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:to-primary shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
                >
                  {(isPdfPending || isImagePending) ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Generating Receipt...
                    </>
                  ) : (
                    <>
                      <Download className="mr-3 h-6 w-6" />
                      {form.watch("format") === "pdf" ? "Download PDF" : "Download Image"}
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
