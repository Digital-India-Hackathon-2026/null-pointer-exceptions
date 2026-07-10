export const Progress = ({ value = 0, className = "", ...props }) => (
  <div
    className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    {...props}
  >
    <div
      className="h-full bg-blue-600 transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);