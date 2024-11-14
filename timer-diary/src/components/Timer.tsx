import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "./App.css";
import Button from "./Button";

interface MyTimerProps {
  expiryTimestamp?: Date;
  onRestart?: () => void; // Optional callback for restart
}

export default function Timer({ expiryTimestamp, onRestart }: MyTimerProps) {
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timerDescription, setTimerDescription] = useState<string>("");

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp: expiryTimestamp || new Date(),
      // onExpire: () => alert("Finished!"),
    });

  const handleStart = () => {
    if (showInputs) {
      const newExpiryTime = new Date();
      newExpiryTime.setHours(newExpiryTime.getHours() + customTime.hours);
      newExpiryTime.setMinutes(newExpiryTime.getMinutes() + customTime.minutes);
      newExpiryTime.setSeconds(newExpiryTime.getSeconds() + customTime.seconds);
      restart(newExpiryTime);
      setShowInputs(false);
    } else {
      start();
    }
  };

  const handleRestart = () => {
    const leftoverTimeInMs = hours * 3600000 + minutes * 60000 + seconds * 1000;
    const customTimeInMs =
      customTime.hours * 3600000 +
      customTime.minutes * 60000 +
      customTime.seconds * 1000;

    const differenceInMs = customTimeInMs - leftoverTimeInMs;

    const formatTime = (ms: number) => {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);

      return `${hours > 0 ? `${hours} hours` : ""}${minutes
        .toString()
        .padStart(1, "0")} minute(s), ${seconds
        .toString()
        .padStart(1, "0")} second(s)`;
    };

    const difference = formatTime(differenceInMs);

    const currentDescription = timerDescription;

    const newLog = `Time passed: ${difference}<br />Description: ${currentDescription}`;
    onRestart?.(newLog);

    setShowInputs(true);
    setTimerDescription("");
  };

  return (
    <div>
      {showInputs ? (
        <div>
          <input
            type="number"
            className="ml-2 mr-2 p-2"
            placeholder="Hours"
            value={customTime.hours}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                hours: e.target.value === "" ? 0 : parseInt(e.target.value),
              })
            }
          />
          <input
            type="number"
            className="ml-2 mr-2 p-2"
            placeholder="Minutes"
            value={customTime.minutes}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                minutes: e.target.value === "" ? 0 : parseInt(e.target.value),
              })
            }
          />
          <input
            type="number"
            className="ml-2 mr-2 p-2"
            placeholder="Seconds"
            value={customTime.seconds}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                seconds: e.target.value === "" ? 0 : parseInt(e.target.value),
              })
            }
          />
          <p className="m-2 mt-4">Description of activity</p>
          <input
            type="text"
            className="ml-2 mr-2 p-2 w-4/5"
            placeholder="What are you going to do?"
            value={timerDescription}
            onChange={(e) => setTimerDescription(e.target.value)}
          />

          <br />
          <Button onClick={handleStart}>Start</Button>
        </div>
      ) : (
        <div>
          <div className="text-[100px]">
            <span>{hours.toString().padStart(2, "0")}</span>:
            <span>{minutes.toString().padStart(2, "0")}</span>:
            <span>{seconds.toString().padStart(2, "0")}</span>
          </div>
          <p>{isRunning ? "Running" : "Not running"}</p>
          <Button onClick={pause}>Pause</Button>
          <Button onClick={resume}>Resume</Button>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      )}
    </div>
  );
}
