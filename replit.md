# Tuition Fee PDF Generator

## Overview

A simple, single-user tuition fee PDF generator built for generating professional receipts with Nepali Bikram Sambat calendar support. The application allows users to input student details and generates downloadable PDF receipts with QR codes for payment. No authentication, login, or external notifications are required.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth interactions
- **Build Tool**: Vite with HMR support

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **PDF Generation**: PDFKit with QRCode library
- **Storage**: In-memory storage (no persistent database required per requirements)
- **Schema Validation**: Zod with drizzle-zod for type-safe validation

### API Structure
- `POST /api/generate-pdf` - Accepts student details (name, Nepali date, fee) and returns a PDF buffer for download

### Key Design Decisions
1. **No Database Required**: Uses in-memory storage since the system is single-user and local-use only. The Drizzle setup exists in the template but falls back gracefully when DATABASE_URL is not present.

2. **Nepali Calendar (Bikram Sambat)**: Custom date utilities handle BS date formatting and tuition period calculation (from joining date to same day next month).

3. **PDF-First Approach**: Backend generates complete PDFs with QR codes using PDFKit. The frontend handles binary blob responses and triggers browser downloads.

4. **Shared Types**: The `/shared` directory contains Zod schemas and route definitions used by both frontend and backend, ensuring type safety across the stack.

## External Dependencies

### Third-Party Libraries
- **PDFKit**: Server-side PDF generation
- **QRCode**: QR code generation for payment info embedded in PDFs
- **nepali-date-converter**: Nepali calendar date conversion utilities

### Asset Requirements
The PDF generator expects these static assets in `client/public/assets/`:
- `bank_qr.jpg` - Bank payment QR code
- `esewa_qr.jpg` - eSewa payment QR code  
- `signature.png` - Issuer signature image

### Database (Optional)
PostgreSQL configured via Drizzle ORM, but the app functions without it using in-memory storage. If DATABASE_URL is provided, it will use PostgreSQL.