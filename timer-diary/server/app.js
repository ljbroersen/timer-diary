import express from "express";
const cors = require("cors");
const app = express();
const port = 10000;

app.use(cors());

app.get("/dates", async (req, res) => {
  const dates = await knex.select().table("dates_table");
  res.send(JSON.stringify(dates));
});

app.get("/logs", async (req, res) => {
  const logs = await knex.select().table("logs_table");
  res.send(JSON.stringify(logs));
});

app.post("/logs/create", async (req, res) => {
  const { date, timer_leftover, description } = req.body;

  try {
    let dateRecord = await knex("date_table").where({ date }).first();

    if (!dateRecord) {
      const [newDate] = await knex("date_table")
        .insert({ date })
        .returning("id");
      dateRecord = { id: newDate.id, date };
    }

    const newLog = await knex("logs_table")
      .insert({
        date_id: dateRecord.id,
        timer_leftover,
        description,
      })
      .returning("*");

    res.status(201).json(newLog);
  } catch (error) {
    console.error("Error inserting log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
