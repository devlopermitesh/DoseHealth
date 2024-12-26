import { CartesianGrid, Line, LineChart, XAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

// Custom LineChart Component
interface CustomLineChartProps {
  data: Array<{ [key: string]: any }>
  xAxisKey: string
  lineKey: string
  reportName: string
  period: string
  result: string
  resultStatus: string
  description: string
  trendPercentage: number
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
  return (
    <Card>
    <CardHeader>
      <CardTitle className="text-lg flex flex-row items-center justify-between">
        {reportName}
        <span className="flex flex-row space-x-4 flex-wrap">
          <span className='flex flex-row flex-wrap bg-sky-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[7.5px] rounded-lg border border-black max-w-full sm:max-w-24 font-semibold text-sm text-center py-auto'>
            78.0%
          </span>
          <span className='flex flex-row flex-wrap bg-gray-400/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[7.5px] rounded-md border border-black max-w-full sm:max-w-24 font-semibold text-sm py-auto px-2 py-1 text-center'>
            Average
          </span>
        </span>
      </CardTitle>
      <CardDescription>{period}</CardDescription>
    </CardHeader>
    
    <CardContent>
      <div className="w-full sm:w-[500px]">
        <LineChart
          data={data}
          margin={{ left: 12, right: 12 }}
          style={{ width: '100%' }}  // Use the style attribute and a CSS unit/ Make the chart width responsive
          
          height={300}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            dataKey={lineKey}
            type="linear"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </div>
    </CardContent>
  </Card>
  
  )
}

// Custom Tooltip Component
function CustomTooltip() {
  return (
    <div className="bg-white p-2 shadow-md rounded">
      <p className="text-sm font-medium">Tooltip content</p>
    </div>
  )
}
