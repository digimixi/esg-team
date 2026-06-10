import React from 'react';

const EcosystemFlow = ({ stages, groupedData }) => {
  return (
    <div className="mb-20">
      <div className="mb-8 border-b border-outline-variant/30 pb-6">
        <span className="inline-block px-3 py-1 bg-esg-emerald/10 text-esg-emerald text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">
          Core Map
        </span>
        <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-3">Taiwan Steel Ecosystem</h3>
        <p className="text-on-surface-variant max-w-3xl leading-relaxed text-sm md:text-base">
          用上中下游讓 ESG 顧問理解產業關係，從一家企業往上追溯原料、往下串聯客戶，形成更大的材料導入與供應鏈改善專案。
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {stages.map((stage, index) => {
          const companies = groupedData[stage.id] || [];
          if (companies.length === 0) return null;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col lg:flex-row gap-6 bg-surface-container-low border border-outline-variant p-5 md:p-6 rounded-2xl items-stretch shadow-sm">
                {/* Left Label */}
                <div className="lg:w-72 shrink-0 bg-primary/5 border border-primary/20 p-5 rounded-xl flex flex-col justify-center">
                  <span className="text-esg-emerald font-black tracking-widest text-[12px] uppercase mb-2">{`Stage ${stage.id}`}</span>
                  <h4 className="font-bold text-lg text-primary mb-2 leading-tight">{stage.title.split('：')[1]}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{stage.description}</p>
                </div>
                
                {/* Right Content */}
                <div className="flex-1 flex flex-col justify-between gap-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {companies.slice(0, 8).map(comp => (
                      <div key={comp._key} className="bg-surface border border-outline-variant p-3 rounded-lg flex flex-col justify-center transition-colors hover:border-primary/40 hover:bg-surface-container-lowest">
                        <b className="text-sm font-bold text-primary leading-tight mb-1">{comp.companyName.split(' ')[0]}</b>
                        <small className="text-[10px] text-on-surface-variant leading-tight line-clamp-1">{comp.productType}</small>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-outline-variant/40">
                    {stage.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-cyan-700 text-white dark:bg-cyan-600 border border-cyan-800/30 rounded-md text-[11px] font-bold shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Arrow */}
              {index < stages.length - 1 && (
                <div className="text-center text-esg-emerald font-bold tracking-widest text-[11px] py-1 opacity-80">
                  ↓ MATERIAL FLOW / CARBON DATA FLOW ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const DatabaseTables = ({ stages, groupedData, getPriorityColor, getVerificationColor }) => {
  return (
    <div>
      <div className="mb-8 border-b border-outline-variant/30 pb-6">
        <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">
          Opportunity Database
        </span>
        <h3 className="font-headline-md text-2xl md:text-3xl text-primary mb-3">顧問開發資料庫</h3>
        <p className="text-on-surface-variant max-w-3xl leading-relaxed text-sm md:text-base mb-6">
          以下依照上中下游排列。產業鏈位置代表其供應鏈角色；優先級代表 ESG 顧問開發成功率與材料導入關聯度。
        </p>

        {/* 級別說明圖例 (Legend) */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-[13px] bg-surface-container-low p-4 rounded-lg border border-outline-variant max-w-4xl">
          <div className="flex items-start gap-2">
            <span className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${getPriorityColor('S級')}`}>S級</span>
            <span className="text-on-surface-variant leading-tight"><strong>立即行動</strong>：面臨歐美出口、CBAM 碳關稅或國際車廠稽核，具備極高減碳急迫性。</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${getPriorityColor('A級')}`}>A級</span>
            <span className="text-on-surface-variant leading-tight"><strong>重點佈局</strong>：承受國內外供應鏈要求或本身屬高耗能製程，正積極尋找轉型解方。</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${getPriorityColor('B級')}`}>B級</span>
            <span className="text-on-surface-variant leading-tight"><strong>潛力培育</strong>：面對綠色採購要求或初步展開碳盤查，適合提供初期材料提案。</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {stages.map((stage) => {
          const rows = groupedData[stage.id] || [];
          if (rows.length === 0) return null;

          return (
            <div key={stage.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-surface-container-low to-surface-container-lowest border-b border-outline-variant p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h4 className="font-bold text-lg text-primary">{stage.title}</h4>
                <span className="text-[13px] text-on-surface-variant font-medium">{stage.description}</span>
              </div>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-surface-container-low/50 border-b border-outline-variant">
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest w-24">優先級</th>
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest w-48">公司名稱</th>
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest w-32">產品類型</th>
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest w-48">ESG 痛點</th>
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest w-40">可導入材料</th>
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest">顧問切入點</th>
                      <th className="p-4 text-[11px] font-bold text-secondary uppercase tracking-widest w-28 text-right">可信度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50">
                    {rows.map((row) => (
                      <tr key={row._key} className="hover:bg-surface-container-low/60 transition-colors group">
                        <td className="p-4 align-top">
                          <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${getPriorityColor(row.priority)}`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="p-4 align-top font-bold text-primary whitespace-nowrap">{row.companyName}</td>
                        <td className="p-4 align-top text-sm text-on-surface-variant">{row.productType}</td>
                        <td className="p-4 align-top text-sm font-medium text-error/80">{row.painPoints}</td>
                        <td className="p-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {row.materials?.map((mat, i) => (
                              <span key={i} className="inline-block bg-esg-emerald/10 text-esg-emerald border border-esg-emerald/20 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
                                {mat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 align-top text-sm text-on-surface-variant italic border-l-2 border-primary/20 bg-primary/5">{row.pitch}</td>
                        <td className="p-4 align-top text-right whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getVerificationColor(row.verification)}`}>
                            {row.verification === 'Verified' && <span className="material-symbols-outlined text-[12px]">verified</span>}
                            {row.verification}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ProspectMap({ data }) {
  if (!data || !data.isActive || !data.rows) return null;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'S級': return 'bg-error text-on-error'; 
      case 'A級': return 'bg-primary text-on-primary'; 
      case 'B級': return 'bg-secondary text-on-secondary'; 
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  const getVerificationColor = (verification) => {
    switch(verification) {
      case 'Verified': return 'text-esg-emerald bg-esg-emerald/10';
      case 'Estimated': return 'text-amber-600 bg-amber-600/10';
      case 'To Verify': return 'text-outline bg-outline/10';
      default: return 'text-on-surface bg-surface-variant';
    }
  };

  const chainStages = [
    {
      id: 'A',
      title: 'A. 上游：煉鋼、鋼胚、電弧爐、高爐',
      description: '直接對應石墨電極、增碳劑、廢鋼追溯與鋼渣循環',
      match: (pos) => pos?.startsWith('上游'),
      tags: ['石墨電極', '增碳劑', '廢鋼溯源', '鋼渣循環利用']
    },
    {
      id: 'B',
      title: 'B. 中游：熱軋、冷軋、鍍鋅、不鏽鋼、製管、裁剪',
      description: '承接上游鋼材，影響扣件、建材、汽車、工具機等下游碳資料',
      match: (pos) => pos?.startsWith('中游'),
      tags: ['低碳鋼材', '碳資料包', '材料護照', 'CBAM 碳資料']
    },
    {
      id: 'C',
      title: 'C. 下游一：扣件、螺絲、螺帽、線材加工',
      description: '顧問最容易開發；出口與歐美供應鏈壓力明確',
      match: (pos) => pos?.includes('扣件') || pos?.includes('線材'),
      tags: ['低碳鋼材', '產品碳足跡', '供應商 ESG 檔案']
    },
    {
      id: 'D',
      title: 'D. 下游二：鑄造、鍛造、熱處理、表面處理',
      description: '與增碳劑、石墨坩堝、碳材溯源關聯最高',
      match: (pos) => pos?.includes('鑄造') || pos?.includes('鍛造') || pos?.includes('熱處理'),
      tags: ['增碳劑', '石墨坩堝', '製程碳資料']
    },
    {
      id: 'E',
      title: 'E. 下游三：鋼結構、營建、公共工程',
      description: '適合綠色鋼材、鋼渣循環建材、建築碳排與公共工程材料證明',
      match: (pos) => pos?.includes('鋼構') || pos?.includes('營建'),
      tags: ['低碳鋼材', '鋼渣循環建材', '建築碳排揭露']
    }
  ];

  const groupedData = {};
  chainStages.forEach(stage => {
    groupedData[stage.id] = data.rows.filter(row => stage.match(row.position));
  });

  return (
    <section className="py-stack-lg px-margin max-w-container-max mx-auto overflow-hidden">
      <div className="mb-10 md:mb-14">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">
          Business Radar
        </span>
        <h2 className="font-headline-md text-3xl md:text-4xl text-primary mb-4 leading-tight">
          {data.subtitle || data.title}
        </h2>
        {data.description && (
          <p className="text-on-surface-variant max-w-3xl leading-relaxed">
            {data.description}
          </p>
        )}
      </div>

      <EcosystemFlow stages={chainStages} groupedData={groupedData} />

      <DatabaseTables stages={chainStages} groupedData={groupedData} getPriorityColor={getPriorityColor} getVerificationColor={getVerificationColor} />

    </section>
  );
}
