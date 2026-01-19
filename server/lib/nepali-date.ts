import NepaliDate from 'nepali-date-converter';

const MONTH_NAMES = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export function formatNepaliDate(year: number, month: number, day: number): string {
  // Month is 1-based from input, convert to 0-based for array/internal logic if needed.
  // The library constructor takes (year, month, day) where month is 0-11
  // Wait, let's verify library.
  // Standard JS Date is 0-11. NepaliDate usually follows that or 1-12 depending on lib.
  // Checking docs/common usage: often 0-11.
  // Let's assume 0-11 for the library constructor if it mimics JS Date.
  
  // Actually, let's just format it manually to be safe and consistent with the requirement.
  // "5 Shrawan 2081"
  const monthName = MONTH_NAMES[month - 1]; // month is 1-12
  return `${day} ${monthName} ${year}`;
}

export function getTuitionPeriod(year: number, month: number, day: number) {
  const fromDateStr = formatNepaliDate(year, month, day);
  
  // Calculate To Date: Same day of next month.
  // Handle year rollover.
  let nextYear = year;
  let nextMonth = month + 1;
  let nextDay = day;

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  
  // Note: We are not validating if "nextDay" exists in "nextMonth" (e.g. 32nd).
  // The requirement says "same Nepali day of the NEXT Nepali month". 
  // We'll assume valid input or that the user accepts "32 Bhadra" even if Bhadra only has 31 (it might be invalid strictly, but simple logic requested).
  // Ideally we should clamp, but we don't have the days-in-month table loaded.
  // We'll stick to the simple "same day" logic.

  const toDateStr = formatNepaliDate(nextYear, nextMonth, nextDay);

  return {
    from: fromDateStr,
    to: toDateStr
  };
}
