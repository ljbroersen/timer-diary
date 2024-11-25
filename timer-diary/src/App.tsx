import { useState, useEffect } from "react";
import Timer from "./components/Timer";
import Button from "./components/Button";
import { ArrowUp } from "./components/ArrowUp";
import { ArrowDown } from "./components/ArrowDown";

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
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const datesPerPage = 5;
  const [visibleLogIndex, setVisibleLogIndex] = useState<number>(0);
  const logsPerPage = 2;
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

  const showMoreDates = () => {
    setVisibleIndex((prev) => Math.min(prev + datesPerPage, dates.length - 1));
  };

  const showPreviousDates = () => {
    setVisibleIndex((prev) => Math.max(prev - datesPerPage, 0));
  };

  const showMoreLogs = () => {
    setVisibleLogIndex((prev) =>
      Math.min(prev + logsPerPage, log.length - logsPerPage)
    );
  };

  const showPreviousLogs = () => {
    setVisibleLogIndex((prev) => Math.max(prev - logsPerPage, 0));
  };

  return (
    <div className="flex flex-col h-screen fixed-width">
      <div>
        <h1 className="">Timer</h1>
        <Timer onRestart={handleRestart} />
      </div>
      <div className="flex flex-row mt-6">
        <div className="flex flex-col w-3/12 mr-2 border-2 border-emerald-800 bg-emerald-700 overflow-y-auto h-[420px] w-[200px]">
          <h2 className="underline-offset-8 underline decoration-white decoration-2">
            Dates
          </h2>
          <div className="flex justify-center mb-4 sticky top-0">
            {visibleIndex > 0 && <ArrowUp onClick={showPreviousDates} />}
          </div>

          {dates.length === 0 ? (
            <div>No dates available</div>
          ) : (
            dates
              .slice(visibleIndex, visibleIndex + datesPerPage)
              .map((dateRecord) => (
                <Button
                  key={dateRecord.id}
                  onClick={() => {
                    setSelectedDateId(dateRecord.id);
                    setVisibleLogIndex(0);
                  }}
                >
                  <h4>{dateRecord.date}</h4>
                </Button>
              ))
          )}
          <div className="flex justify-center mt-4 sticky bottom-0">
            {visibleIndex + datesPerPage < dates.length && (
              <ArrowDown onClick={showMoreDates} />
            )}
          </div>
        </div>

        <div className="flex flex-col w-9/12 ml-2 border-2 border-emerald-800 bg-emerald-700">
          <h2 className="underline-offset-8 underline decoration-white decoration-2">
            Log
          </h2>

          <div className="flex justify-center sticky top-0 bg-emerald-700 z-10 p-2">
            {visibleLogIndex > 0 && <ArrowUp onClick={showPreviousLogs} />}
          </div>

          <div className="flex-grow overflow-y-auto">
            {log.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                No logs for this date.
              </div>
            ) : (
              log
                .filter((logItem) => logItem.date_id === selectedDateId)
                .slice(visibleLogIndex, visibleLogIndex + logsPerPage)
                .map((logItem) => (
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

          <div className="flex justify-center sticky bottom-0 bg-emerald-700 z-10 p-2">
            {visibleLogIndex + logsPerPage <
              log.filter((logItem) => logItem.date_id === selectedDateId)
                .length && <ArrowDown onClick={showMoreLogs} />}
          </div>
        </div>
      </div>
    </div>
  );
}
