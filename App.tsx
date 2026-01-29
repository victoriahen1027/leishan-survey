
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

// --- 資料結構定義 ---
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

// --- 前台：精品品牌問卷 ---
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (finished) return (
    <div className="max-w-xl mx-auto glass-card p-20 rounded-[4rem] text-center mt-24 border-none shadow-2xl animate-in fade-in zoom-in duration-1000">
      <div className="text-7xl mb-8">✨</div>
      <h2 className="text-4xl font-black rainbow-text mb-6 italic">Successfully Sent</h2>
      <p className="text-slate-500 font-medium leading-relaxed">您的品味與期待已傳達。<br/>維多老師正在為您精心準備這場品牌盛宴。</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-16 py-12 pb-40 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-7xl md:text-8xl font-black text-white tracking-widest drop-shadow-2xl">BRANDING</h1>
        <p className="text-white/40 tracking-[0.8em] text-[10px] font-bold uppercase">學員課前調查｜維多品牌學</p>
      </div>

      <div className="glass-card p-10 md:p-12 rounded-[3.5rem] space-y-10 border-none shadow-2xl">
        <div className="border-l-4 border-pink-500 pl-6">
          <h3 className="text-2xl font-black text-slate-800">基本背景調查</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Base Information</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input required placeholder="姓名" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, name: e.target.value})} />
          <input required type="number" placeholder="年齡" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, age: e.target.value})} />
          <select className="w-full p-5 rounded-2xl font-bold bg-slate-50 border border-slate-100" onChange={e => setForm({...form, gender: e.target.value})}>
            <option>性別：女</option><option>性別：男</option>
          </select>
          <input required placeholder="職稱" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, jobTitle: e.target.value})} />
          <input required placeholder="進入磊山年份" className="w-full p-5 rounded-2xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all md:col-span-2" onChange={e => setForm({...form, joinYear: e.target.value})} />
          <select className="w-full p-5 rounded-2xl font-bold bg-slate-50 border border-slate-100 md:col-span-2" onChange={e => setForm({...form, hasIDA: e.target.value})}>
            <option value="沒有">有無 IDA 資格：沒有</option><option value="有">有無 IDA 資格：有</option>
          </select>
        </div>
      </div>

      <div className="glass-card p-10 md:p-12 rounded-[3.5rem] space-y-12 border-none shadow-2xl">
        <div className="border-l-4 border-cyan-400 pl-6">
          <h3 className="text-2xl font-black text-slate-800">深度品牌洞察</h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Brand Insights</p>
        </div>
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="block font-black text-slate-700">1. 你認為什麼是【品牌】？<span className="text-xs text-slate-400 ml-2">(勿問AI)</span></label>
            <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all resize-none" onChange={e => setForm({...form, q1_brandDefinition: e.target.value})} />
          </div>
          <div className="space-y-4">
            <label className="block font-black text-slate-700">2. 你個人最喜歡的【品牌】是哪一個？</label>
            <input required placeholder="不限產業" className="w-full p-6 rounded-3xl outline-none font-bold bg-slate-50 border border-slate-100 focus:bg-white transition-all" onChange={e => setForm({...form, q2_favoriteBrand: e.target.value})} />
          </div>
          <div className="space-y-4">
            <label className="block font-black text-slate-700">3. 為什麼喜歡？<span className="text-xs text-purple-500 ml-2 font-bold italic">至少 3 點原因</span></label>
            <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all resize-none" onChange={e => setForm({...form, q3_whyFavorite: e.target.value})} />
          </div>
          <div className="space-y-4">
            <label className="block font-black text-slate-700">4. 你希望從課堂中獲得那些知識？</label>
            <textarea required className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all resize-none" onChange={e => setForm({...form, q4_knowledgeExpectation: e.target.value})} />
          </div>
          <div className="space-y-4">
            <label className="block font-black text-slate-700">5. 曾經執行過品牌推廣相關活動或文案嗎？</label>
            <div className="flex space-x-12 pt-2">
              {['有', '沒有'].map(o => (
                <label key={o} className="flex items-center space-x-3 cursor-pointer group">
                  <input type="radio" checked={form.q5_hasExp === o} onChange={() => setForm({...form, q5_hasExp: o})} className="w-5 h-5 accent-slate-900" />
                  <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{o}</span>
                </label>
              ))}
            </div>
          </div>
          {form.q5_hasExp === '有' && (
            <div className="space-y-4 animate-in slide-in-from-top-4">
              <label className="block font-black text-slate-700 italic border-l-2 border-slate-900 pl-4">6. 承上題，說明做過哪些及成效：</label>
              <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all resize-none" onChange={e => setForm({...form, q6_expDetail: e.target.value})} />
            </div>
          )}
          <div className="space-y-4">
            <label className="block font-black text-slate-700">7. 你認識這次的授課講師「維多」嗎？</label>
            <select className="w-full p-6 rounded-3xl font-black bg-slate-50 border border-slate-100 cursor-pointer" onChange={e => setForm({...form, q7_knowVictor: e.target.value})}>
              <option>認識，有接觸過</option>
              <option>有聽說過，但沒接觸過</option>
              <option>不認識也沒聽過</option>
            </select>
          </div>
          {form.q7_knowVictor !== '不認識也沒聽過' && (
            <div className="space-y-4 animate-in slide-in-from-top-4">
              <label className="block font-black text-slate-700 italic border-l-2 border-slate-900 pl-4">8. 說說妳對維多的了解：</label>
              <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all resize-none" onChange={e => setForm({...form, q8_victorDetail: e.target.value})} />
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
            <label className="block font-black text-slate-700">10. 有沒有想先對講師許的願？</label>
            <textarea className="w-full p-6 rounded-3xl h-32 outline-none font-medium bg-slate-50 border border-slate-100 focus:bg-white transition-all resize-none" onChange={e => setForm({...form, q10_wishes: e.target.value})} placeholder="維多老師，我希望..." />
          </div>
        </div>

        <button type="submit" className="w-full py-8 rounded-full bg-slate-900 text-white font-black text-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95 group relative overflow-hidden">
          <span className="relative z-10">傳遞我的品牌品味</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </button>
      </div>
    </form>
  );
};

