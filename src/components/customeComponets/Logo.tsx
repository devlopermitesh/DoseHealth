import React from 'react';
import { FaCircleExclamation } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { TbClockPlus } from "react-icons/tb";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaRegSquarePlus } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { FaCaretSquareUp } from "react-icons/fa";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { RiDashboardFill } from "react-icons/ri";
import { LuCalendarCheck } from "react-icons/lu";
import { FaUserDoctor } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TbReportSearch } from "react-icons/tb";
import { BsPrescription2 } from "react-icons/bs";
import { TbFileInvoice } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { TfiMenu } from "react-icons/tfi";
import { FaMoon } from "react-icons/fa6";
import { FaSun } from "react-icons/fa6";
import { LuBellDot } from "react-icons/lu";
import { IoIosTrendingUp } from "react-icons/io";
import { IoIosTrendingDown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
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
      case 'logout':
        return <IoMdLogOut size={iconSize} className={childrunClass} {...props} />
      case 'uparrow':
        return <FaCaretSquareUp size={iconSize} className={childrunClass} {...props} />
      case 'help':
        return <IoMdHelpCircleOutline size={iconSize} className={childrunClass} {...props} />
      case 'dashboard':
        return <RiDashboardFill size={iconSize} className={childrunClass} {...props} />
      case 'appointment':
        return <LuCalendarCheck size={iconSize} className={childrunClass} {...props} />
      case 'doctor':
        return <FaUserDoctor size={iconSize} className={childrunClass} {...props} />
      case 'messages':
        return <BiMessageSquareDetail size={iconSize} className={childrunClass} {...props} />
      case 'reportsearch':
        return <TbReportSearch size={iconSize} className={childrunClass} {...props} />
      case 'prescription':
        return <BsPrescription2 size={iconSize} className={childrunClass} {...props} />
      case 'invoice':
        return <TbFileInvoice size={iconSize} className={childrunClass} {...props} />
      case 'settings':
        return <LuSettings size={iconSize} className={childrunClass} {...props} />
      case 'menu':
        return <TfiMenu size={iconSize} className={childrunClass} {...props} />
      case 'darkmode':
        return <FaMoon size={iconSize} className={childrunClass} {...props} />
      case 'lightmode':
        return <FaSun size={iconSize} className={childrunClass} {...props} />
      case 'notification':
        return <LuBellDot size={iconSize} className={childrunClass} {...props} />
      case 'trendingup':
        return <IoIosTrendingUp size={iconSize} className={childrunClass} {...props} />
      case 'trendingdown':
        return <IoIosTrendingDown size={iconSize} className={childrunClass} {...props} />
      case 'filter':
        return <IoFilter size={iconSize} className={childrunClass} {...props}/>
      case 'rightarrow':
        return <MdKeyboardArrowRight size={iconSize} className={childrunClass} {...props}/>


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