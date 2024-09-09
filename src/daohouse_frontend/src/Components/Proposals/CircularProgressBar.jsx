export const CircularProgressBar = ({ percentage, color }) => {

    const radius = 30;
    const strokeWidth = 5;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const progress = ((100 - percentage) / 100) * circumference;

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
                strokeDasharray={circumference + ' ' + circumference}
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
                fill="white"
            >
                {percentage}%
            </text>
        </svg>
    );
};