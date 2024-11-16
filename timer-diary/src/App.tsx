import { useState } from "react";
import Timer from "./components/Timer";
import Button from "./components/Button";

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const [currentLogDate, setCurrentLogDate] = useState<Date | null>(null);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleRestart = (difference: string, description: string) => {
    const currentDate = new Date();

    if (!currentLogDate || currentDate.getDate() !== currentLogDate.getDate()) {
      console.log("Setting new current log date:", currentDate);
      setCurrentLogDate(currentDate);
    }

    setLog([...log, `${difference} - ${description}`]);
    handleSendLog(currentDate, difference, description);
  };

  const handleSendLog = async (
    date: Date,
    timer_leftover: string,
    description: string
  ) => {
    if (!date) {
      console.error("No date provided for the log.");
      return;
    }

    try {
      const formattedDate = formatDate(date);
      console.log("Sending POST request with date:", formattedDate);

      const response = await fetch("http://localhost:10000/logs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          timer_leftover: timer_leftover,
          description: description,
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
            {log.map((logItem, index) => (
              <div key={index} className="bg-zinc-900 p-2 m-2">
                <div dangerouslySetInnerHTML={{ __html: logItem }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
