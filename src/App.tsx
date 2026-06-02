import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { TestsView } from './pages/TestsView';
import { Results } from './pages/Results';
import { Routine } from './pages/Routine';
import { AdminAuth } from './pages/AdminAuth';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ielts-test" element={<TestsView type="ielts" title="IELTS Test" />} />
            <Route path="/next-prep" element={<TestsView type="next-prep" title="Next Test Preparation" />} />
            <Route path="/results" element={<Results />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
