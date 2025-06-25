export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={`fill-current ${className}`}
      width={size.toString() + "px"}
      height={size.toString() + "px"}
    >
      <use xlinkHref={`/solid.svg#${name}`} />
    </svg>
  );
}
