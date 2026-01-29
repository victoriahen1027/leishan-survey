
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  q5_hasExp: string;
  q6_expDetail: string;
  q7_knowVictor: string;
  q8_victorDetail: string;
  q9_acceptWork: string;
  q10_wishes: string;
}

interface AnalysisResult {
  perQuestionInsight: { id: number; title: string; insight: string }[];
  studentPersona: string;
  courseStrategy: string;
}

// --- Survey Component ---
const SurveyForm: React.FC<{ onSave: (d: SurveyData) => void }> = ({ onSave }) => {
  const [form, setForm] = useState<Partial<SurveyData>>({
    gender: '女', hasIDA: '沒有', q5_hasExp: '沒有', q7_knowVictor: '不認識也沒聽過', q9_acceptWork: '可以'
  });
  const [finished, setFinished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...form, id: Date.now().toString(), timestamp: new Date().toISOString() } as SurveyData;
    onSave(finalData);
    setFinished(true);
    window.scrollTo(0, 0);
  };

  if (finished) return (
    <div className="max-w-xl mx-auto glass-card p-20 rounded-[4rem] text-center mt-24 animate-in fade-in zoom-in duration-1000">
      <div className="text-7xl mb-8">✨</div>
      <h2 className="text-4xl font-black rainbow-text mb-6 italic">Success!</h2>
      <p className="text-slate-500 font-medium leading-relaxed">您的品味已傳達至維多老師的手中。<br/>這是一場品牌饗宴的開始。</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-16 py-12 pb-40">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-black text-white tracking-widest drop-shadow-2xl">BRANDING</h1>
        <p className="text-white/40 tracking-[0.8em] text-[10px] font-bold uppercase">維多品牌學｜學員深度專訪</p>
      </div>

      {/* Section 1: Base */}
      <div className="glass-card p-12 rounded-[3.5rem] space-y-10">
        <div className="flex items-center space-x-4 border-l-4 border-pink-500 pl-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800">基本背景</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Base Information</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <input required placeholder="姓名" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="number" placeholder="年齡" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, age: e.target.value})} />
          <select className="w-full p-5 rounded-2xl font-bold bg-slate-50 border border-slate-100" onChange={e => setForm({...form, gender: e.target.value})}>
            <option>女</option><option>男</option>
          </select>
          <input required placeholder="職稱" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, jobTitle: e.target.value})} />
          <input required placeholder="進入磊山年份" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all col-span-2" onChange={e => setForm({...form, joinYear: e.target.value})} />
          <select className="w-full p-5 rounded-2xl font-bold bg-slate-50 border border-slate-100 col-span-2" onChange={e => setForm({...form, hasIDA: e.target.value})}>
            <option value="沒有">有無 IDA 資格：沒有</option><option value="有">有無 IDA 資格：有</option>
          </select>
        </div>
      </div>

      {/* Section 2: Deep Questions */}
      <div className="glass-card p-12 rounded-[3.5rem] space-y-12">
        <div className="flex items-center space-x-4 border-l-4 border-cyan-400 pl-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800">品牌靈魂調查</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Brand Insights</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <label className="block font-black text-slate-700">1. 你認為什麼是【品牌】？<span className="text-xs text-slate-400 ml-2">(勿問AI)</span></label>
            <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q1_brandDefinition: e.target.value})} />
          </div>

          <div className="space-y-4">
            <label className="block font-black text-slate-700">2. 你個人最喜歡的【品牌】是哪一個？</label>
            <input required placeholder="不限產業" className="w-full p-6 rounded-3xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q2_favoriteBrand: e.target.value})} />
          </div>

          <div className="space-y-4">
            <label className="block font-black text-slate-700">3. 為什麼喜歡？<span className="text-xs text-purple-500 ml-2 font-black italic">至少 3 點原因</span></label>
            <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q3_whyFavorite: e.target.value})} />
          </div>

          <div className="space-y-4">
            <label className="block font-black text-slate-700">4. 你希望從課堂中獲得那些知識？</label>
            <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q4_knowledgeExpectation: e.target.value})} />
          </div>

          <div className="space-y-4">
            <label className="block font-black text-slate-700">5. 曾經執行過品牌相關活動或文案嗎？</label>
            <div className="flex space-x-12 pt-2">
              {['有', '沒有'].map(o => (
                <label key={o} className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" checked={form.q5_hasExp === o} onChange={() => setForm({...form, q5_hasExp: o})} className="w-5 h-5 accent-slate-900" />
                  <span className="font-bold text-slate-600">{o}</span>
                </label>
              ))}
            </div>
          </div>

          {form.q5_hasExp === '有' && (
            <div className="space-y-4 animate-in slide-in-from-top-4">
              <label className="block font-black text-slate-700 italic border-l-2 border-slate-900 pl-4">6. 承上題，請寫出成效：</label>
              <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q6_expDetail: e.target.value})} />
            </div>
          )}

          <div className="space-y-4">
            <label className="block font-black text-slate-700">7. 你認識這次的授課講師「維多」嗎？</label>
            <select className="w-full p-6 rounded-3xl font-black bg-slate-50 border border-slate-100" onChange={e => setForm({...form, q7_knowVictor: e.target.value})}>
              <option>認識，有接觸過</option>
              <option>有聽說過，但沒接觸過</option>
              <option>不認識也沒聽過</option>
            </select>
          </div>

          {form.q7_knowVictor !== '不認識也沒聽過' && (
            <div className="space-y-4 animate-in slide-in-from-top-4">
              <label className="block font-black text-slate-700 italic border-l-2 border-slate-900 pl-4">8. 對維多的了解：</label>
              <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q8_victorDetail: e.target.value})} />
            </div>
          )}

          <div className="space-y-4">
            <label className="block font-black text-slate-700">9. 接受課程中有小組討論及作業嗎？</label>
            <div className="flex space-x-12 pt-2">
              {['可以', '不可以'].map(o => (
                <label key={o} className="flex items-center space-x-3 cursor-pointer">
                  <input type="radio" checked={form.q9_acceptWork === o} onChange={() => setForm({...form, q9_acceptWork: o})} className="w-5 h-5 accent-slate-900" />
                  <span className="font-bold text-slate-600">{o}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block font-black text-slate-700">10. 有沒有想對講師許的願？</label>
            <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q10_wishes: e.target.value})} placeholder="告訴維多老師你最想學到的祕技..." />
          </div>
        </div>

        <button type="submit" className="w-full py-8 rounded-full bg-slate-900 text-white font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95 group relative overflow-hidden">
          <span className="relative z-10">傳遞品味專訪</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>
    </form>
  );
};

