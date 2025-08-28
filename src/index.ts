import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const CRON_INTERVAL = process.env.CRON_INTERVAL || "* * * * *";

console.log(`Scheduling task with interval: ${CRON_INTERVAL}`);

cron.schedule(CRON_INTERVAL, async (ctx) => {
  console.log(`Task started at ${ctx.triggeredAt.toISOString()}`);
  console.log(`Scheduled for: ${ctx.dateLocalIso}`);
});
