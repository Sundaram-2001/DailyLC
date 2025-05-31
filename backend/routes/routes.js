import express from "express";
import addData from "../db.js";
import scheduleUsers from "../scheduler.js";

const routes = express.Router();

routes.post("/", async (req, res) => {
  const { name, email, time } = req.body;

  const result = await addData(name, email, time);

  if (!result.success) {
    return res.status(500).json({ message: "Insert failed", error: result.error });
  }

  // Respond early
  res.status(200).json({ message: "User added successfully! Job will be scheduled shortly." });

  // Schedule in background without await
  scheduleUsers({ name, email, preferred_time: time })
    .then(response => {
      if (!response.success) console.error("Scheduler error:", response.error);
    })
    .catch(err => console.error("Unexpected scheduler error:", err));
});

export default routes;
