import { createContext, useContext } from "react";

const RadioGroupContext = createContext();

export const RadioGroup = ({ value, onValueChange, className = "", children, ...props }) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>
    <div className={`grid gap-2 ${className}`} {...props}>
      {children}
    </div>
  </RadioGroupContext.Provider>
);

export const RadioGroupItem = ({ value, id, className = "", ...props }) => {
  const ctx = useContext(RadioGroupContext);
  return (
    <input
      type="radio"
      id={id}
      checked={ctx.value === value}
      onChange={() => ctx.onValueChange(value)}
      className={`h-4 w-4 rounded-full border border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};