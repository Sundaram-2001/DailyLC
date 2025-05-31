routes.post("/", async (req, res) => {
  const { name, email, time } = req.body;

  const result = await addData(name, email, time);
  if (!result.success) {
    return res.status(500).json({ message: "Insert failed", error: result.error });
  }

  // ✅ Respond early
  res.status(200).json({ message: "User added successfully! Job will be scheduled shortly." });

  // Do scheduling in background (no await)
  scheduleUsers({ name, email, preferred_time: time })
    .then(res => {
      if (!res.success) console.error("Scheduler error:", res.error);
    })
    .catch(err => console.error("Unexpected scheduler error:", err));
});
