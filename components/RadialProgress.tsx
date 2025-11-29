import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RadialProgressProps {
  value: number;
  max: number;
  label: string;
  subLabel: string;
  color: string;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({ value, max, label, subLabel, color }) => {
  const data = [{ name: 'score', value: value, fill: color }];

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={15} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, max]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: '#334155' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[10%] text-center">
        <div className={`text-4xl font-bold ${color.replace('fill-', 'text-')}`}>
          {value.toFixed(2)}
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">
          {label}
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          {subLabel}
        </div>
      </div>
    </div>
  );
};