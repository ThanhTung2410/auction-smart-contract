"use client";

import Countdown from "react-countdown";

import styles from "./countdownTimer.module.scss";

function Completionist() {
  return <span>The auction has ended</span>;
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
        <span className={styles.clock} style={{ color: "black" }}>
          <div data-value="days">
            <div>{days}</div>
            <div>days</div>
          </div>

          <div data-value="hours">
            <div>{hours}</div>
            <div>hours</div>
          </div>

          <div data-value="minutes">
            <div>{minutes}</div>
            <div>minutes</div>
          </div>

          <div data-value="seconds">
            <div>{seconds}</div>
            <div>seconds</div>
          </div>
        </span>
      );
    }
  };

  return (
    <div>
      <Countdown
        date={Date.now() + (1690731834000 - Date.now())}
        renderer={renderer}
        intervalDelay={0}
      />
    </div>
  );
}
