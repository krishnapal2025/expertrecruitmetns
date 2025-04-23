import React from "react";

type FlagProps = {
  className?: string;
};

export function IndiaFlag({ className =  "h-6 w-9" }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
    >
      <rect width="900" height="600" fill="#f8f9fa" />
      <rect width="900" height="200" fill="#FF9933" />
      <rect width="900" height="200" fill="#FFFFFF" y="200" />
      <rect width="900" height="200" fill="#138808" y="400" />
      <circle cx="450" cy="300" r="60" fill="#000080" />
      <circle cx="450" cy="300" r="55" fill="#FFFFFF" />
      <circle cx="450" cy="300" r="16" fill="#000080" />
      <g fill="#000080">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="450"
            y1="300"
            x2={450 + 39 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={300 + 39 * Math.sin((i * 15 * Math.PI) / 180)}
            strokeWidth="3"
            stroke="#000080"
          />
        ))}
      </g>
    </svg>
  );
}

export function UAEFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
    >
      <rect width="900" height="600" fill="#f8f9fa" />
      <rect width="900" height="200" fill="#00732F" />
      <rect width="900" height="200" fill="#FFFFFF" y="200" />
      <rect width="900" height="200" fill="#000000" y="400" />
      <rect width="300" height="600" fill="#FF0000" />
    </svg>
  );
}

export function USAFlag({ className = "h-6 w-9" }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      className={className}
    >
      <rect width="900" height="600" fill="#f8f9fa" />
      <g fill="#BF0A30">
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={i}
            width="900"
            height="42.857"
            y={i * 85.714}
            fill="#BF0A30"
          />
        ))}
      </g>
      <rect width="342.857" height="314.286" fill="#002868" />
      <g fill="#FFFFFF">
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: row % 2 === 0 ? 6 : 5 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * 60 + 30 + (row % 2 === 0 ? 0 : 30)}
              cy={row * 35 + 30}
              r="12"
              fill="#FFFFFF"
            />
          ))
        )}
      </g>
      <g fill="#FFFFFF">
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={i}
            width="900"
            height="42.857"
            y={i * 85.714 + 42.857}
            fill="#FFFFFF"
          />
        ))}
      </g>
    </svg>
  );
}