import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import Button from "./components/Button";

// Interface for a date
interface DateRecord {
  id: number;
  date: string;
}

// Interface for a log entry
interface LogRecord {
  id: number;
  date_id: number;
  timer_leftover: string;
  description: string;
}

export default function App() {
  const [log, setLog] = useState<LogRecord[]>([]); // Logs for the selected date
  const [dates, setDates] = useState<DateRecord[]>([]); // All dates
  const [currentLogDate, setCurrentLogDate] = useState<Date | null>(null);
  const [selectedDateId, setSelectedDateId] = useState<number | null>(null); // Selected date ID

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Fetch all dates from the backend
  const fetchDates = async () => {
    try {
      const response = await fetch("http://localhost:10000/dates");
      if (response.ok) {
        const datesData = await response.json();
        setDates(datesData);
      } else {
        console.error("Failed to fetch dates");
      }
    } catch (error) {
      console.error("Error fetching dates:", error);
    }
  };

  // Fetch logs for the selected date (by date_id)
  const fetchLogs = async (dateId: number) => {
    try {
      const response = await fetch(
        `http://localhost:10000/logs?dateId=${dateId}`
      );
      if (response.ok) {
        const logsData = await response.json();
        setLog(logsData); // Set logs for the selected date
      } else {
        console.error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Fetch dates and logs when the component mounts or when selectedDateId changes
  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDateId) {
      fetchLogs(selectedDateId); // Fetch logs when the selected date changes
    }
  }, [selectedDateId]);

  const handleRestart = (difference: string, description: string) => {
    const currentDate = new Date();

    if (!currentLogDate || currentDate.getDate() !== currentLogDate.getDate()) {
      console.log("Setting new current log date:", currentDate);
      setCurrentLogDate(currentDate); // Update the current date when restart happens
    }

    // When creating a new log, ensure `id` and `date_id` are properly set.
    const newLog: LogRecord = {
      id: Date.now(), // Use a temporary ID like timestamp (you can replace this after inserting in DB)
      date_id: selectedDateId || 0, // We use selectedDateId for the date reference
      timer_leftover: difference,
      description,
    };

    setLog((prevLog) => [...prevLog, newLog]); // Add the new log entry to the state
    handleSendLog(currentDate, difference, description); // Send the log to the server
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

        // After successfully creating the log, refetch the dates and logs
        fetchDates(); // Refresh the dates list
        if (selectedDateId) {
          fetchLogs(selectedDateId); // Refresh logs for the selected date
        }
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
          {dates.map((dateRecord) => (
            <Button
              key={dateRecord.id}
              onClick={() => {
                setSelectedDateId(dateRecord.id);
                setCurrentLogDate(new Date(dateRecord.date));
              }}
            >
              <h4>{dateRecord.date}</h4>
            </Button>
          ))}
        </div>
        <div className="flex flex-col w-9/12 ml-2 border-2 border-gray-600 fixed-width">
          <h2 className="underline-offset-8 underline decoration-gray-600 decoration-2">
            Log
          </h2>
          <div className="flex flex-col">
            {log.length === 0 && selectedDateId && (
              <div>No logs for this date.</div>
            )}
            {log.map((logItem) => (
              <div key={logItem.id} className="bg-zinc-900 p-2 m-2">
                <div>
                  {logItem.timer_leftover} - {logItem.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
