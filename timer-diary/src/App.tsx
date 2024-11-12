import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "./App.css";
import "../input.css";
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
    setShowInputs(true);
  };

  return (
    <>
      <div className="text-center">
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
            <h1>Timer Diary</h1>
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
        <p>There should be text here regardless of State.</p>
      </div>
    </>
  );
}
