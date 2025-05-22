import { Resend } from "resend";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import cron from "node-cron";
import fetchDailyProblem from "./problem.js"; 

dotenv.config();

const supabase_key = process.env.SUPABASE_KEY;
const supabase_url = process.env.SUPABASE_URL;
const supabase = createClient(supabase_url, supabase_key);
const resend = new Resend(process.env.RESEND_KEY);

// Helper function to get current time in HH:mm format (24-hour)
function currentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}`;
}

// Schedule the cron job to run every minute (for testing)
cron.schedule("* * * * *", async () => {
  try {
    const timeNow = currentTime();
    console.log("Current Time:", timeNow);

    // Fetch users whose preferred_time matches current time
    const { data: users, error } = await supabase
      .from("Emails")
      .select("name, email")
      .eq("preferred_time", timeNow);

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
    if (!users || users.length === 0) {
      console.log("No users to notify at this time.");
      return;
    }

    // Fetch the daily problem
    const problem = await fetchDailyProblem();
    if (!problem) {
      console.error("Failed to fetch daily problem.");
      return;
    }

    const { title, url, difficulty } = problem;

    // Prepare batch emails
    const batchEmails = users.map((user) => ({
      from: "Daily Leetcode <onboarding@resend.dev>",
      to: [user.email],
      subject: `Leetcode - Problem of the day!`,
      html: `
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Here's your daily LeetCode problem:</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Difficulty:</strong> ${difficulty}</p>
        <p><a href="${url}">View Problem</a></p>
        <p style="font-size: 0.9rem; color: gray;">You are receiving this because you subscribed to DailyLC.</p>
      `,
    }));

    // Send batch emails
    await resend.batch.send(batchEmails);
    console.log("Emails sent successfully.");
  } catch (err) {
    console.error("Unexpected error in cron job:", err);
  }
});
