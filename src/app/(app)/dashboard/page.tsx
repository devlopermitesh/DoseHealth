'use client';
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import 'swiper/css';
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/customeComponets/Navbar';
import Whiteheart from "../../../../public/Images/whiteheartlogo.png"
import GreenBlood from "../../../../public/Images/greenbloodlogo.png"
import Image from 'next/image';
import Logo from '@/components/customeComponets/Logo';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, DataObject } from "@/components/ui/calendar"
import {CustomCalendar} from '@/components/customeComponets/CustomeCalendar';
const CustomLineChart = dynamic(() => import('@/components/customeComponets/CustomLineChart').then((module) => module.CustomLineChart), { loading: () => <div>Loading...</div>, ssr: false })
const tableData = [
  {
    doctor: "Dr. Abhijeet Singh",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
    specifications: "Cardiologist",
    date: "2024-12-25",
    time: "10:30 AM",
    status: "Confirmed",
    remarks: "Bring previous reports",
  },
  {
    doctor: "Dr. Priya Sharma",
    profilePic: "https://randomuser.me/api/portraits/women/20.jpg",
    specifications: "Dermatologist",
    date: "2024-12-26",
    time: "2:00 PM",
    status: "Pending",
    remarks: "Follow-up for skin treatment",
  },
  {
    doctor: "Dr. Vikram Mehta",
    profilePic: "https://randomuser.me/api/portraits/men/30.jpg",
    specifications: "Neurologist",
    date: "2024-12-27",
    time: "9:00 AM",
    status: "Completed",
    remarks: "MRI scan reviewed",
  },
  {
    doctor: "Dr. Anjali Gupta",
    profilePic: "https://randomuser.me/api/portraits/women/40.jpg",
    specifications: "Pediatrician",
    date: "2024-12-28",
    time: "3:45 PM",
    status: "Cancelled",
    remarks: "Reschedule required",
  },
  {
    doctor: "Dr. Rajesh Kumar",
    profilePic: "https://randomuser.me/api/portraits/men/50.jpg",
    specifications: "Orthopedic",
    date: "2024-12-29",
    time: "11:15 AM",
    status: "Confirmed",
    remarks: "X-ray report needed",
  },
  {
    doctor: "Dr. Sneha Desai",
    profilePic: "https://randomuser.me/api/portraits/women/60.jpg",
    specifications: "Psychiatrist",
    date: "2024-12-30",
    time: "4:30 PM",
    status: "Pending",
    remarks: "First consultation",
  },
];

const eventsData: DataObject[] = [
  {
    date: "2024-12-13",
    title: "Festival Day",
    description: "Celebration of XYZ Festival.",
    highlight: true, // This date will be highlighted
  },
  {
    date: "2024-12-16",
    title: "Team Meeting",
    description: "Company-wide team meeting to discuss Q4 results.",
    highlight: false,
  },
  {
    date: "2024-12-17",
    title: "Holiday",
    description: "Public holiday in the city.",
    highlight: true, // This date will be highlighted
  },
  {
    date: "2024-12-18",
    title: "Workshop",
    description: "React Workshop for developers.",
    highlight: false,
  },
  {
    date: "2024-12-19",
    title: "Product Launch",
    description: "Launch of new product in the market.",
    highlight: true, // This date will be highlighted
  },
  {
    date: "2024-12-20",
    title: "Christmas Eve",
    description: "Celebrating Christmas Eve with family.",
    highlight: true, // This date will be highlighted
  },  
  {
    date: "2024-12-21",
    title: "Christmas Eve",
    description: "Celebrating Christmas Eve with family.",
    highlight: true, // This date will be highlighted
  },
];

const Dashboard: React.FC = () => {
  const [isloading,setisloading]=useState(false)
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);
  
