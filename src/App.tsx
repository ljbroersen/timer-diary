import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import Calendar from "react-calendar";
import "../calendar.css";
// import "react-calendar/dist/Calendar.css";

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const URL = "http://localhost:10000";

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(`${URL}/dates`);
        if (response.ok) {
          const data = await response.json();

          const sortedDates = data.sort(
            (a: DateRecord, b: DateRecord) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setDates(sortedDates);
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
      if (!selectedDate) return;

      const selectedDateString = selectedDate.toISOString().split("T")[0];

      const selectedDateRecord = dates.find(
        (dateRecord) => dateRecord.date === selectedDateString
      );

      if (!selectedDateRecord) {
        setLog([]);
        return;
      }

      try {
        const response = await fetch(
          `${URL}/logs?dateId=${selectedDateRecord.id}`
        );
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
  }, [selectedDate, dates]);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleRestart = (difference: string, description: string) => {
    const currentDate = new Date();

    const selectedDateString = formatDate(currentDate);
    const selectedDateRecord = dates.find(
      (dateRecord) => dateRecord.date === selectedDateString
    );

    if (!selectedDateRecord) {
      console.error("No date record found for the selected date.");
      return;
    }

    const newLog = {
      id: log.length + 1,
      date_id: selectedDateRecord.id,
      date: selectedDateString,
      timer_leftover: difference,
      description,
    };

    setLog((prevLog) => [...prevLog, newLog]);

    handleSendLog(currentDate, difference, description);
  };

  const handleSendLog = async (
    date: Date,
    timer_leftover: string,
    description: string
  ) => {
    const formattedDate = formatDate(date);

    try {
      const response = await fetch(`${URL}/logs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          timer_leftover,
          description,
        }),
      });

      if (response.ok) {
        await response.json();
        setSelectedDate(date);
      } else {
        console.error("Failed to create log");
      }
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center -mt-10 h-screen fixed-width">
      <div>
        <h1>Timer</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-col w-3/12 mr-2 border-2 border-emerald-800 bg-emerald-700 h-[420px]">
          <h2 className="underline-offset-8 underline decoration-white decoration-2">
            Calendar
          </h2>
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
            tileClassName={({ date }) => {
              const formattedDate = formatDate(date);
              return dates.some((d) => d.date === formattedDate)
                ? "bg-emerald-500 text-white"
                : "";
            }}
          />
        </div>

        <div className="flex flex-col w-9/12 ml-2 border-2 border-emerald-800 bg-emerald-700">
          <h2 className="underline-offset-8 underline decoration-white decoration-2">
            Log
          </h2>
          <div className="flex-grow overflow-y-auto">
            {log.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                No logs for this date.
              </div>
            ) : (
              log.map((logItem) => (
                <div
                  key={logItem.id}
                  className="p-4 [&:nth-child(even)]:bg-emerald-900 [&:nth-child(odd)]:bg-emerald-800"
                >
                  <div className="flex flex-col">
                    <p className="break-words overflow-hidden text-ellipsis">
                      Time: {logItem.timer_leftover}
                    </p>
                    <p className="break-words overflow-hidden text-ellipsis whitespace-pre-wrap">
                      Description: {logItem.description}
                    </p>
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