// --- Admin Component ---
const AdminPanel: React.FC<{ data: SurveyData[] }> = ({ data }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `妳是頂級品牌專家，幫講師維多分析學員資料：${JSON.stringify(data)}。請產出 JSON：包含 perQuestionInsight (id, title, insight), studentPersona, courseStrategy。繁體中文回答。`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perQuestionInsight: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, title: { type: Type.STRING }, insight: { type: Type.STRING } } } },
              studentPersona: { type: Type.STRING },
              courseStrategy: { type: Type.STRING }
            }
          }
        }
      });
      setAnalysis(JSON.parse(response.text.trim()));
    } catch (e) { alert('AI 分析失敗，請確認 Vercel 中的 API_KEY 設定。'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-12">
      <div className="flex justify-between items-center px-6">
        <div>
          <h2 className="text-4xl font-black text-white italic">Master Dashboard</h2>
          <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase mt-2">維多品牌決策中心</p>
        </div>
        <button onClick={startAnalysis} disabled={loading || data.length === 0} className="px-12 py-5 bg-white text-slate-900 rounded-full font-black hover:scale-105 transition-all shadow-2xl disabled:opacity-50">
          {loading ? 'AI 專家深度解構中...' : '生成學員品牌報告'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-10 animate-in fade-in duration-1000">
          <div className="glass-card p-12 rounded-[4rem] border-2 border-purple-500/20">
            <h3 className="text-3xl font-black mb-8 rainbow-text italic">最終課程準備建議</h3>
            <p className="text-slate-700 leading-loose text-xl font-medium whitespace-pre-wrap">{analysis.courseStrategy}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-[3rem]">
              <h4 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-6">學員畫像</h4>
              <p className="text-slate-600 font-bold leading-relaxed">{analysis.studentPersona}</p>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {analysis.perQuestionInsight.map(q => (
                <div key={q.id} className="glass-card p-10 rounded-[2.5rem] border-l-8 border-slate-900">
                  <p className="font-black text-slate-800 mb-4 text-lg">{q.title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{q.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-[3.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <tr><th className="px-10 py-6">Name</th><th className="px-10 py-6">Title</th><th className="px-10 py-6">Fav Brand</th><th className="px-10 py-6">Date</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors font-bold text-slate-700">
                <td className="px-10 py-8">{s.name}</td><td className="px-10 py-8">{s.jobTitle}</td><td className="px-10 py-8 text-purple-600">{s.q2_favoriteBrand}</td><td className="px-10 py-8 text-slate-300 text-xs">{new Date(s.timestamp).toLocaleDateString()}</td>
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
  const [data, setData] = useState<SurveyData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('victor_survey_db');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const handleSave = (d: SurveyData) => {
    const next = [d, ...data];
    setData(next);
    localStorage.setItem('victor_survey_db', JSON.stringify(next));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <nav className="p-8 px-12 flex justify-between items-center bg-black/20 backdrop-blur-3xl sticky top-0 z-50 border-b border-white/5">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter">
            VICTOR<span className="rainbow-text font-light tracking-widest ml-3">BRANDING</span>
          </Link>
          <div className="flex space-x-12">
            <Link to="/" className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors">Survey</Link>
            <Link to="/admin" className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-colors">Admin</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<SurveyForm onSave={handleSave} />} />
          <Route path="/admin" element={<AdminPanel data={data} />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
