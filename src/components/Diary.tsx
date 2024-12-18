import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { ArrowDown } from "./ArrowDown";
import { ArrowUp } from "./ArrowUp";
import "../../calendar.css";

interface MyLogProps {
  URL: string;
  setDiaryDates: (dates: DateRecord[]) => void;
  setAddLog: (addLog: (log: LogItem) => void) => void;
}

export type LogItem = {
  id: number;
  date_id: number;
  date: string;
  timer_leftover: string;
  description: string;
};

export type DateRecord = {
  id: number;
  date: string;
};

export default function Diary({
  URL,
  setDiaryDates,
  setAddLog,
}: Readonly<MyLogProps>) {
  const [log, setLog] = useState<LogItem[]>([]);
  const [dates, setDates] = useState<DateRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [visibleLogIndex, setVisibleLogIndex] = useState<number>(0);
  const logsPerPage = 2;

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(`${URL}/dates`);
        if (response.ok) {
          const data: DateRecord[] = await response.json();
          const compareDates = (a: DateRecord, b: DateRecord): number =>
            new Date(b.date).getTime() - new Date(a.date).getTime();

          const sortedDates = data.sort(compareDates);
          setDates(sortedDates);
          setDiaryDates(sortedDates);
        } else {
          console.error("Failed to fetch dates");
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    fetchDates();

    function addNewLog(newLog: LogItem) {
      setLog((prevLogs) => [...prevLogs, newLog]);
    }

    function initializeAddLogSetter() {
      setAddLog(() => addNewLog);
    }

    initializeAddLogSetter();
  }, [URL, setDates, setAddLog, log, setDiaryDates]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!selectedDate) return;

      const selectedDateString = formatDate(selectedDate);
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
  }, [selectedDate, dates, URL]);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const showMoreLogs = () => {
    setVisibleLogIndex((prev) =>
      Math.min(prev + logsPerPage, log.length - logsPerPage)
    );
  };

  const showPreviousLogs = () => {
    setVisibleLogIndex((prev) => Math.max(prev - logsPerPage, 0));
  };

  let content;

  if (log.length === 0 && selectedDate) {
    content = (
      <div className="flex items-center justify-center h-full">
        No logs for this date.
      </div>
    );
  } else if (selectedDate === null) {
    content = (
      <div className="flex items-center justify-center h-full px-5">
        Please select a date from the calendar to view logs.
      </div>
    );
  } else {
    content = log
      .slice(visibleLogIndex, visibleLogIndex + logsPerPage)
      .map((logItem) => (
        <div
          key={logItem.id}
          className="p-4 [&:nth-child(even)]:bg-emerald-900 [&:nth-child(odd)]:bg-emerald-800"
        >
          <div className="flex flex-col">
            <p className="break-words overflow-hidden">
              Time: {logItem.timer_leftover}
            </p>
            <p className="break-words overflow-hidden whitespace-pre-wrap">
              Description: {logItem.description}
            </p>
          </div>
        </div>
      ));
  }

  return (
    <div className="flex flex-row mt-3">
      <div className="flex flex-col w-4/12 mr-2 border-2 border-emerald-800 bg-emerald-700 2xl:h-[490px] md-h-screen md:mb-10">
        <h2 className="underline-offset-8 underline decoration-white decoration-2">
          Calendar
        </h2>
        <div className="flex justify-center">
          <Calendar
            onChange={(date) => {
              setSelectedDate(date as Date);
              setVisibleLogIndex(0);
            }}
            value={selectedDate}
            tileClassName={({ date }) => {
              const formattedDate = formatDate(date);
              return dates.some((d) => d.date === formattedDate)
                ? "bg-emerald-800 text-white"
                : "";
            }}
          />
        </div>
      </div>

      <div className="flex flex-col w-8/12 ml-2 border-2 border-emerald-800 bg-emerald-700 2xl:h-[490px] sm-h-screen sm:mb-10">
        <h2 className="underline-offset-8 underline decoration-white decoration-2">
          Log
        </h2>
        <div className="flex justify-center sticky top-0 bg-emerald-700 z-10 p-2">
          {visibleLogIndex > 0 && <ArrowUp onClick={showPreviousLogs} />}
        </div>
        <div className="flex-grow overflow-y-auto">{content}</div>

        <div className="flex justify-center sticky bottom-0 bg-emerald-700 z-10 p-2">
          {visibleLogIndex + logsPerPage < log.length && (
            <ArrowDown onClick={showMoreLogs} />
          )}
        </div>
      </div>
    </div>
  );
}
