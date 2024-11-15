import { Pool } from "pg";

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "timer_diary",
  user: "postgres",
  password: "maxwell",
});

module.exports = pool;
