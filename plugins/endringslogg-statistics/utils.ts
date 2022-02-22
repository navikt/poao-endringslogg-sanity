import {
  eachDayOfInterval,
  isWithinInterval,
  subDays,
  subMonths,
} from "date-fns";

export const dateFormatter = (date: Date) => date.toISOString().slice(0, 10);

export const dateInLastWeek = (date: Date) =>
  isWithinInterval(date, { start: subDays(new Date(), 7), end: new Date() });

const getDateStringsForLastMonths = (months: number) =>
  eachDayOfInterval({ start: subMonths(new Date(), months), end: new Date() });

export const datesAsObj = (dateArray: Date[]) =>
  dateArray.reduce(
    (acc, date) => ({ ...acc, [dateFormatter(date)]: 0 }),
    {} as { [key: string]: number }
  );

export const getUTCDate = (date = new Date()) => {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
};

export const convertToUTCDate = (date: Date) => {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
};

export const convertFromUTCDate = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
};
