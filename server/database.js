import { Pool } from "pg";
require("dotenv").config({ path: "./.env.local" });

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
