import Timer from "./components/Timer";
import { useState } from "react";

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const [currentLogDate, setCurrentLogDate] = useState<Date | null>(null);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };

  const handleRestart = (newLog: string) => {
    const currentDate = new Date();
    if (!currentLogDate || currentDate.getDate() !== currentLogDate.getDate()) {
      setCurrentLogDate(currentDate);
      setLog([newLog]);
    } else {
      setLog([...log, newLog]);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1>Timer</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-col w-3/12 mr-2">
          <h2>Date</h2>
          {currentLogDate && <h3>{formatDate(currentLogDate)}</h3>}
        </div>
        <div className="flex flex-col w-9/12 ml-2 fixed-width">
          <h2>Log</h2>
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
