"use client";

import { useState } from "react";
import Timer from "./components/Timer";
import Diary, { LogItem, DateRecord } from "./components/Diary";
import { port } from "../server/config.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const URL = `http://localhost:${port}`;

export default function App() {
  const queryClient = useQueryClient();

  const [addLog, setAddLog] = useState<((log: LogItem) => void) | null>(null);
  const [dates, setDates] = useState<DateRecord[]>([]);

  const createLogMutation = useMutation({
    mutationFn: async (newLog: {
      date: string;
      timer_leftover: string;
      description: string;
    }) => {
      const response = await fetch(`${URL}/logs/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });

      if (!response.ok) {
        throw new Error("Failed to send log to server");
      }

      return response.json();
    },
    onMutate: async (newLog) => {
      await queryClient.cancelQueries({ queryKey: ["logs"] });

      const previousLogs = queryClient.getQueryData<LogItem[]>(["logs"]);

      queryClient.setQueryData<LogItem[]>(["logs"], (old) => [
        ...(old || []),
        {
          ...newLog,
          id: Date.now(),
          date_id: -1,
        },
      ]);

      return { previousLogs };
    },
    onError: (
      error: Error,
      _variables: { date: string; timer_leftover: string; description: string },
      context: { previousLogs?: LogItem[] } | undefined
    ) => {
      console.error("Error creating log:", error);
      if (context?.previousLogs) {
        queryClient.setQueryData(["logs"], context.previousLogs);
      }
    },
    onSuccess: (newLog: LogItem) => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });

      if (addLog) {
        addLog(newLog);
      }

      if (!dates.some((date) => date.date === newLog.date)) {
        setDates((prevDates) => [
          ...prevDates,
          { id: newLog.date_id, date: newLog.date },
        ]);
      }
    },
  });

  const handleRestart = (difference: string, description: string) => {
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

    createLogMutation.mutate(payload);
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
