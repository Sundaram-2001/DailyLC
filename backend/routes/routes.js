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

  const scheduler = await scheduleUsers({ name, email, preferred_time: time });
  if (!scheduler.success) {
    return res.status(500).json({ message: "Error scheduling job", error: scheduler.error });
  }

  return res.status(200).json({ message: "User added and job scheduled successfully!" });
});
export default routes