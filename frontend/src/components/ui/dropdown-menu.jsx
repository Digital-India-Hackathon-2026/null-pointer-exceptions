import React, { useState, useRef, useEffect } from "react";

export const DropdownMenu = ({ children }) => {
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
    <div className="relative inline-block" ref={ref}>
      {children.map((child) =>
        child.type === DropdownMenuTrigger
          ? { ...child, props: { ...child.props, onClick: () => setOpen((o) => !o) } }
          : child.type === DropdownMenuContent
          ? open && child
          : child
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ asChild, children, onClick, ...props }) => {
  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        onClick?.(e);
      },
      ...props,
    });
  }

  return (
    <div onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ className = "", children, ...props }) => (
  <div
    className={`absolute right-0 mt-2 min-w-[8rem] rounded-md border border-gray-200 bg-white p-1 shadow-md z-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const DropdownMenuItem = ({ className = "", children, ...props }) => (
  <div
    className={`cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);