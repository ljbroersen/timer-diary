import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import Button from "./components/Button";

type LogItem = {
  id: number;
  date_id: number;
  date: string;
  timer_leftover: string;
  description: string;
};

type DateRecord = {
  id: number;
  date: string;
};

export default function App() {
  const [log, setLog] = useState<LogItem[]>([]);
  const [dates, setDates] = useState<DateRecord[]>([]);
  const [currentLogDate, setCurrentLogDate] = useState<Date | null>(null);
  const [selectedDateId, setSelectedDateId] = useState<number>(0);
  const URL = "http://localhost:10000";

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(`${URL}/dates`);
        if (response.ok) {
          const data = await response.json();
          setDates(data);
        } else {
          console.error("Failed to fetch dates");
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!selectedDateId) {
        console.error("No date selected. Skipping fetch.");
        return;
      }

      try {
        const response = await fetch(`${URL}/logs?dateId=${selectedDateId}`);
        if (response.ok) {
          const data = await response.json();
          setLog(data);
        } else {
          console.error("Failed to fetch logs");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [selectedDateId]);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleRestart = (difference: string, description: string) => {
    const currentDate = new Date();

    if (!currentLogDate || currentDate.getDate() !== currentLogDate.getDate()) {
      setCurrentLogDate(currentDate);
    }

    setLog((prevLog) => [
      ...prevLog,
      {
        id: log.length + 1,
        date_id: selectedDateId,
        date: formatDate(currentDate),
        timer_leftover: difference,
        description: description,
      },
    ]);
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

      const response = await fetch(`${URL}/logs/create`, {
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
        await response.json();
        fetchLogsForDate(selectedDateId);
      } else {
        console.error("Failed to create log");
      }
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  const fetchLogsForDate = async (dateId: number) => {
    try {
      const response = await fetch(`${URL}/logs?dateId=${dateId}`);
      if (response.ok) {
        const data = await response.json();
        setLog(data);
      } else {
        console.error("Failed to fetch logs after creating a new log");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1>Timer</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-col w-3/12 mr-2 border-2 border-emerald-800 bg-emerald-700">
          <h2 className="underline-offset-8 underline decoration-white decoration-2">
            Dates
          </h2>
          {dates.length === 0 ? (
            <div>No dates available</div>
          ) : (
            dates.map((dateRecord) => (
              <Button
                key={dateRecord.id}
                onClick={() => {
                  setSelectedDateId(dateRecord.id);
                }}
              >
                <h4>{dateRecord.date}</h4>
              </Button>
            ))
          )}
        </div>

        <div className="flex flex-col w-9/12 ml-2 border-2 border-emerald-800 bg-emerald-700">
          <h2 className="underline-offset-8 underline decoration-white decoration-2 fixed-width">
            Log
          </h2>
          <div className="flex flex-col">
            {log.length === 0 ? (
              <div>No logs for this date.</div>
            ) : (
              log
                .filter((logItem) => {
                  return logItem.date_id === selectedDateId;
                })
                .map((logItem) => (
                  <div
                    key={logItem.id}
                    className="p-4 [&:nth-child(even)]:bg-emerald-900 [&:nth-child(odd)]:bg-emerald-800"
                  >
                    <div>
                      {logItem.timer_leftover} - {logItem.description}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
