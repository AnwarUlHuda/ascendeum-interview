import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [timer, setTimer] = useState(5);
  const [clickedData, setClickedData] = useState([]);
  const [currentState, setCurrentState] = useState("start");
  const [currentTime, setCurrentTime] = useState(timer);
  const [currentPos, setCurrentPos] = useState();
  const [additionalTime, setadditionalTime] = useState(0);

  const handleStartClick = () => {
    setCurrentState("in-progress");
    setCurrentTime(timer);
    let random = Math.floor(Math.random() * 100);
    setCurrentPos(random);
  };

  const handlePauseClick = () => {
    setCurrentState("paused");
  };

  useEffect(() => {
    if (currentState !== "in-progress") return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 0.1) {
          return Number(timer);
        }
        return prevTime - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentState, timer]);

  useEffect(() => {
    if (currentTime <= 0.1 && currentState === "in-progress") {
      const random = Math.floor(Math.random() * 100);
      setCurrentPos(random);
      let prevTime = additionalTime;
      setadditionalTime(Number(prevTime) + Number(timer));
      setCurrentTime(timer);
    }
  }, [currentTime]);

  const handleReset = () => {
    setCurrentState("start");
    setTimer(5);
    setCurrentTime(0);
    setadditionalTime(0);
    setCurrentPos(null);
    setClickedData([]);
  };

  const handleClick = (value) => {
    if (value == currentPos && currentState == "in-progress") {
      let value = Number(timer - currentTime).toFixed(1);
      let data = parseFloat(value) + additionalTime;
      setCurrentTime(timer);
      setadditionalTime(0);
      setClickedData((prev) => [...prev, data]);
      let random = Math.floor(Math.random() * 100);
      setCurrentPos(random);
    }
  };

  return (
    <div className="App">
      <div style={{ display: "flex", gap: "5px" }}>
        <button onClick={handleStartClick} style={{ padding: "5px 20px" }}>
          Start
        </button>
        <button onClick={handlePauseClick} style={{ padding: "5px 20px" }}>
          Pause
        </button>
        <button onClick={handleReset} style={{ padding: "5px 20px" }}>
          Reset
        </button>
        <input
          type="number"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          disabled={currentState == "in-progress"}
        />
      </div>
      <div
        style={{
          display: "grid",
          gap: "2px",
          gridTemplateColumns: "repeat(10, 1fr)",
          border: "1px solid black",
          width: "200px",
          height: "200px",
        }}
        id="dynamicBox"
      >
        {Array(100)
          .fill("random")
          .map((_, index) => {
            return (
              <div
                key={index}
                style={{
                  width: "18px",
                  height: "18px",
                  boxSizing: "border-box",
                  border:
                    currentPos == index ? "1px solid red" : "1px solid white",
                  backgroundColor: currentPos == index ? "red" : "white",
                  display: "block",
                }}
                onClick={(e) => handleClick(index)}
              ></div>
            );
          })}
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>Mouse Click Number</th>
            <th>Reaction Time</th>
          </tr>
        </thead>
        <tbody>
          {clickedData.map((data, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data}s</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
