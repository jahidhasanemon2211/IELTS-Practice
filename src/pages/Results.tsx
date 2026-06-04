import { useEffect, useState } from 'react';
import { Trophy, CalendarDays, User, Hash } from 'lucide-react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Result } from '../types';

export function Results() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, 'results'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result));
        setResults(data);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 pb-5">
        <div className="inline-block bg-white border-2 border-slate-200 border-b-[6px] px-6 py-4 rounded-2xl shadow-sm mb-4 transform rotate-1 hover:rotate-0 transition-transform">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Test Results</h1>
        </div>
        <p className="text-slate-500 mt-2 font-medium text-lg ml-2">Latest scores and ranks from recent tests.</p>
      </div>

      <div className="bg-white border-2 border-slate-200 border-b-[12px] border-b-slate-300 shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:-translate-y-1">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No results published</h3>
            <p className="text-slate-500 mt-1">Please check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600 uppercase tracking-wider">
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-2"><User size={16}/> Student</span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-2"><Hash size={16}/> Test Name</span>
                  </th>
                  <th className="px-6 py-4">
                    <span className="flex items-center gap-2"><CalendarDays size={16}/> Date</span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="flex items-center justify-end gap-2"><Trophy size={16}/> Band/Score</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-blue-50/50 transition-colors group relative">
                    <td className="px-6 py-5 font-bold text-slate-900 text-lg group-hover:scale-105 origin-left transition-transform">
                      {result.studentName}
                    </td>
                    <td className="px-6 py-5 text-slate-600 font-bold">
                      {result.testName}
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-mono font-bold text-sm">
                      {new Date(result.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-500 text-white border-b-4 border-blue-700 font-extrabold tracking-tight shadow-sm transform group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                        {result.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
