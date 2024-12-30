import { CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Custom LineChart Component
interface CustomLineChartProps {
  data: Array<{ [key: string]: any }>;  // Data format can be any (e.g., { date: '2023-01-01', value: 75 })
  xAxisKey: string;                     // Key to be used for the x-axis (e.g., 'date')
  lineKey: string;                      // Key for the line chart data (e.g., 'value')
  reportName: string;                   // Report name (e.g., "Blood Pressure")
  period: string;                       // Period (e.g., "January 2023")
  result: string;                       // Result (e.g., '120/80')
  resultStatus: string;                 // Status of the result (e.g., 'Normal', 'High')
  description: string;                  // Description of the chart (e.g., "Blood pressure trends")
  trendPercentage: number;              // Trend percentage (e.g., 5% increase)
}

export function CustomLineChart({
  data,
  xAxisKey,
  lineKey,
  reportName,
  period,
  result,
  resultStatus,
  description,
  trendPercentage,
}: CustomLineChartProps) {
  console.log("data",data)
  console.log("XAXISKEY",xAxisKey)
  console.log("LINEKEY",lineKey)
  return (

    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          {reportName}
          <span className="flex space-x-4">
            <span className='flex bg-sky-300 text-white font-semibold py-1 px-2 rounded-md'>
              {trendPercentage}% {trendPercentage > 0 ? 'Increase' : 'Decrease'}
            </span>
            <span className='flex bg-gray-400/30 text-sm py-1 px-2 rounded-md'>
              Average: {result}
            </span>
          </span>
        </CardTitle>
        <CardDescription>{period}</CardDescription>
      </CardHeader>
      
      <CardContent>
      <ResponsiveContainer width="100%" height={300}>       
           <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
            // style={{ width: '100%' }}  // Makes the chart responsive
            // height={300}
          >
            <CartesianGrid strokeDasharray="3 3" />
          <XAxis
              dataKey="date"  // Ensure this matches the key in your data
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Ensure the value is treated as a Date object correctly
                const date = new Date(value);
                
                // Check if the value is a valid date
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                
                return value; // Fallback if value is not a valid date
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Line
                type="monotone"
                dataKey="value"
                stroke="#87CEEB"
                strokeWidth={2}
                dot={false}
              />
          </LineChart>
          </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Custom Tooltip Component
function CustomTooltip({ payload }: any) {
  if (payload && payload.length) {
    const { value, name } = payload[0];
    return (
      <div className="bg-event text-white p-2 shadow-md rounded">
        <p className="text-sm font-medium">Date: {name}</p>
        <p className="text-sm">Value: {value}</p>
      </div>
    );
  }
  return null;
}
