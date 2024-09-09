import React from 'react';

const Button = ({ text, bgColor, textColor }) => {
  return (
    <button
      className={`px-8 py-2 rounded-[27.5px] bg-${bgColor} text-${textColor} font-semibold`}
    >
      {text}
    </button>
  );
};

export default Button;
