
import React from 'react';

type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
};

const IconButton: React.FC<Props> = ({ onClick, children, className='' }) => {
  return (
    <button
      onClick={onClick}
      className={"p-2 rounded-full shadow-lg transform transition hover:scale-110 " + className}
    >
      {children}
    </button>
  );
};

export default IconButton;
