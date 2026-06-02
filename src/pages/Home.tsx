export function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500 pb-12">
      <div className="w-full max-w-4xl bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden rounded-[2rem] border-2 border-slate-200 border-b-[12px] border-b-slate-300 p-3 transform transition-all duration-500 hover:-translate-y-2">
        {/* Placeholder banner image per request */}
        <div className="relative aspect-[21/9] w-full bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden group [perspective:1200px]">
          <img 
            src="/home.png" 
            alt="Home Banner" 
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:[transform:rotateX(4deg)_rotateY(-4deg)]"
            onError={(e) => {
              // Fallback to a placeholder gradient if home.png doesn't exist
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center"><h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight px-4 text-center">Welcome to IELTS REMI</h1></div>';
            }}
          />
        </div>
      </div>

      <div className="text-center max-w-3xl px-4 mt-8">
        <div className="inline-block bg-blue-50 border-2 border-blue-200 border-b-[6px] px-6 py-3 rounded-2xl shadow-sm mb-6 transform rotate-1 hover:-rotate-1 transition-transform">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900">Master Your Exam Preparation</h2>
        </div>
        <div className="bg-white border-2 border-slate-200 border-b-[8px] p-6 sm:p-8 rounded-3xl shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
          <p className="text-slate-600 leading-relaxed text-lg sm:text-xl font-medium">
            Access daily material, strictly monitored practice tests, and track your performance over time.
            Navigate through the menu to explore IELTS Tests, preparation resources, and latest results.
          </p>
        </div>
      </div>
    </div>
  );
}
