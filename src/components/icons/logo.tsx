import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor"
      {...props}
    >
      <rect width="100" height="100" rx="15" fill="#4dabf7" />
      <text
        x="50"
        y="45"
        fontFamily="Amiri, serif"
        fontSize="40"
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        محضر
      </text>
      <text
        x="50"
        y="80"
        fontFamily="Inter, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        AI
      </text>
    </svg>
  );
}