// --- 後台：管理決策中心 ---
const AdminPanel: React.FC<{ data: SurveyData[] }> = ({ data }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const startAnalysis = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.API_KEY || "";
      if (!apiKey) {
        alert("尚未在 Vercel 設定 API_KEY！請先設定金鑰並點擊 Redeploy。");
        setLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `你是維多的品牌助教。分析這 ${data.length} 份問卷：${JSON.stringify(data)}。請給予：1.每小題深度總結 2.學員Persona畫像 3.給維多老師的具體課前策略建議。輸出繁體中文 JSON。`;
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              perQuestionInsight: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, title: { type: Type.STRING }, insight: { type: Type.STRING } } } },
              studentPersona: { type: Type.STRING },
              courseStrategy: { type: Type.STRING }
            },
            required: ["perQuestionInsight", "studentPersona", "courseStrategy"]
          }
        }
      });
      setAnalysis(JSON.parse(response.text.trim()));
    } catch (e) {
      console.error(e);
      alert("AI 分析失敗，請確認 API_KEY 是否正確。");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 pt-12 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white italic">Master Center</h2>
          <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">維多品牌決策中心</p>
        </div>
        <button onClick={startAnalysis} disabled={loading || data.length === 0} className="px-10 py-5 bg-white text-slate-900 rounded-full font-black hover:scale-105 transition-all shadow-2xl active:scale-95 disabled:opacity-50">
          {loading ? 'AI 正在分析學員靈魂...' : '生成學員品牌報告'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-10 animate-in fade-in duration-1000">
          <div className="glass-card p-12 rounded-[4rem] border-none shadow-2xl">
            <h3 className="text-3xl font-black mb-8 rainbow-text italic">最終課程準備建議</h3>
            <p className="text-slate-700 leading-loose text-xl font-medium whitespace-pre-wrap">{analysis.courseStrategy}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-[3rem] border-none shadow-xl">
              <h4 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-6 italic">學員樣態畫像</h4>
              <p className="text-slate-600 font-bold leading-relaxed">{analysis.studentPersona}</p>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {analysis.perQuestionInsight.map(q => (
                <div key={q.id} className="glass-card p-8 rounded-[2.5rem] border-none shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full">{q.id}</span>
                    <p className="font-black text-slate-800 text-lg">{q.title}</p>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{q.insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-[3.5rem] overflow-hidden border-none shadow-2xl overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <tr><th className="px-10 py-6">Name</th><th className="px-10 py-6">Title</th><th className="px-10 py-6">Favorite</th><th className="px-10 py-6">Date</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors font-bold text-slate-700">
                <td className="px-10 py-8">{s.name}</td><td className="px-10 py-8">{s.jobTitle}</td><td className="px-10 py-8 text-purple-600">{s.q2_favoriteBrand}</td><td className="px-10 py-8 text-slate-300 text-xs">{new Date(s.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-black">目前尚無學員提交問卷</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 主入口 ---
export default function App() {
  const [data, setData] = useState<SurveyData[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('victor_branding_db_v2');
      if (saved) setData(JSON.parse(saved));
    } catch (e) { console.error("Data load error", e); }
  }, []);

  const handleSave = (d: SurveyData) => {
    const next = [d, ...data];
    setData(next);
    localStorage.setItem('victor_branding_db_v2', JSON.stringify(next));
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
            <Link to="/admin" className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-[0.3em]">Master Center</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<SurveyForm onSave={handleSave} />} />
          <Route path="/admin" element={<AdminPanel data={data} />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
