import { Resend } from "resend";
import { Worker } from "bullmq";
import { redisConnection } from "./redis.js";
import fetchDailyProblem from "./problem.js";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { name, email } = job.data;
    console.log(`Processing daily email for ${email}`);

    const problem = await fetchDailyProblem();
    if (!problem) {
      console.error("Failed to fetch daily problem");
      return;
    }

    const { title, url, difficulty } = problem;

    const emailData = {
      from: "Daily LeetCode <onboarding@resend.dev>",
      to: [email],
      subject: `Daily LeetCode Problem: ${title}`,
      html: `<p>Hi ${name},</p>
             <p>Today's LeetCode problem is <strong>${title}</strong> with a difficulty of <strong>${difficulty}</strong>.</p>
             <p>You can solve it <a href="${url}">here</a>.</p>
             <p>Happy coding!</p>`,
    };

    try {
      await resend.emails.send(emailData);
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  },
  {
    connection: redisConnection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job with ID ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error("Job failed", err);
});
