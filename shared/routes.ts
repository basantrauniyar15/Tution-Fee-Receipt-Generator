import { z } from 'zod';
import { generatePdfSchema } from './schema';

export const api = {
  receipts: {
    generate: {
      method: 'POST' as const,
      path: '/api/generate-pdf',
      input: generatePdfSchema,
      responses: {
        200: z.any(), // PDF Buffer
        400: z.object({ message: z.string() }),
      },
    },
  },
};
