import { useState } from "react";
import Timer from "./components/Timer";
import Diary, { LogItem, DateRecord } from "./components/Diary";
import { port } from "../server/config.js";

export default function App() {
  const URL = `http://localhost:${port}`;

  const [addLog, setAddLog] = useState<((log: LogItem) => void) | null>(null);
  const [dates, setDates] = useState<DateRecord[]>([]);

  const handleRestart = async (difference: string, description: string) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    const descriptionCheck =
      description.trim() === "" ? "No description provided" : description;

    const payload = {
      date: formattedDate,
      timer_leftover: difference,
      description: descriptionCheck,
    };

    try {
      const response = await fetch(`${URL}/logs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send log to server");

      const newLog = await response.json();

      if (addLog) {
        addLog(newLog);
      }

      if (!dates.some((date) => date.date === formattedDate)) {
        setDates((prevDates) => [
          ...prevDates,
          { id: newLog.date_id, date: formattedDate },
        ]);
      }
    } catch (error) {
      console.error("Error creating log:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen fixed-width">
      <div>
        <h1>Timer Diary</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <Diary URL={URL} setDiaryDates={setDates} setAddLog={setAddLog} />
    </div>
  );
}
