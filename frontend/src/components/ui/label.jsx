export const Label = ({ className = "", children, ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);