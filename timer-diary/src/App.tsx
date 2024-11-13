import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "./App.css";
import Button from "./components/Button";

interface MyTimerProps {
  expiryTimestamp: Date;
}

export default function MyTimer({ expiryTimestamp }: Readonly<MyTimerProps>) {
  const [showInputs, setShowInputs] = useState(true);
  const [customTime, setCustomTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [log, setLog] = useState<string[]>([]);

  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
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
        .padStart(2, "0")} minutes ${seconds
        .toString()
        .padStart(2, "0")} seconds`;
    };

    const difference = formatTime(differenceInMs);

    setLog([...log, `Time passed: ${difference}`]);
    setShowInputs(true);
    console.log(difference);
  };

  return (
    <>
      <div className="text-center">
        <h1>Timer Diary</h1>
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
                  hours: parseInt(e.target.value),
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
                  minutes: parseInt(e.target.value),
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
                  seconds: parseInt(e.target.value),
                })
              }
            />
            <br />
            <Button onClick={handleStart}>Start</Button>
          </div>
        ) : (
          <div>
            <div className="text-[100px]">
              <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <p>{isRunning ? "Running" : "Not running"}</p>
            <Button onClick={pause}>Pause</Button>
            <Button onClick={resume}>Resume</Button>
            <Button onClick={handleRestart}>Restart</Button>
          </div>
        )}
      </div>

      <div className="text-center">
        <h2>Log</h2>
        {log.map((logItem) => (
          <p key={logItem}>{logItem}</p>
        ))}
      </div>
    </>
  );
}
