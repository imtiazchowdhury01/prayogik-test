import React from "react";


const IconContainer = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => {
  return (
    <div className={`p-[10px] rounded-[10px] h-11 w-11`}
     style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
};

export default IconContainer;
