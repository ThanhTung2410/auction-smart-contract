"use client";

import Countdown from "react-countdown";

function Completionist() {
  return <span>You are good to go!</span>;
}

export default function CountdownTimer() {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      console.log(Date.now());
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span style={{ color: "black" }}>
          {days} days: {hours} hours: {minutes} minutes: {seconds} seconds
        </span>
      );
    }
  };

  return (
    <div>
      <Countdown
        date={Date.now() + (1690731834000 - Date.now())}
        renderer={renderer}
        autoStart={false}
      />
    </div>
  );
}
