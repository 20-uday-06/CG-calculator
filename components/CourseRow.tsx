import React from 'react';
import { Trash2 } from 'lucide-react';
import { Course, GradeOption } from '../types';
import { GRADE_OPTIONS } from '../constants';

interface CourseRowProps {
  course: Course;
  index: number;
  onUpdate: (id: string, field: keyof Course, value: any) => void;
  onDelete: (id: string) => void;
}

export const CourseRow: React.FC<CourseRowProps> = ({ course, index, onUpdate, onDelete }) => {
  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-surface/50 hover:bg-surface border border-slate-700/50 hover:border-indigo-500/30 rounded-xl transition-all duration-300 mb-3 relative overflow-hidden">
      
      {/* Index Number Badge */}
      <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
        {index + 1}
      </div>

      {/* Inputs Section */}
      <div className="flex-1 grid grid-cols-12 gap-3 w-full">
        
        {/* Course Code */}
        <div className="col-span-3 md:col-span-2">
          <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block md:hidden">Code</label>
          <input
            type="text"
            value={course.code}
            onChange={(e) => onUpdate(course.id, 'code', e.target.value)}
            className="w-full bg-transparent text-slate-300 font-mono text-sm border-b border-transparent focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors"
            placeholder="CODE"
          />
        </div>

        {/* Course Name */}
        <div className="col-span-9 md:col-span-5">
           <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block md:hidden">Course Name</label>
          <input
            type="text"
            value={course.name}
            onChange={(e) => onUpdate(course.id, 'name', e.target.value)}
            className="w-full bg-transparent text-white font-medium text-sm border-b border-transparent focus:border-indigo-500 focus:outline-none placeholder-slate-600 transition-colors"
            placeholder="Course Name"
          />
        </div>

        {/* Credits */}
        <div className="col-span-4 md:col-span-2">
          <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block md:hidden">Credits</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="20"
              value={course.credits}
              onChange={(e) => onUpdate(course.id, 'credits', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900/50 text-center text-indigo-300 font-bold text-sm py-2 rounded-md border border-slate-700 focus:border-indigo-500 focus:outline-none transition-all"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 pointer-events-none">CR</span>
          </div>
        </div>

        {/* Grade Selection */}
        <div className="col-span-8 md:col-span-3">
          <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block md:hidden">Grade</label>
          <select
            value={course.gradePoint}
            onChange={(e) => onUpdate(course.id, 'gradePoint', parseFloat(e.target.value))}
            className="w-full bg-slate-900/50 text-sm py-2 px-3 rounded-md border border-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer transition-all text-slate-200"
          >
            {GRADE_OPTIONS.map((option: GradeOption) => (
              <option key={option.label} value={option.value} className="bg-slate-900 text-slate-200">
                {option.label} ({option.value})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(course.id)}
        className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
        title="Remove Course"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};