import type { MONTHS_ABBREVIATION } from "../constants/index.js";

export type User = {
  fullname: string;
  email: string;
  phoneNumber: string;
  birthdate: string;
  nickname: string;
  telegramChatId?: number;
};

export type CalendarOccurrence = {
  datetime: Date;
  description: string;
};

export type AbbreviatedMonth = (typeof MONTHS_ABBREVIATION)[number];

export type GenericListReturn<T> = {
  items: T[];
};
