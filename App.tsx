
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import AdminDashboard from './components/AdminDashboard';
import { SurveyData } from './types';

const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<SurveyData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vbrand_responses');
    if (saved) setSubmissions(JSON.parse(saved));
  }, []);

  const handleAddSubmission = (data: SurveyData) => {
    const newList = [data, ...submissions];
    setSubmissions(newList);
    localStorage.setItem('vbrand_responses', JSON.stringify(newList));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <nav className="p-6 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter">
            VICTOR<span className="rainbow-text">BRAND</span>
          </Link>
          <Link to="/admin" className="text-white/60 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase">
            Admin Dashboard
          </Link>
        </nav>
        <main className="flex-grow container mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={<SurveyForm onSubmit={handleAddSubmission} />} />
            <Route path="/admin" element={<AdminDashboard submissions={submissions} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
