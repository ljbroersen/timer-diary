import { useState } from "react";
import Timer from "./components/Timer";
import Diary, { LogItem, DateRecord } from "./components/Diary";

export default function App() {
  const URL = "http://localhost:10000";

  const [addLog, setAddLog] = useState<((log: LogItem) => void) | null>(null);
  const [dates, setDates] = useState<DateRecord[]>([]);

  const handleRestart = async (difference: string, description: string) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    const selectedDateRecord = dates.find(
      (dateRecord) => dateRecord.date === formattedDate
    );

    if (!selectedDateRecord) {
      console.error("No date record found for the selected date.");
      return;
    }

    const newLog: LogItem = {
      id: Math.random(),
      date_id: selectedDateRecord.id,
      date: formattedDate,
      timer_leftover: difference,
      description,
    };

    if (addLog) {
      addLog(newLog);
    }

    try {
      const response = await fetch(`${URL}/logs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });
      if (!response.ok) throw new Error("Failed to send log to server");
    } catch (error) {
      console.error("Error sending log to server:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen fixed-width">
      <div>
        <h1>Timer Diary</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <Diary URL={URL} setDates={setDates} setAddLog={setAddLog} />
    </div>
  );
}
