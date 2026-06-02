import { CalendarDays } from 'lucide-react';

export function Routine() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-white border-2 border-slate-200 border-b-[6px] text-blue-600 rounded-3xl mb-6 shadow-md transform hover:scale-110 hover:-rotate-6 transition-all">
          <CalendarDays size={36} />
        </div>
        <div className="mx-auto inline-block bg-white border-2 border-slate-200 border-b-[6px] px-8 py-3 rounded-2xl shadow-sm mb-4 transform -rotate-1 hover:rotate-0 transition-transform">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Class Routine</h1>
        </div>
        <p className="text-slate-500 mt-2 text-xl font-medium">Weekly schedule for IELTS classes and mock tests</p>
      </div>

      <div className="bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden rounded-3xl border-2 border-slate-200 border-b-[12px] border-b-slate-300 p-4 transform transition-all duration-500 hover:-translate-y-2">
        {/* Placeholder routine image per request */}
        <div className="relative w-full bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden min-h-[400px] group [perspective:1200px]">
          <img 
            src="/routine.png" 
            alt="Routine" 
            className="w-full h-auto object-contain transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:[transform:rotateX(3deg)_rotateY(-3deg)]"
            onError={(e) => {
              // Fallback if routine.png doesn't exist
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="text-center p-8"><div class="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4"><svg class="w-8 h-8 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></div><h3 class="text-lg font-medium text-slate-900 border-2 border-dashed border-slate-300 rounded-lg py-12 px-24">Upload routine.png to root directory</h3></div>';
            }}
          />
        </div>
      </div>
    </div>
  );
}
