import { useMutation } from "@tanstack/react-query";
import { api, type InsertReceipt } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useGenerateReceipt() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertReceipt) => {
      // Validate data against schema first
      const validated = api.receipts.generate.input.parse(data);

      const res = await fetch(api.receipts.generate.path, {
        method: api.receipts.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate PDF");
      }

      // Return the blob for download
      return await res.blob();
    },
    onSuccess: (blob, variables) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Clean filename
      const safeName = variables.studentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.setAttribute("download", `Tuition_Fee_${safeName}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Receipt Generated",
        description: "Your PDF receipt has been downloaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
