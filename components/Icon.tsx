interface IconProps {
  name: string;
  className?: string;
  ariaHidden?: boolean;
  title?: string;
}

import React from 'react';

const Icon = ({ name, className, ariaHidden = true, title }: IconProps) => {
  return (
    <i
      className={`${name} ${className || ''}`}
      aria-hidden={ariaHidden}
      title={title}
    ></i>
  );
};

export default Icon;
