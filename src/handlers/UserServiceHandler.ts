import axios from "axios";
import type {
  AbbreviatedMonth,
  CalendarOccurrence,
  User,
} from "../types/index.js";
import { Agent } from "https";

export default class UserServiceHandler {
  private readonly DEFAULT_AXIOS_CONFIG = {
    httpsAgent: new Agent({ rejectUnauthorized: false }),
  };

  constructor(private serviceUrl: string) {}

  async listAllUsers(): Promise<User[]> {
    console.log("Fetching all users");

    const { data } = await axios.get(`${this.serviceUrl}/list`, {
      ...this.DEFAULT_AXIOS_CONFIG,
    });

    console.log(`Fetched ${data.length} users`);

    return data as User[];
  }

  async fetchCalendar(
    userEmail: string,
    month: AbbreviatedMonth,
    year: number
  ): Promise<{ items: CalendarOccurrence[] }> {
    const url = `${this.serviceUrl}/calendar?month=${month}&year=${year}`;

    console.log(`Fetching calendar data from "${url}" for user "${userEmail}"`);

    const { data } = await axios.get(url, {
      ...this.DEFAULT_AXIOS_CONFIG,
      headers: { "x-user-email": userEmail },
    });

    console.log(
      `Fetched calendar data for "${userEmail}", found ${data.items.length} items`
    );

    return data as { items: CalendarOccurrence[] };
  }
}
