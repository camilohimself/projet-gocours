import type React from 'react';

const GoCoursLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    className="h-8 w-auto"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text
      x="10"
      y="35"
      fontFamily="Poppins, sans-serif"
      fontSize="30"
      fontWeight="bold"
      fill="url(#logoGradient)"
    >
      GoCours
    </text>
  </svg>
);

export default GoCoursLogo;