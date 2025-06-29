
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  ariaHidden?: boolean;
  title?: string; // Added title prop
}

const Icon: React.FC<IconProps> = ({ name, className, ariaHidden = true, title }) => {
  return <i className={`${name} ${className || ''}`} aria-hidden={ariaHidden} title={title}></i>; // Added title attribute
};

export default Icon;

