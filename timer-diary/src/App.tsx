import Button from "./components/Button";
import Timer from "./components/Timer";
import { useState } from "react";

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const [currentLogDate, setCurrentLogDate] = useState<Date | null>(null);
  const URL = "http://localhost:10000";

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  const createLog = async (
    date: Date,
    timer_leftover: string,
    description: string
  ) => {
    try {
      const response = await fetch(`${URL}/logs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          timer_leftover,
          description,
        }),
      });

      if (response.ok) {
        const newLog = await response.json();
        console.log("Log created:", newLog);
      } else {
        console.error("Failed to create log");
      }
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  const handleRestart = (newLog: string) => {
    const currentDate = new Date();
    if (!currentLogDate || currentDate.getDate() !== currentLogDate.getDate()) {
      setCurrentLogDate(currentDate);
      setLog([newLog]);

      createLog(currentDate, formatDate(currentDate), newLog);
    } else {
      setLog([...log, newLog]);

      createLog(currentDate, formatDate(currentDate), newLog);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1>Timer</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-col w-3/12 mr-2 border-2 border-gray-600">
          <h2 className="underline-offset-8 underline decoration-gray-600 decoration-2">
            Date
          </h2>
          <Button>
            {currentLogDate && <h4>{formatDate(currentLogDate)}</h4>}
          </Button>
        </div>
        <div className="flex flex-col w-9/12 ml-2 border-2 border-gray-600 fixed-width">
          <h2 className="underline-offset-8 underline decoration-gray-600 decoration-2">
            Log
          </h2>
          <div className="flex flex-col">
            {log.map((logItem) => (
              <div key={logItem} className="bg-zinc-900 p-2 m-2">
                <div dangerouslySetInnerHTML={{ __html: logItem }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
