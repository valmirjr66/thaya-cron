import type { MONTHS_ABBREVIATION } from "../constants/index.js";

export type User = {
  fullname: string;
  email: string;
  phoneNumber: string;
  birthdate: string;
  profilePicFileName: string;
  nickname: string;
};

export type CalendarOccurrence = {
  datetime: Date;
  description: string;
};

export type AbbreviatedMonth = (typeof MONTHS_ABBREVIATION)[number];
