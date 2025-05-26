
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { emailQueue } from "./bullmq.js";

dotenv.config();

// Supabase init
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function scheduleAllUsers() {
  const { data: users, error } = await supabase.from("Emails").select("name, email, preferred_time");

  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  if (!users || users.length === 0) {
    console.log("No users found in DB.");
    return;
  }

  for (const user of users) {
    const { name, email, preferred_time } = user;
    const [hour, minute] = preferred_time.split(":").map(Number);

    const cronPattern = `${minute} ${hour} * * *`; // Every day at preferred_time
    const jobId = `daily-job-${email}`; // unique ID for repeatable job

    try {
      await emailQueue.add(
        "sendEmails",
        { name, email },
        {
          repeat: {
            cron: cronPattern,
            tz: "Asia/Kolkata", // ensures user time is respected
          },
          jobId,
        }
      );
      console.log(`Scheduled daily job for ${email} at ${preferred_time}`);
    } catch (err) {
      console.error(`Failed to schedule job for ${email}:`, err);
    }
  }

  console.log("✅ All users scheduled.");
}

scheduleAllUsers();
