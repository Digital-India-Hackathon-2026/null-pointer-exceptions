import { useState, useRef, useEffect, createContext, useContext, Children } from "react";

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
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, children }}>
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
      className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-left shadow-sm hover:bg-gray-50 transition-colors ${className}`}
      {...props}
    >
      {children}
      {/* ADDED: Visual Dropdown Indicator Arrow */}
      <span className={`text-xs text-gray-400 transition-transform duration-200 ${ctx.open ? 'rotate-180' : ''}`}>
        ▼
      </span>
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const ctx = useContext(SelectContext);
  
  const contentElement = Children.toArray(ctx.children).find(
    (child) => child.type?.name === 'SelectContent' || child.type?.displayName === 'SelectContent'
  );

  if (contentElement && ctx.value) {
    const items = Children.toArray(contentElement.props.children);
    const selectedItem = items.find((item) => item.props?.value === ctx.value);
    if (selectedItem) {
      return <span className="truncate">{selectedItem.props.children}</span>;
    }
  }

  return <span className="text-gray-400 truncate">{placeholder}</span>;
};

export const SelectContent = ({ className = "", children, ...props }) => {
  const ctx = useContext(SelectContext);
  if (!ctx.open) return null;
  return (
    <div
      className={`absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg min-w-[max-content] lg:min-w-full ${className}`}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

SelectContent.displayName = "SelectContent";

export const SelectItem = ({ value, className = "", children, ...props }) => {
  const ctx = useContext(SelectContext);
  const isSelected = ctx.value === value;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        ctx.onValueChange(value);
        ctx.setOpen(false);
      }}
      className={`cursor-pointer px-3 py-2 text-sm select-none transition-colors hover:bg-gray-100 ${
        isSelected ? "bg-emerald-50 text-emerald-900 font-medium" : "text-gray-700"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};