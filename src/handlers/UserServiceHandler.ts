import httpCallers from "../services/index.js";
import type {
  AbbreviatedMonth,
  CalendarOccurrence,
  GenericListReturn,
  User,
} from "../types/index.js";

export default class UserServiceHandler {
  constructor(private readonly serviceUrl: string) {}

  async listAllUsers(): Promise<User[]> {
    console.log("Fetching all users");

    const { data }: { data: GenericListReturn<User> } = await httpCallers.get(
      `${this.serviceUrl}/list`
    );

    console.log(`Fetched ${data.items.length} users`);

    return data.items;
  }

  async fetchCalendar(
    userEmail: string,
    month: AbbreviatedMonth,
    year: number
  ): Promise<CalendarOccurrence[]> {
    const url = `${this.serviceUrl}/calendar?month=${month}&year=${year}`;

    console.log(`Fetching calendar data from "${url}" for user "${userEmail}"`);

    const { data }: { data: GenericListReturn<CalendarOccurrence> } =
      await httpCallers.get(url, {
        headers: { "x-user-email": userEmail },
      });

    console.log(
      `Fetched calendar data for "${userEmail}", found ${data.items.length} items`
    );

    return data.items.map((item) => ({
      ...item,
      datetime: new Date(item.datetime),
    }));
  }
}
