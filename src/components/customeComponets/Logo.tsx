import React from 'react';
import { FaCircleExclamation } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { TbClockPlus } from "react-icons/tb";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaRegSquarePlus } from "react-icons/fa6";
type Props = {
  name: string;
  children?: React.ReactNode;
  childrunClass?: string;
  containerClass?: string;
  iconSize?: number; // `number` for `size` compatibility
  onClick?: () => void;
  className?: string;
  style: React.CSSProperties
};

const Logo: React.FC<Props> = ({
  name,
  children,
  childrunClass,
  containerClass = 'flex justify-center items-center', // default flex styling
  iconSize = 40, // default icon size
  onClick,
  className,
  ...props
}) => {
  const CurrentIcon = (): JSX.Element => {
    switch (name) {
      case 'exlamation':
        return  <FaCircleExclamation size={iconSize} className={childrunClass}  {...props} />
        
      case 'downarrow':
        return  <FaChevronDown size={iconSize} className={childrunClass}  {...props} />

      case 'plusclock':
        return  <TbClockPlus size={iconSize} className={childrunClass}  {...props} />
      case 'delete':
        return  <RiDeleteBin5Fill size={iconSize} className={childrunClass}  {...props} />
      case 'plus':
        return  <FaRegSquarePlus size={iconSize} className={childrunClass}  {...props} />
      default:
        return <p>Missing icon</p>;
    }
  };

  return (<>
  <div className={containerClass} onClick={onClick}>
      {CurrentIcon()}
      {children && <span className={childrunClass}>{children}</span>}
      </div>
      </>
  );
};

export default Logo;