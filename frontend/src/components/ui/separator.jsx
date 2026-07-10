export const Separator = ({ className = "", orientation = "horizontal", ...props }) => (
  <div
    className={`bg-gray-200 ${orientation === "horizontal" ? "h-px w-full" : "w-px h-full"} ${className}`}
    {...props}
  />
);