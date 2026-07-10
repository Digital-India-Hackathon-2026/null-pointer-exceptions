const variantClasses = {
  default: "bg-blue-600 text-white",
  secondary: "bg-gray-100 text-gray-800",
  outline: "border border-gray-300 text-gray-800",
  destructive: "bg-red-600 text-white",
};

export const Badge = ({ className = "", variant = "default", children, ...props }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </span>
);