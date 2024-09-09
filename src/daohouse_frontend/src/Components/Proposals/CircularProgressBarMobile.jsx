import React, { useEffect, useState } from "react";

export const CircularProgressBarMobile = ({ percentage, color }) => {
  const [radius, setRadius] = useState(30);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 370) {
        setRadius(25);
      } else if (window.innerWidth <= 348) {
        setRadius(20);
      } else {
        setRadius(30);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const strokeWidth = 5;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = ((100 - percentage) / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        fill="transparent"
        stroke="#D8D8D8"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={progress}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="14px"
        fontWeight="700"
        fill="#000000"
      >
        {percentage}%
      </text>
    </svg>
  );
};
