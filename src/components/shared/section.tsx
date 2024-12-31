import React from "react";

interface SectionProps {
  id?: string; 
  header?: string;
  subHeader?: string;
  children?: React.ReactNode;
  className?: string; 
}

const Section: React.FC<SectionProps> = ({ id, header, subHeader, children, className }) => {
  return (
    <div id={id} className={`mx-auto max-w-7xl my-4 p-4 ${className}`}>
      {header && <h2 className="text-2xl font-extrabold text-center mb-2">{header}</h2>}
      {subHeader && <h3 className="text-lg text-gray-700 text-center italic">{subHeader}</h3>}
      {children}
    </div>
  );
};

export default Section;
