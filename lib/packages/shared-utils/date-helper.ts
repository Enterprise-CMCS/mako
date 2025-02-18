import { format, add } from "date-fns";

export function formatDate(date: number | null | undefined) {
  if (!date || date === undefined) {
    return "Pending";
  }

  return format(date, "MMMM d, yyyy");
}

export const isDST = (date: Date): boolean => {
  const jan = new Date(date).getTimezoneOffset();
  const jul = new Date(new Date(date).setMonth(6)).getTimezoneOffset();
  return new Date(date).getTimezoneOffset() < Math.max(jan, jul);
};

export function formatNinetyDaysDate(date: number | null | undefined): string {
  if (!date) {
    return "Pending";
  }

  const baseDate = new Date(date);
  const ninetyDaysLater = add(baseDate, { days: 90 });

  const timezoneAbbreviation = isDST(ninetyDaysLater) ? "EDT" : "EST";
  return format(ninetyDaysLater, `MMM d, yyyy '@ 11:59pm ${timezoneAbbreviation}'`);
}
