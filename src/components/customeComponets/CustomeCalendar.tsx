import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataObject {
    date: string;
    title: string;
    description: string;
    highlight: boolean;
}

interface CustomCalendarProps {
    Data: DataObject[];
}

export const CustomCalendar: React.FC<CustomCalendarProps> = ({ Data }) => {
    const [firstDate, setFirstDate] = useState<Date>(new Date());
    const [lastDate, setLastDate] = useState<Date>(new Date());
    const [monthName, setMonthName] = useState<string>('');
    const [daysDateData, setDaysDateData] = useState<{
        index: number;
        date: Date;
        day: string;
        description?: string;
        highlight?: boolean;
    }[]>([]);

    // Get the first and last dates for the current week
    const getWeekDates = (startDate: Date) => {
        const firstDay = startDate;
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        return { firstDay, lastDay };
    };

    // Get the week data with the days
    const generateWeekData = (startDate: Date) => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const matchingData = Data.find((item) => 
                new Date(item.date).toDateString() === date.toDateString()
            );
            return {
                index: i,
                date,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                description: matchingData?.description,
                highlight: matchingData?.highlight
            };
        });
    };

    // Handle left click (subtract 7 days)
    const handleLeftClick = () => {
        const newFirstDate = new Date(firstDate);
        newFirstDate.setDate(newFirstDate.getDate() - 7);
        const { firstDay, lastDay } = getWeekDates(newFirstDate);
        setFirstDate(firstDay);
        setLastDate(lastDay);
        setDaysDateData(generateWeekData(firstDay));
        setMonthName(firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    };

    // Handle right click (add 7 days)
    const handleRightClick = () => {
        const newFirstDate = new Date(firstDate);
        newFirstDate.setDate(newFirstDate.getDate() + 7);
        const { firstDay, lastDay } = getWeekDates(newFirstDate);
        setFirstDate(firstDay);
        setLastDate(lastDay);
        setDaysDateData(generateWeekData(firstDay));
        setMonthName(firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    };

    // Initialize calendar when data is received
    useEffect(() => {
        if (Data && Data.length > 0) {
            const initialDate = new Date(Data[0].date);
            const { firstDay, lastDay } = getWeekDates(initialDate);
            setFirstDate(firstDay);
            setLastDate(lastDay);
            setDaysDateData(generateWeekData(firstDay));
            setMonthName(firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
        }
    }, [Data]);

    return (
        <div className="flex flex-col bg-sidebar">
            <h2 className='font-bold text-lg '>Seducle</h2>
            <div className="flex flex-col rounded shadow-sm shadow-gray-100">
                <div className="flex flex-row justify-between p-2">
                    <ChevronLeft className="w-5 h-5 cursor-pointer" onClick={handleLeftClick} />
                    <h4 className="text-lg font-semibold">{monthName}</h4>
                    <ChevronRight className="w-5 h-5 cursor-pointer" onClick={handleRightClick} />
                </div>

                {/* Days of the week */}
                <table className="w-full border-collapse space-y-1  table-auto sm:table-auto md:table-auto lg:table-fixed">
                    <thead>
                        <tr className="w-full">
                            {daysDateData.map((item, index) => (
                                <th
                                    key={index}
                                    className="text-muted-foreground rounded-md w-16 lg:w-9 font-normal text-[0.8rem] text-center"
                                >
                                    {item.day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="w-full mt-2 py-2">
                            {daysDateData.map((item, index) => (
                                <td
                                    key={index}
                                    className={`h-9 w-16 lg:w-9 text-center text-sm p-0 relative font-semibold 
                                    ${item.highlight ? 'bg-sky-600 text-white rounded-full' : 'text-gray-400'}`}
                                >
                                    <button
                                        className="h-9 w-9 p-0 font-normal"
                                        title={item.description || ''}
                                    >
                                        {item.date.getDate()}
                                    </button>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
};
