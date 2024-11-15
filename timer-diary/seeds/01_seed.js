/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("date_table").del();
  await knex("logs_table").del();

  await knex("date_table").insert([
    { id: 1, date: "2024-11-14" },
    { id: 2, date: "2024-11-15" },
    { id: 3, date: "2024-11-16" },
  ]);

  await knex("logs_table").insert([
    {
      date_id: 1,
      timer_leftover: "01:30",
      description: "Log entry for November 14th",
    },
    {
      date_id: 2,
      timer_leftover: "02:00",
      description: "Log entry for November 15th",
    },
    {
      date_id: 3,
      timer_leftover: "00:45",
      description: "Log entry for November 16th",
    },
  ]);
}
