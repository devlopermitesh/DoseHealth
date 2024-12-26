import React, { useState } from "react";
import { Button } from "../ui/button";
import Logo from "./Logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TimepickerProps {
  updateTime: string[];
  onSave: (formattedSlot: string) => void;
}

const Timepicker: React.FC<TimepickerProps> = ({ updateTime,onSave }) => {
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const handleSave = () => {
    if (startTime && endTime) {
      const formattedSlot = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      onSave(formattedSlot);
     console.log(updateTime) 
    }
  };

  return (
  <>
      <div>
        <label
          htmlFor="start-time"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          From Time:
        </label>
        <input
          type="time"
          id="start-time"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          value={startTime}
          onChange={handleStartTimeChange}
          required
        />
      </div>
      <div>
        <label
          htmlFor="end-time"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          To Time:
        </label>
        <input
          type="time"
          id="end-time"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          value={endTime}
          onChange={handleEndTimeChange}
          required
        />
      </div>
      <TooltipProvider>
      <Tooltip>
      <TooltipTrigger asChild>
      <Button onClick={handleSave}  type="button" variant="default" className="ml-2 mt-auto hover:bg-purple-500">
                          <Logo name="plusclock" className="w-3 h-3 " containerClass="hover:text-white" style={{ color: "white" }} iconSize={19} />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                        <p className="text-gray-600 mb-2">This button will add a time slot for your availability</p>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border-b">Start Time</th>
                <th className="px-4 py-2 border-b">End Time</th>
              </tr>
            </thead>
            <tbody>
              {updateTime.map((time, index) => {
                const [start, end] = time.split("-").map((t) => t.trim());
                return (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border-b text-gray-700">{start}</td>
                    <td className="px-4 py-2 border-b text-gray-700">{end}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TooltipContent>
    </Tooltip>
    </TooltipProvider>
                        </>
  );
};

export default Timepicker;
