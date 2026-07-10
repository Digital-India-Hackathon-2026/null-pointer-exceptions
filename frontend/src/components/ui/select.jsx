import { useState, useRef, useEffect, createContext, useContext } from "react";

const SelectContext = createContext();

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative" ref={ref}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ className = "", children, ...props }) => {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => ctx.setOpen((o) => !o)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const ctx = useContext(SelectContext);
  return <span>{ctx.value || placeholder}</span>;
};

export const SelectContent = ({ className = "", children, ...props }) => {
  const ctx = useContext(SelectContext);
  if (!ctx.open) return null;
  return (
    <div
      className={`absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({ value, className = "", children, ...props }) => {
  const ctx = useContext(SelectContext);
  return (
    <div
      onClick={() => {
        ctx.onValueChange(value);
        ctx.setOpen(false);
      }}
      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};