import React from 'react';
import { useMediaQuery } from 'react-responsive';

export const CircularProgressBar = ({ percentage, color }) => {
    // Media queries for different screen sizes
    const isMobile = useMediaQuery({ maxWidth: 768 }); // Mobile screens
    const isTabletOrDesktop = useMediaQuery({ minWidth: 769 }); // Tablet or larger

    const radius = isMobile ? 20 : 30; // Dynamic radius
    const strokeWidth = 5;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progress = ((100 - percentage) / 100) * circumference;

    // Font size adjustment based on screen size
    const fontSize = isMobile ? "10px" : "14px";

    return (
        <svg height={radius * 2} width={radius * 2}>
            <circle
                fill="transparent"
                stroke="#fff"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
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
                fontSize={fontSize}
                fill="white"
            >
                {percentage}%
            </text>
        </svg>
    );
};
