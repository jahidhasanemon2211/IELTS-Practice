import { useEffect, useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import type { Test } from '../types';

interface TestsViewProps {
  type: 'ielts' | 'next-prep';
  title: string;
}

export function TestsView({ type, title }: TestsViewProps) {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tests?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setTests(data);
        setLoading(false);
        // Pre-cache PDFs and thumbnails for offline viewing
        if ('caches' in window) {
          caches.open('ielts-remi-v1').then((cache) => {
            data.forEach((test: Test) => {
              // Precache PDF
              if (test.pdfUrl) {
                cache.match(test.pdfUrl).then((cached) => {
                  if (!cached) fetch(test.pdfUrl).then(response => cache.put(test.pdfUrl, response));
                });
              }
              // Precache Thumbnail
              if (test.thumbnailUrl) {
                cache.match(test.thumbnailUrl).then((cached) => {
                  if (!cached) fetch(test.thumbnailUrl).then(response => cache.put(test.thumbnailUrl, response));
                });
              }
            });
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching tests:', err);
        setLoading(false);
      });
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading PDFs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 pb-5">
        <div className="inline-block bg-white border-2 border-slate-200 border-b-[6px] px-6 py-4 rounded-2xl shadow-sm mb-4 transform -rotate-1 hover:rotate-0 transition-transform">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        </div>
        <p className="text-slate-500 mt-2 font-medium text-lg ml-2">Browse and download daily uploaded material.</p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No content available</h3>
          <p className="text-slate-500 mt-1">Check back later for new updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-3xl border-2 border-slate-200 border-b-[10px] border-b-slate-300 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 group">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden transition-all flex items-center justify-center [perspective:1000px]">
                <img 
                  src={test.thumbnailUrl} 
                  alt={test.title}
                  className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:[transform:rotateX(6deg)_rotateY(-6deg)] group-hover:opacity-95"
                />
              </div>
              <div className="p-5 flex flex-col h-full">
                <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 mb-2">{test.title}</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-4">
                  <Calendar size={14} />
                  <span>{new Date(test.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <div className="mt-auto">
                  <a 
                    href={test.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl border-2 border-blue-700 border-b-[6px] hover:-translate-y-1 active:border-b-2 active:translate-y-1 transition-all shadow-md group/btn"
                  >
                    <Download size={18} className="group-hover/btn:-translate-y-1 group-hover/btn:scale-110 transition-transform" />
                    <span>View / Download PDF</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
