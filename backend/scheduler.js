import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { emailQueue } from "./bullmq.js";
import cron from "node-cron";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper function to get current time in HH:mm (24-hour format)
function currentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Run every minute
cron.schedule("* * * * *", async () => {
  const timeNow = currentTime(); 
  console.log(`Checking for users to notify at ${timeNow}`);

  try {
    const { data: users, error } = await supabase
      .from("Emails")
      .select("name,email")
      .eq("preferred_time", timeNow);

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    if (!users || users.length === 0) {
      console.log("No users to inform at this time.");
      return;
    }

    // Add job to the BullMQ queue
    await emailQueue.add("sendEmails", {
      users,
      preferred_time: timeNow,
    });

    console.log(`Enqueued job for ${users.length} users at ${timeNow}`);
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
