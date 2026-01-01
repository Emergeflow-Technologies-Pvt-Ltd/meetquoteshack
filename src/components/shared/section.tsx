import React from "react";

interface SectionProps {
  id?: string;
  header?: string;
  subHeader?: string;
  children?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  header,
  subHeader,
  children,
  className,
  fullWidth,
}) => {
  return (
    <div
      id={id}
      className={`${fullWidth ? "w-full" : "mx-auto max-w-7xl"} p-4 ${className}`}
    >
      {header && (
        <h2 className="mb-2 text-center text-2xl font-extrabold">{header}</h2>
      )}
      {subHeader && (
        <h3 className="text-center text-lg italic text-gray-700">
          {subHeader}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Section;
