import cron from "node-cron";
import dotenv from "dotenv";
import axios from "axios";
import { Agent as HttpsAgent } from "https";

dotenv.config();

const CRON_INTERVAL = process.env.CRON_INTERVAL || "* * * * *";

console.log(`Scheduling task with interval: ${CRON_INTERVAL}`);

cron.schedule(CRON_INTERVAL, async (ctx) => {
  console.log(`Task started at ${ctx.triggeredAt.toISOString()}`);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const urlToFetch = `${process.env.USER_API_URL}/calendar?month=${currentMonth}&year=${currentYear}`;

  console.log(`Fetching data from: ${urlToFetch}`);

  const response = await axios.get(urlToFetch, {
    headers: { "x-user-email": "valmirgmj@gmail.com" },
    httpsAgent: new HttpsAgent({ rejectUnauthorized: false }),
  });

  console.log("Response data:", response.data);
});
