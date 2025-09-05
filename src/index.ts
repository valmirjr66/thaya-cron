import dotenv from "dotenv";
import cron, { type TaskContext } from "node-cron";
import { MONTHS_ABBREVIATION } from "./constants/index.js";
import UserServiceHandler from "./handlers/UserServiceHandler.js";
import type { AbbreviatedMonth } from "./types/index.js";
import TelegramHandler from "./handlers/TelegramHandler.js";

dotenv.config();

const CRON_INTERVAL = process.env.CRON_INTERVAL || "*/10 * * * *";
const DAYS_TO_CHECK_AHEAD = 14;

const { USER_API_URL, TELEGRAM_TOKEN, ENVIRONMENT } = process.env;

if (!USER_API_URL || !TELEGRAM_TOKEN) {
  throw new Error("Missing required environment variables.");
}

console.log(`Scheduling task with interval: ${CRON_INTERVAL}`);

const userServiceHandler = new UserServiceHandler(USER_API_URL);
const telegramHandler = new TelegramHandler(
  TELEGRAM_TOKEN,
  ENVIRONMENT || "dev"
);

const task = async (context?: TaskContext) => {
  if (context) {
    console.log(
      `Scheduled task started at ${context.triggeredAt.toISOString()}`
    );
  } else {
    console.log("First task execution (not scheduled)");
  }

  console.log("Fetching user list...");
  const userList = await userServiceHandler.listAllUsers();
  console.log(`Found ${userList.length} users.`);

  for (const user of userList) {
    console.log(`Processing user: ${user.email}`);

    const today = new Date();
    console.log(`Today's date: ${today.toISOString()}`);

    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    console.log(
      `Current month: ${MONTHS_ABBREVIATION[currentMonth]}, year: ${currentYear}`
    );

    console.log(
      `Fetching calendar for ${user.email} for ${MONTHS_ABBREVIATION[currentMonth]} ${currentYear}`
    );
    const userCalendar = await userServiceHandler.fetchCalendar(
      user.email,
      MONTHS_ABBREVIATION[currentMonth] as AbbreviatedMonth,
      currentYear
    );
    console.log(`Fetched ${userCalendar.length} events for current month.`);

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + DAYS_TO_CHECK_AHEAD);
    console.log(
      `Checking events between ${today.toISOString()} and ${sevenDaysLater.toISOString()}`
    );

    let eventsToNotifyAbout = userCalendar.filter(
      (event) => event.datetime >= today && event.datetime <= sevenDaysLater
    );
    console.log(
      `Found ${eventsToNotifyAbout.length} events in current month within range.`
    );

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysLeftInMonth = daysInMonth - today.getDate();
    console.log(`Days left in current month: ${daysLeftInMonth}`);

    if (daysLeftInMonth < DAYS_TO_CHECK_AHEAD) {
      const nextMonth = (currentMonth + 1) % 12;
      const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;
      console.log(
        `Also checking next month: ${MONTHS_ABBREVIATION[nextMonth]} ${nextYear}`
      );

      const nextMonthCalendar = await userServiceHandler.fetchCalendar(
        user.email,
        MONTHS_ABBREVIATION[nextMonth] as AbbreviatedMonth,
        nextYear
      );
      console.log(`Fetched ${nextMonthCalendar.length} events for next month.`);

      const nextMonthEvents = nextMonthCalendar.filter(
        (event) => event.datetime > today && event.datetime <= sevenDaysLater
      );
      console.log(
        `Found ${nextMonthEvents.length} events in next month within range.`
      );

      eventsToNotifyAbout = eventsToNotifyAbout.concat(nextMonthEvents);
    }

    if (eventsToNotifyAbout.length > 0) {
      console.log(
        `User "${user.email}" has ${eventsToNotifyAbout.length} event(s) in the next ${DAYS_TO_CHECK_AHEAD} days. Sending WhatsApp notification.`
      );

      const message =
        `You have ${eventsToNotifyAbout.length} event(s) in the next ${DAYS_TO_CHECK_AHEAD} days:\n` +
        eventsToNotifyAbout
          .map((event) => `- ${event.description} on ${event.datetime}`)
          .join("\n");

      if (user.telegramChatId) {
        console.log(
          `Sending message to user with Telegram ID ${user.telegramChatId}:`
        );
        console.log(message);

        await telegramHandler.sendMessage(user.telegramChatId, message);
        console.log(`Message sent to Telegram ID ${user.telegramChatId}`);
      } else {
        console.log(
          `No Telegram ID for user "${user.email}". Skipping Telegram message.`
        );
      }
    } else {
      console.log(`No events to notify for user "${user.email}".`);
    }
  }

  console.log("Finished processing all users");
};

task();

cron.schedule(CRON_INTERVAL, task);
