import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UploadCloud, Trophy, CheckCircle2, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { cn } from '../lib/utils';

type Tab = 'ielts' | 'next-prep' | 'result';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('ielts');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Logout on mount if no token
  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- File Upload Form (IELTS / Next Prep) ---
  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const thumbnailFile = formData.get('thumbnail') as File;
    const pdfFile = formData.get('pdf') as File;
    
    try {
      let thumbnailUrl = '';
      let pdfUrl = '';

      if (thumbnailFile && thumbnailFile.name) {
        const thumbRef = ref(storage, `thumbnails/${Date.now()}-${thumbnailFile.name}`);
        await uploadBytes(thumbRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbRef);
      }

      if (pdfFile && pdfFile.name) {
        const pdfRef = ref(storage, `pdfs/${Date.now()}-${pdfFile.name}`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }

      const newTest = {
        title,
        type: activeTab,
        thumbnailUrl,
        pdfUrl,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'tests'), newTest);
      
      showSuccess(`Successfully uploaded to ${activeTab === 'ielts' ? 'IELTS Test' : 'Next Test Prep'}`);
      form.reset();
    } catch (err: any) {
      console.error(err);
      alert('Error uploading to Firebase: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Result Form ---
  const handleResultSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const newResult = {
        testName: formData.get('testName'),
        date: formData.get('date'),
        studentName: formData.get('studentName'),
        score: formData.get('score'),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'results'), newResult);
      
      showSuccess('Result successfully published!');
      form.reset();
    } catch (err: any) {
      console.error(err);
      alert('Error saving result: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage content, uploads, and publish student results.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 border-b-[6px] text-slate-700 hover:text-red-600 hover:border-red-200 hover:-translate-y-1 px-5 py-2.5 rounded-xl font-bold active:border-b-2 active:translate-y-[4px] transition-all shadow-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-slate-200 border-b-[12px] border-b-slate-300 overflow-hidden min-h-[500px]">
        {/* Custom Tabs */}
        <div className="flex border-b-2 border-slate-200 overflow-x-auto hide-scrollbar bg-slate-50 font-bold">
          <button
            onClick={() => setActiveTab('ielts')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2",
              activeTab === 'ielts' ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <UploadCloud size={18} /> IELTS Test PDF
          </button>
          <button
            onClick={() => setActiveTab('next-prep')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2",
              activeTab === 'next-prep' ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <UploadCloud size={18} /> Next Prep PDF
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2",
              activeTab === 'result' ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Trophy size={18} /> Update Result
          </button>
        </div>

        <div className="p-6 sm:p-10 relative">
          
          {successMsg && (
            <div className="absolute top-6 left-6 right-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
              <CheckCircle2 className="text-green-600" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          <div className={cn("max-w-2xl mx-auto transition-all", successMsg ? "mt-16" : "mt-0")}>
            
            {/* File Upload Variant Form */}
            {(activeTab === 'ielts' || activeTab === 'next-prep') && (
              <form onSubmit={handleFileUpload} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Upload to {activeTab === 'ielts' ? 'IELTS Test' : 'Next Test Preparation'}
                  </h2>
                  <p className="text-slate-500 text-sm">Fill all fields to broadcast this item immediately.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="title">
                      Title / Reference
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. Daily Listening Practice - Jan 14"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 border-t-4 border-t-slate-200/50 shadow-inner rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="thumbnail">
                      Thumbnail Image (JPG/PNG)
                    </label>
                    <input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors text-sm text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="pdf">
                      PDF Document
                    </label>
                    <input
                      id="pdf"
                      name="pdf"
                      type="file"
                      accept="application/pdf"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-colors text-sm text-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all shadow-lg disabled:opacity-70 mt-6"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                  <span>{loading ? 'Uploading...' : 'Publish Content'}</span>
                </button>
              </form>
            )}

            {/* Results Variant Form */}
            {activeTab === 'result' && (
              <form onSubmit={handleResultSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Publish Student Result
                  </h2>
                  <p className="text-slate-500 text-sm">Updates will reflect live on the Viewer Interface.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="testName">
                      Test Name / ID
                    </label>
                    <input
                      id="testName"
                      name="testName"
                      type="text"
                      required
                      placeholder="e.g. Mock Test Alpha"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="date">
                      Test Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="studentName">
                      Student Name / Roll
                    </label>
                    <input
                      id="studentName"
                      name="studentName"
                      type="text"
                      required
                      placeholder="e.g. John Doe (001)"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="score">
                      Marks / Band Score
                    </label>
                    <input
                      id="score"
                      name="score"
                      type="text"
                      required
                      placeholder="e.g. 7.5 Band"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-semibold py-4 rounded-xl border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition-all shadow-lg disabled:opacity-70 mt-6"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Trophy />}
                  <span>{loading ? 'Publishing...' : 'Publish Result'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
