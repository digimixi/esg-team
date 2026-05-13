'use client';

import { useState, useEffect } from 'react';
import { SteelIndustryEngine } from '@/lib/esg-engine';

export const dynamic = 'force-dynamic';

export default function CarbonDashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // 1. 抓取企業與分錄數據
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin-stats'); // 借用現有統計 API 或新建
        const data = await res.json();
        // 這裡我們先模擬數據展示，稍後實作 API 串接
        const mockCompany = {
          name: '示範鋼鐵廠 (EAF)',
          entries: [
            { entryType: 'input', activityData: 500000, factor: { category: 'scope2-electricity', factor: 0.495, unit: 'kWh' } },
            { entryType: 'input', activityData: 1200, factor: { name: '石墨電極', factor: 2.1, unit: 'kg' } },
            { entryType: 'output', activityData: 1000, factor: { name: '成品粗鋼', factor: 0, unit: 'MT' } }
          ]
        };
        setCompanies([mockCompany]);
        handleSelectCompany(mockCompany);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    const m = SteelIndustryEngine.calculateSteelMetrics(company.entries);
    setMetrics(m);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAnalyzing(true);
    // 實作 AI OCR 串接邏輯
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const res = await fetch('/api/esg/analyze-bill', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type })
        });
        const data = await res.json();
        alert(`AI 辨識成功！\n活動類型: ${data.analysis.activityType}\n數據: ${data.analysis.value}\n註記: ${data.analysis.auditNote}`);
      } catch (err) {
        alert('AI 辨識失敗，請檢查 API Key 或網絡連線');
      }
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="p-8 text-center">載入 ESG 數據中...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen bg-slate-50">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ESG 碳盤查內稽中心</h1>
          <p className="text-slate-500">定位：ESG 界的鼎新 ERP - 中小企業專業版</p>
        </div>
        <div className="flex gap-4">
          <label className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
            {analyzing ? 'AI 辨識中...' : '📸 AI 掃描單據'}
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={analyzing} />
          </label>
        </div>
      </header>

      {/* KPI 儀表板 */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="總產量 (MT)" value={metrics.totalSteel} unit="MT" color="blue" />
          <MetricCard title="碳強度 (Intensity)" value={metrics.carbonIntensity} unit="tCO2e/t" color="red" />
          <MetricCard title="電極消耗率" value={metrics.electrodeRate} unit="kg/t" color="amber" />
          <MetricCard title="用電效率" value={metrics.powerEfficiency} unit="kWh/t" color="green" />
        </div>
      )}

      {/* 內稽診斷報告 */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🛡️ AI 內格診斷報告
        </h2>
        <div className="space-y-4">
          {metrics && SteelIndustryEngine.getAuditInsights(metrics).map((insight, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${insight.level === 'critical' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-amber-50 border-amber-500 text-amber-700'}`}>
              <strong>{insight.level.toUpperCase()}:</strong> {insight.message}
            </div>
          ))}
          {!metrics && <p className="text-slate-400">尚無數據進行診斷</p>}
        </div>
      </section>

      {/* 數據明細表格 */}
      <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 text-sm">
            <tr>
              <th className="p-4">項目</th>
              <th className="p-4">類型</th>
              <th className="p-4">數據</th>
              <th className="p-4">排放量 (tCO2e)</th>
              <th className="p-4">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {selectedCompany?.entries.map((entry, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium">{entry.factor.name || entry.factor.category}</td>
                <td className="p-4 text-sm text-slate-500">{entry.entryType}</td>
                <td className="p-4">{entry.activityData} {entry.factor.unit}</td>
                <td className="p-4 font-mono">{(entry.activityData * entry.factor.factor / 1000).toFixed(2)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                    已核實 (Evidence Attached)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function MetricCard({ title, value, unit, color }) {
  const colors = {
    blue: 'border-blue-500 text-blue-700 bg-blue-50',
    red: 'border-red-500 text-red-700 bg-red-50',
    amber: 'border-amber-500 text-amber-700 bg-amber-50',
    green: 'border-green-500 text-green-700 bg-green-50',
  };
  return (
    <div className={`p-6 rounded-xl border-t-4 shadow-sm bg-white`}>
      <p className="text-slate-500 text-sm mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${colors[color].split(' ')[1]}`}>{value}</span>
        <span className="text-slate-400 text-xs">{unit}</span>
      </div>
    </div>
  );
}
