import React, { useState, useMemo } from 'react';
import { Plus, GraduationCap, Calculator, RefreshCcw, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Actually, lets just use a simple counter or random string for ID since no external lib needed strictly if not requested, but I'll use simple random generator.

import { Course, SimulationState } from './types';
import { INITIAL_COURSES, INITIAL_HISTORY } from './constants';
import { CourseRow } from './components/CourseRow';
import { RadialProgress } from './components/RadialProgress';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  // State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [history, setHistory] = useState<SimulationState>(INITIAL_HISTORY);

  // Derived Calculations
  const semesterStats = useMemo(() => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const weightedPoints = courses.reduce((sum, course) => sum + (course.credits * course.gradePoint), 0);
    const sgpa = totalCredits > 0 ? weightedPoints / totalCredits : 0;
    
    return { totalCredits, sgpa };
  }, [courses]);

  const overallStats = useMemo(() => {
    const prevPoints = history.currentCgpa * history.previousTotalCredits;
    const currentPoints = semesterStats.sgpa * semesterStats.totalCredits;
    const totalCombinedCredits = history.previousTotalCredits + semesterStats.totalCredits;
    
    const cgpa = totalCombinedCredits > 0 
      ? (prevPoints + currentPoints) / totalCombinedCredits 
      : 0;

    return { totalCredits: totalCombinedCredits, cgpa };
  }, [history, semesterStats]);

  // Handlers
  const handleUpdateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: generateId(),
      code: 'NEW-101',
      name: 'New Course',
      credits: 3,
      gradePoint: 8
    };
    setCourses([...courses, newCourse]);
  };

  const handleHistoryChange = (field: keyof SimulationState, value: string) => {
    const numValue = parseFloat(value);
    setHistory(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleReset = () => {
    if(window.confirm("Reset all data to defaults?")) {
        setCourses(INITIAL_COURSES);
        setHistory(INITIAL_HISTORY);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <GraduationCap className="text-indigo-400" size={32} />
            GradePulse
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Interactive Academic Performance Calculator</p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-surface hover:bg-slate-700 rounded-lg transition-all border border-slate-700"
            >
                <RefreshCcw size={16} />
                Reset Defaults
            </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface/30 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calculator size={20} className="text-teal-400"/>
                Current Semester
              </h2>
              <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                {courses.length} Courses
              </span>
            </div>

            <div className="space-y-1">
              {/* Header Row for Desktop */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-2">Code</div>
                <div className="col-span-5">Course Name</div>
                <div className="col-span-2 text-center">Credits</div>
                <div className="col-span-3">Grade</div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {courses.map((course, index) => (
                    <CourseRow 
                        key={course.id} 
                        course={course} 
                        index={index} 
                        onUpdate={handleUpdateCourse} 
                        onDelete={handleDeleteCourse} 
                    />
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddCourse}
              className="mt-6 w-full py-3 border-2 border-dashed border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 rounded-xl flex items-center justify-center gap-2 transition-all group"
            >
              <Plus size={18} className="group-hover:scale-110 transition-transform"/>
              Add Course
            </button>
          </div>
        </div>

        {/* Right Column: Statistics & Global Inputs */}
        <div className="space-y-6">
          
          {/* Results Card */}
          <div className="bg-gradient-to-b from-surface to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <h2 className="text-lg font-semibold text-white mb-6">Performance Summary</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-1 bg-slate-900/50 rounded-xl p-2 border border-slate-800">
                    <RadialProgress 
                        value={semesterStats.sgpa} 
                        max={10} 
                        label="SGPA" 
                        subLabel="Current Sem"
                        color="#2dd4bf" // Teal 400
                    />
                </div>
                <div className="col-span-1 bg-slate-900/50 rounded-xl p-2 border border-slate-800">
                     <RadialProgress 
                        value={overallStats.cgpa} 
                        max={10} 
                        label="CGPA" 
                        subLabel="Overall"
                        color="#818cf8" // Indigo 400
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Current Sem Credits</span>
                    <span className="font-mono text-white font-bold">{semesterStats.totalCredits}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Credits Earned</span>
                    <span className="font-mono text-white font-bold">{overallStats.totalCredits}</span>
                </div>
            </div>
          </div>

          {/* Historical Data Input */}
          <div className="bg-surface/30 backdrop-blur border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Save size={14} />
                Previous Records
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Current CGPA (Before this sem)</label>
                <div className="relative">
                    <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={history.currentCgpa}
                    onChange={(e) => handleHistoryChange('currentCgpa', e.target.value)}
                    className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono"
                    />
                    <div className="absolute right-3 top-3 text-xs text-slate-600">/ 10.0</div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5 ml-1">Total Credits (Before this sem)</label>
                <div className="relative">
                    <input
                    type="number"
                    min="0"
                    value={history.previousTotalCredits}
                    onChange={(e) => handleHistoryChange('previousTotalCredits', e.target.value)}
                    className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono"
                    />
                    <div className="absolute right-3 top-3 text-xs text-slate-600">Credits</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-[10px] text-indigo-300 leading-relaxed">
                    <strong>Formula Used:</strong> <br/>
                    (Previous CGPA × Previous Credits + Current SGPA × Current Credits) / Total Credits
                </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;