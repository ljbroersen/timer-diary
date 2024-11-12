import { useTimer } from "react-timer-hook";
import { useState } from "react";
import "./App.css";
import "../input.css";

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
    <div className="text-center">
      {showInputs ? (
        <div>
          <input
            type="number"
            placeholder="Hours"
            value={customTime.hours}
            onChange={(e) =>
              setCustomTime({ ...customTime, hours: parseInt(e.target.value) })
            }
          />
          <input
            type="number"
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
            placeholder="Seconds"
            value={customTime.seconds}
            onChange={(e) =>
              setCustomTime({
                ...customTime,
                seconds: parseInt(e.target.value),
              })
            }
          />
          <button onClick={handleStart}>Start</button>
        </div>
      ) : (
        <div>
          <h1>Timer Diary</h1>
          <div className="text-[100px]">
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
          <p>{isRunning ? "Running" : "Not running"}</p>
          <button onClick={start}>Start</button>
          <button onClick={pause}>Pause</button>
          <button onClick={resume}>Resume</button>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
}

// export default function App() {
//   const time = new Date();
//   time.setSeconds(time.getSeconds() + 600); // 10 minutes timer
//   return (
//     <div>
//       <MyTimer expiryTimestamp={time} />
//     </div>
//   );
// }
