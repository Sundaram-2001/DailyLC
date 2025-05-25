import { Resend } from "resend";
import { Worker } from "bullmq";
import { redisConnection } from "./redis.js";
import fetchDailyProblem from "./problem.js";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

// Defining  the Worker
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { users, preferred_time } = job.data;
    console.log(`Processing job for users at ${preferred_time}`);

    const problem = await fetchDailyProblem();
    if (!problem) {
      console.error("Failed to fetch daily problem");
      return;
    }

    const { title, url, difficulty } = problem;

    const batchEmails = users.map((user) => ({
      from: "Daily LeetCode <onboarding@resend.dev>",
      to: [user.email],
      subject: `Daily LeetCode Problem: ${title}`,
      html: `<p>Hi ${user.name},</p>
            <p>Today's LeetCode problem is <strong>${title}</strong> with a difficulty of <strong>${difficulty}</strong>.</p>
            <p>You can solve it <a href="${url}">here</a>.</p>
            <p>Happy coding!</p>`,
    }));

    try {
      await resend.batch.send(batchEmails);
      console.log(`Emails sent successfully to ${users.length} users`);
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  },
  {
    connection: redisConnection, 
  }
);

// Optional event handlers
emailWorker.on("completed", (job) => {
  console.log(`Job with ID ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error("Job failed", err);
});
