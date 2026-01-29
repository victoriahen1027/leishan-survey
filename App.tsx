
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
interface SurveyData {
  id: string;
  timestamp: string;
  name: string;
  age: string;
  gender: string;
  jobTitle: string;
  joinYear: string;
  hasIDA: string;
  q1_brandDefinition: string;
  q2_favoriteBrand: string;
  q3_whyFavorite: string;
  q4_knowledgeExpectation: string;
  q5_hasCopywritingExp: string;
  q6_expDetail: string;
  q7_knowVictor: string;
  q8_victorImpression: string;
  q9_acceptWork: string;
  q10_wishes: string;
}

interface FullAnalysis {
  perQuestionAnalysis: { questionId: number; questionText: string; summary: string }[];
  overallAdvice: string;
  studentPersona: string;
}

// --- AI Service ---
const analyzeSubmissions = async (submissions: SurveyData[]): Promise<FullAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `你是一位資深品牌專家。請分析以下磊山夥伴的問卷資料，為講師「維多」生成一份課前洞察報告。
    問卷數據：${JSON.stringify(submissions)}
    請以 JSON 格式回傳：perQuestionAnalysis (陣列), studentPersona (字串), overallAdvice (字串)。`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          perQuestionAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionId: { type: Type.NUMBER },
                questionText: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ["questionId", "questionText", "summary"]
            }
          },
          studentPersona: { type: Type.STRING },
          overallAdvice: { type: Type.STRING }
        },
        required: ["perQuestionAnalysis", "studentPersona", "overallAdvice"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

// --- Components ---
const SurveyForm: React.FC<{ onSubmit: (data: SurveyData) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<SurveyData>>({
    gender: '女', hasIDA: '沒有', q5_hasCopywritingExp: '沒有', q7_knowVictor: '不認識也沒聽過', q9_acceptWork: '可以'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, id: Date.now().toString(), timestamp: new Date().toISOString() } as SurveyData;
    onSubmit(finalData);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) return (
    <div className="max-w-xl mx-auto glass-card p-16 rounded-[3.5rem] text-center mt-20">
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-4xl font-black rainbow-text mb-6">感謝填寫</h2>
      <p className="text-slate-500 font-medium">期待與您在「維多品牌學」見面。</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-12 pb-32">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-5xl font-black text-white tracking-widest uppercase">Brand Survey</h1>
        <p className="text-white/50 tracking-[0.4em] text-xs font-bold">維多品牌學｜課前調查</p>
      </div>

      <div className="glass-card p-12 rounded-[3rem] space-y-8">
        <h3 className="text-xl font-black text-slate-800 border-l-4 border-pink-500 pl-4">基本資料</h3>
        <div className="grid grid-cols-2 gap-6">
          <input required placeholder="姓名" className="p-5 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required type="number" placeholder="年齡" className="p-5 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, age: e.target.value})} />
          <select className="p-5 rounded-2xl font-bold" onChange={e => setFormData({...formData, gender: e.target.value})}>
            <option>女</option><option>男</option>
          </select>
          <input required placeholder="職稱" className="p-5 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
          <input required placeholder="進入磊山年份" className="p-5 rounded-2xl outline-none font-bold" onChange={e => setFormData({...formData, joinYear: e.target.value})} />
          <select className="p-5 rounded-2xl font-bold" onChange={e => setFormData({...formData, hasIDA: e.target.value})}>
            <option value="沒有">有無 IDA：沒有</option><option value="有">有無 IDA：有</option>
          </select>
        </div>
      </div>

      <div className="glass-card p-12 rounded-[3rem] space-y-10">
        <h3 className="text-xl font-black text-slate-800 border-l-4 border-cyan-500 pl-4">深度問答</h3>
        {[
          { label: "1. 你認為什麼是【品牌】？", name: "q1_brandDefinition", type: "textarea" },
          { label: "2. 你個人最喜歡的【品牌】是哪一個？", name: "q2_favoriteBrand", type: "input" },
          { label: "3. 為什麼喜歡？（請寫三點）", name: "q3_whyFavorite", type: "textarea" },
          { label: "4. 希望獲得哪些知識？", name: "q4_knowledgeExpectation", type: "textarea" }
        ].map(q => (
          <div key={q.name} className="space-y-3">
            <label className="block font-black text-slate-700">{q.label}</label>
            {q.type === 'textarea' ? 
              <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium transition-all" onChange={e => setFormData({...formData, [q.name]: e.target.value})} /> :
              <input required className="w-full p-6 rounded-3xl outline-none font-medium transition-all" onChange={e => setFormData({...formData, [q.name]: e.target.value})} />
            }
          </div>
        ))}
        
        <div className="space-y-4">
          <label className="block font-black text-slate-700">5. 執行過品牌相關活動嗎？</label>
          <div className="flex space-x-8">
            {['有', '沒有'].map(opt => (
              <label key={opt} className="flex items-center space-x-2 cursor-pointer font-bold text-slate-500">
                <input type="radio" name="q5" checked={formData.q5_hasCopywritingExp === opt} onChange={() => setFormData({...formData, q5_hasCopywritingExp: opt})} className="w-5 h-5 accent-slate-900" />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {formData.q5_hasCopywritingExp === '有' && (
          <div className="space-y-3">
            <label className="block font-black text-slate-700">6. 承上題，請說明成效：</label>
            <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium transition-all" onChange={e => setFormData({...formData, q6_expDetail: e.target.value})} />
          </div>
        )}

        <button type="submit" className="w-full py-8 rounded-full bg-slate-900 text-white font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
          提交精品問卷
        </button>
      </div>
    </form>
  );
};

const AdminDashboard: React.FC<{ submissions: SurveyData[] }> = ({ submissions }) => {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeSubmissions(submissions);
      setAnalysis(res);
    } catch (e) { alert('AI 分析失敗，請檢查 API Key'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-black text-white">維多大師後台</h2>
        <button onClick={runAnalysis} disabled={loading || submissions.length === 0} className="px-10 py-5 bg-white text-slate-900 rounded-full font-black hover:scale-105 transition-all shadow-xl disabled:opacity-50">
          {loading ? 'AI 深度分析中...' : '生成學員洞察報告'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-8 animate-in fade-in duration-1000">
          <div className="glass-card p-12 rounded-[3.5rem] border-2 border-purple-400/40">
            <h3 className="text-2xl font-black mb-6 rainbow-text italic">維多老師課前建議</h3>
            <p className="text-slate-700 leading-loose text-lg font-medium whitespace-pre-wrap">{analysis.overallAdvice}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {analysis.perQuestionAnalysis.map(q => (
              <div key={q.questionId} className="glass-card p-10 rounded-[2.5rem]">
                <h4 className="text-xs font-black text-purple-500 uppercase mb-3 tracking-widest">Question {q.questionId}</h4>
                <p className="font-bold text-slate-800 mb-4">{q.questionText}</p>
                <div className="text-slate-500 text-sm leading-relaxed font-medium">{q.summary}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100/50 text-slate-400 text-xs font-black tracking-widest uppercase">
            <tr><th className="p-8">姓名</th><th className="p-8">職稱</th><th className="p-8">最愛品牌</th><th className="p-8">填寫日期</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map(s => (
              <tr key={s.id} className="text-slate-700 font-bold hover:bg-slate-50/80 transition-colors">
                <td className="p-8">{s.name}</td><td className="p-8">{s.jobTitle}</td><td className="p-8">{s.q2_favoriteBrand}</td><td className="p-8 text-slate-400 text-sm">{new Date(s.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [submissions, setSubmissions] = useState<SurveyData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vbrand_data');
    if (saved) setSubmissions(JSON.parse(saved));
  }, []);

  const handleAdd = (data: SurveyData) => {
    const newList = [data, ...submissions];
    setSubmissions(newList);
    localStorage.setItem('vbrand_data', JSON.stringify(newList));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <nav className="px-10 py-8 flex justify-between items-center bg-black/20 backdrop-blur-xl sticky top-0 z-50 border-b border-white/5">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter">
            VICTOR<span className="rainbow-text font-light tracking-widest ml-2">ACADEMY</span>
          </Link>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Survey</Link>
            <Link to="/admin" className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest">Admin</Link>
          </div>
        </nav>
        <main className="flex-grow container mx-auto px-6 py-12">
          <Routes>
            <Route path="/" element={<SurveyForm onSubmit={handleAdd} />} />
            <Route path="/admin" element={<AdminDashboard submissions={submissions} />} />
          </Routes>
        </main>
        <footer className="py-10 text-center opacity-20 text-[10px] font-black tracking-[0.6em] uppercase text-white">
          © Victor Brand Design 2026
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
