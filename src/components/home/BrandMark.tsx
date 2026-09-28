/** Minimal monochrome brand marks for browse carousel — not franchise marks. */
export function BrandMark({ name, className = "" }: { name: string; className?: string }) {
  const common = {
    viewBox: "0 0 48 48",
    className,
    "aria-hidden": true as const,
    fill: "currentColor",
  };

  switch (name) {
    case "Toyota":
      return (
        <svg {...common}>
          <ellipse cx="24" cy="24" rx="18" ry="10" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <ellipse cx="24" cy="24" rx="7" ry="18" fill="none" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      );
    case "Honda":
      return (
        <svg {...common}>
          <path
            d="M14 34V14h5.2v7.4h9.6V14H34v20h-5.2v-8.2h-9.6V34H14z"
            fillRule="evenodd"
          />
        </svg>
      );
    case "Hyundai":
      return (
        <svg {...common}>
          <path d="M8 30c6-10 12-14 16-14s10 4 16 14h-5.2c-4.2-6.4-7.6-9-10.8-9s-6.6 2.6-10.8 9H8z" />
          <path d="M18 18h12v3.2H18V18z" />
        </svg>
      );
    case "Kia":
      return (
        <svg {...common}>
          <path d="M10 16h5.2l6.4 8.2L28 16h5.5L25.2 26.4 34 34h-5.6l-7-8.8L14.6 34H10l8.6-11.2L10 16z" />
        </svg>
      );
    case "Nissan":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M12 24h24M16 18.5h16M16 29.5h16" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "Chevrolet":
      return (
        <svg {...common}>
          <path d="M8 24h8.5l3-6h9l3 6H40v5H31.5l-3 6h-9l-3-6H8v-5zm11.2 0h9.6l-1.6-3.2h-6.4L19.2 24z" />
        </svg>
      );
    case "Ford":
      return (
        <svg {...common}>
          <ellipse cx="24" cy="24" rx="18" ry="11" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M14 26.5c1.2-4 3.2-6 7.2-6h4.8c3.4 0 5.2 1.4 5.2 3.6 0 2.2-1.6 3.4-4.4 3.4h-4.2l-.6 2.5H14.4L16 22h5.6c1.2 0 1.8.5 1.8 1.3s-.6 1.3-1.7 1.3H16l-2 3.9z" />
        </svg>
      );
    case "Mazda":
      return (
        <svg {...common}>
          <path d="M24 8c2 8 10 12 10 20 0 6-4.4 10-10 10S14 34 14 28c0-8 8-12 10-20z" />
        </svg>
      );
    case "Mitsubishi":
      return (
        <svg {...common}>
          <path d="M24 10l6 10H18l6-10zm0 28l-6-10h12l-6 10zM10 28l6-10 6 10H10zm28 0H28l6-10 6 10z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <text x="24" y="29" textAnchor="middle" fontSize="16" fontWeight="700">
            {name.slice(0, 1)}
          </text>
        </svg>
      );
  }
}
