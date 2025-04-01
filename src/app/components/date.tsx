"use client";

import { useEffect, useState } from "react";

export default function DateComponent() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <div>
        {time.getFullYear()} - {time.getMonth() + 1} - {time.getDate()}
      </div>
      <div>
        {time.getHours()} : {time.getMinutes()} : {time.getSeconds()}
      </div>
    </div>
  );
}
