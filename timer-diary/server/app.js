import express from "express";
import cors from "cors";
import knex from "./knex.js";
const app = express();
const port = 10000;

app.use(cors());

app.get("/dates", async (req, res) => {
  try {
    const dates = await knex("date_table").select();
    res.json(dates);
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/logs", async (req, res) => {
  try {
    const logs = await knex("logs_table").select();
    res.json(logs);
  } catch (error) {
    console.error("Error fetching dates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
