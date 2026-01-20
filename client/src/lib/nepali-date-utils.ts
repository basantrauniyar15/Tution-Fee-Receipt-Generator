const MONTH_NAMES = [
  "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export function formatNepaliDate(year: number, month: number, day: number): string {
  const monthName = MONTH_NAMES[month - 1];
  return `${day} ${monthName} ${year}`;
}

export function getTuitionPeriod(year: number, month: number, day: number) {
  const fromDateStr = formatNepaliDate(year, month, day);
  
  let nextYear = year;
  let nextMonth = month + 1;
  let nextDay = day;

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  const toDateStr = formatNepaliDate(nextYear, nextMonth, nextDay);

  return {
    from: fromDateStr,
    to: toDateStr
  };
}
