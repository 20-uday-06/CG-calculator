import React, { useState, useMemo } from 'react';
import { Plus, GraduationCap, Calculator, RefreshCcw, Save, Target, ArrowRight } from 'lucide-react';

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
  const [desiredCgpa, setDesiredCgpa] = useState<string>('');
  const [nextSemCredits, setNextSemCredits] = useState<string>('19');

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

  // Target Calculator Logic (Next Semester)
  const requiredNextSemSgpa = useMemo(() => {
    if (!desiredCgpa || !nextSemCredits) return null;
    const target = parseFloat(desiredCgpa);
    const creditsNext = parseFloat(nextSemCredits);

    if (isNaN(target) || isNaN(creditsNext) || creditsNext === 0) return null;

    // Current status (History + Current Sem)
    const currentTotalPoints = overallStats.cgpa * overallStats.totalCredits;
    const totalCreditsSoFar = overallStats.totalCredits;

    // Future status
    const futureTotalCredits = totalCreditsSoFar + creditsNext;
    const targetTotalPoints = target * futureTotalCredits;

    // Calculation
    const pointsNeededNextSem = targetTotalPoints - currentTotalPoints;
    const reqSgpa = pointsNeededNextSem / creditsNext;
    
    return reqSgpa;
  }, [desiredCgpa, nextSemCredits, overallStats]);

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
        setDesiredCgpa('');
        setNextSemCredits('19');
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
        
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={handleReset}
                className="flex flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-surface hover:bg-slate-700 rounded-lg transition-all border border-slate-700"
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
          </div>

          {/* Target Calculator (Future) */}
          <div className="bg-surface/30 backdrop-blur border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Target size={48} />
            </div>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Target size={14} />
                Future Goal Planner
            </h3>

            <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1.5 ml-1">Target CGPA</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            placeholder="9.0"
                            value={desiredCgpa}
                            onChange={(e) => setDesiredCgpa(e.target.value)}
                            className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all font-mono"
                        />
                    </div>
                     <div>
                        <label className="block text-xs text-slate-500 mb-1.5 ml-1">Next Sem Credits</label>
                        <input
                            type="number"
                            step="0.5"
                            min="1"
                            value={nextSemCredits}
                            onChange={(e) => setNextSemCredits(e.target.value)}
                            className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all font-mono"
                        />
                    </div>
                </div>

                {requiredNextSemSgpa !== null && (
                    <div className={`p-4 rounded-xl border ${requiredNextSemSgpa > 10 ? 'bg-rose-500/10 border-rose-500/20' : requiredNextSemSgpa <= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                        <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                             Required SGPA (Next Sem) <ArrowRight size={10} />
                        </div>
                        <div className={`text-2xl font-bold font-mono ${requiredNextSemSgpa > 10 ? 'text-rose-400' : requiredNextSemSgpa <= 0 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {requiredNextSemSgpa > 10 ? 'Impossible' : requiredNextSemSgpa <= 0 ? 'Secured!' : requiredNextSemSgpa.toFixed(2)}
                        </div>
                        {requiredNextSemSgpa > 10 && <div className="text-[10px] text-rose-400 mt-1">Target exceeds maximum possible GPA (10.0)</div>}
                        {requiredNextSemSgpa > 0 && requiredNextSemSgpa <= 10 && <div className="text-[10px] text-slate-500 mt-1">Based on next semester credits ({nextSemCredits})</div>}
                    </div>
                )}
                
                {(!desiredCgpa) && (
                     <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                        <p className="text-[10px] text-indigo-300 leading-relaxed">
                            Set a target CGPA to see what SGPA you need in the <strong>next semester</strong> to achieve it.
                        </p>
                    </div>
                )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;