//show loading display untill data is not fetched
  if (status !== 'authenticated' && isloading) {
    return <div>Loading...</div>;
  }
  const chartData = [
    { date: '2023-01-01', value: 75 },
    { date: '2023-01-02', value: 80 },
    { date: '2023-01-03', value: 78 },
    { date: '2023-01-04', value: 82 },
    { date: '2023-01-05', value: 85 },
    { date: '2023-01-06', value: 88 },
    { date: '2023-01-07', value: 90 },
    { date: '2023-01-08', value: 92 },
];


  return (
<div className="h-auto w-full bg-[#6495ED] bg-opacity-5  flex flex-col scrollbar-hide">
<Navbar/>

{/* //reports container  */}
<div className='container w-full h-full flex flex-col '>
  {/* treading reports  */}
 <div className='flex flex-col lg:flex-row items-center p-4 bg-sidebar rounded-lg shadow-lg w-full h-auto overflow-hidden   lg:mt-10 lg:w-[90%] lg:mx-auto 
  lg:rounded-lg lg:shadow-lg lg:bg-sidebar lg:py-5 lg:px-3 lg:justify-around ' >

  <div className='flex flex-col h-full rounded-lg bg-sky-600 w-full   text-white m-2 p-2 shadow-lg lg:flex-1'>
<span className='flex flex-row items-center space-x-2'>
  <Image src={Whiteheart} alt='white heart logo' width={50} height={50} className='w-10 h-10 rounded-full overflow-hidden'/>
  <h2 className='font-bold text-lg'>Heart Rate</h2>
</span>
<div className='flex flex-row justify-between w-full  font-bold text-xl'>
  <h1>72/100 <sub className='text-gray-200'> BPM</sub></h1>
<span className='flex flex-row flex-wrap bg-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[7.5px] rounded-full  border border-white/18 max-w-24 font-semibold text-sm py-auto text-center'>+10.0% 
<Logo name='trendingup' iconSize={20} className='text-white font-bold' containerClass='flex-end mt-auto mb-1 ' style={{ color: "white" }} />
</span>
</div>

<h4 className='text-md'>Increased heart rate 50% than yesterdahy</h4>
  </div>


  <div className='flex  flex-col h-full rounded-lg bg-white w-full  text-black m-2 p-2 shadow-lg lg:flex-1'>
<span className='flex flex-row items-center space-x-2'>
  <Image src={GreenBlood} alt='green blood logo' width={50} height={50} className='w-10 h-10 rounded-full overflow-hidden'/>
  <h2 className='font-bold text-lg'>Blood Pressure</h2>
</span>
<div className='flex flex-row justify-between w-full  font-bold text-xl'>
  <h1>80<sub className='text-gray-800'> mg/dL</sub></h1>
<span className='flex flex-row flex-wrap bg-green-500/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[7.5px] rounded-full  border border-black max-w-24 font-semibold text-sm py-auto text-center'>+10.0% 
<Logo name='trendingup' iconSize={20} className='text-green font-bold' containerClass='flex-end mt-auto mb-1 ' style={{ color: "green" }} />
</span>
</div>

<h4 className='text-md text-gray-700'>normal from 8 days</h4>
  </div>
  

  <div className='flex  flex-col h-full rounded-lg  bg-white w-full   text-black m-2 p-2 shadow-lg lg:flex-1'>
<span className='flex flex-row items-center space-x-2'>
  <Image src={Whiteheart} alt='white heart logo' width={50} height={50} className='w-10 h-10 rounded-full overflow-hidden'/>
  <h2 className='font-bold text-lg'>Blood Pressure</h2>
</span>
<div className='flex flex-row justify-between w-full  font-bold text-xl'>
  <h1>70-80<sub className='text-gray-800'> mm Hg</sub></h1>
<span className='flex flex-row flex-wrap bg-orange-400/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[7.5px] rounded-full  border border-black max-w-24 font-semibold text-sm py-auto text-center '>+10.0% 
<Logo name='trendingup' iconSize={20} className='text-orange font-bold' containerClass='flex-end mt-auto mb-1 ' style={{ color: "orange" }} />
</span>
</div>

<h4 className='text-md text-gray-700'>Normal from 8 days</h4>
  </div>

</div>

{/* details of reports  */}
<div className='flex flex-col p-4 bg-sidebar bg-opacity-20 rounded-lg shadow-lg w-full h-auto   lg:mt-10 lg:w-[90%] lg:mx-auto lg:space-x-2 lg:flex-row'>
{/* Graph reports  */}

<div className='w-full lg:w-[70%]  '>
<CustomLineChart 
data={chartData}
xAxisKey='date'
lineKey='value'
reportName='Heart Rate'
period='Last 6 months'
result='78.0%'
resultStatus='Average'
description='Increased heart rate 50% than yesterday'
trendPercentage={10}
/></div>

{/* lists reports  */}
<div className='bg-card flex flex-col flex-2 p-4 rounded-lg shadow-sm shadow-black w-full lg:w-[30%]'>
<h1 className='font-bold text-lg'>My Reports</h1>
<ul className='flex flex-col space-y-2 mt-6'>
  <li className='flex flex-row rounded-xl shadow-md border border-gray-500 relative overflow-hidden justify-between '>
    <span className='bg-yellow-400 h-full  w-3 rounded-l-xl'></span>
    <span className=' w-[95%] flex flex-row justify-around items-center py-2'>
      <h3 className='font-semibold text-lg my-auto mr-auto'>Glucose</h3>
      <span className='text-gray-500 ml-auto'>12 Aug, 2021</span>
    </span>
  </li>
  {/* see all reports button  */}
  <Button className='bg-event text-white font-semibold py-2 rounded-lg text-center hover:bg-event'>See All Reports</Button>
</ul>
</div>
</div>

<div className="flex flex-col p-4 bg-sidebar rounded-lg w-full h-auto  lg:mt-10 lg:w-[90%] lg:mx-auto lg:space-x-2 lg:flex-row">

{/* appointment container */}
<div className='flex flex-col w-full  lg:w-[70%]'>
<div className='flex flex-row justify-between items-center shadow-[#6495ED]   shadow-sm bg-sidebar rounded-lg p-4'>
  <h1 className='font-bold text-lg'>Appointments</h1>
  <Button className='bg-white text-gray-600 font-semibold py-2 rounded-lg text-center cursor-pointer border-2 border-gray-500'>Filter 
  <Logo name='filter' iconSize={20} className='text-gray-600 font-bold' containerClass='flex-end mt-auto mb-1 ' style={{ color: "gray" }} />
  </Button>
  </div>
{/* table list for appointments */}
<Table>
  <TableCaption>A list of your pending and confirmed Appointments.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="">Doctor</TableHead>
      {/* Hide "Specifications" column on mobile devices */}
      <TableHead className="hidden sm:table-cell">Specifications</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Time</TableHead>
      <TableHead className="text-right">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {tableData.map((row, index) => (
      <TableRow key={index}>
        <TableCell className="font-medium space-x-2 flex flex-col truncate " colSpan={2}>
          <Image
            src={row.profilePic}
            alt={row.doctor}
            width={50}
            height={50}
            className="rounded-full w-9 h-9"
          />
          <span className="text-xs text-gray-600 truncate">{row.doctor}</span>
        </TableCell>
        {/* Use 'truncate' to add ellipsis when text overflows */}
        <TableCell className="truncate hidden sm:table-cell">{row.specifications}</TableCell>
        <TableCell>{row.date}</TableCell>
        <TableCell>{row.time}</TableCell>
        <TableCell className="text-right">
          <Button variant="secondary">{row.status}</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

</div>

{/* seducle container  */}
<div className='flex flex-col w-full lg:w-[30%]'>
<div className='flex flex-col w-full  '>
  <CustomCalendar Data={eventsData}/>
  <div className='flex flex-col w-full h-96 mt-4 shadow-black shadow-sm space-y-3 overflow-y-auto py-2 px-2 scrollbar-hide'>

  {eventsData.map((event, index) => (
    <div key={index} className='bg-event border-sidebar-border border-2 borders-solid text-white font-bold text-lg p-2 rounded-lg shadow-lg flex flex-row justify-around space-x-2'>
      <h2 className='font-semibold text-xl text-white py-auto  flex items-center'>
        <sup className='text-xl font-bold text-gray-300 uppercase opacity-40'>
          {new Date(event.date).toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}
        </sup>
        {new Date(event.date).getDate()}
      </h2>
      <span className='text-white'>
        <h3 className='capitalize text-xl font-bold'>{event.title}</h3>
        <span className='flex flex-row text-xs space-x-2'>
          <p>{event.description}</p>
        </span>
      </span>
      <Logo name='rightarrow' iconSize={40} className='text-white font-bold' containerClass='flex-end my-auto cursor-pointer' style={{ color: "white" }} />
    </div>
  ))}
  </div>
  </div>

  <div className='hidden'>
<h2 className='font-bold text-lg '>Seducle</h2>
<div>
<Calendar
      mode="single"
      Data={eventsData}
      className="rounded-md border shadow hidden"
    />
    </div>
</div>
</div>
</div>
</div>
</div>

  
  );









};

export default Dashboard;