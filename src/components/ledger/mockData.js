// Pre-signed mock ledger transactions for Phase 2 Cryptographic Audit Desk
export const initialTransactions = [
  {
    "id": "TX-2026-001",
    "date": "2026-05-10",
    "supplier": "中鋼股份有限公司 (CSC)",
    "material": "EAF 綠色廢鋼基底材料 (EAF Scrap Base)",
    "category": "steel",
    "volume": 12000,
    "intensity": 0.62,
    "emissions": 7440,
    "status": "verified",
    "auditor": "SGS Taiwan",
    "standard": "ISO 14067:2018 Product Carbon Footprint",
    "breakdown": {
      "extraction": 0.12,
      "manufacturing": 0.38,
      "logistics": 0.12
    },
    "hash": "0xcff7b1fd0691a7fec34673a0ebada2965963d4b9fb970a2ee0244d112028fee1",
    "signature": "30450221008e5af84f299f49495b7f44729b3205130dc1f201c00f387efdd5b19b43e12ca102200f0fc1b8ab3402786f80cf692cd1543bd0c43d608be551f42dd023fc768786a4"
  },
  {
    "id": "TX-2026-002",
    "date": "2026-05-08",
    "supplier": "Giga Carbon Corp (極碳科技)",
    "material": "UHP 600mm 超高功率石墨電極 (UHP Graphite Electrode)",
    "category": "graphite",
    "volume": 450,
    "intensity": 2.45,
    "emissions": 1102.5,
    "status": "verified",
    "auditor": "TÜV Rheinland",
    "standard": "ISO 14067 PCF Certificate",
    "breakdown": {
      "extraction": 0.45,
      "manufacturing": 1.8,
      "logistics": 0.2
    },
    "hash": "0xda71c5a6fd336bd4841696fd5a49cf8d8261f9b369483891cc58e25b2b5e6559",
    "signature": "3045022100c6e1a1196889d0a1efc7703cda586820e12a17967715d3e27c0fd8452b0a6d1c0220619a53ee6d560fa0b421559b45fa40f3f7960aee06d6d0f3469236c79ff6c24a"
  },
  {
    "id": "TX-2026-003",
    "date": "2026-05-05",
    "supplier": "陽明海運股份有限公司 (Yang Ming)",
    "material": "低碳海運航線運輸服務 (Kaohsiung to Rotterdam)",
    "category": "logistics",
    "volume": 8500,
    "intensity": 0.08,
    "emissions": 680,
    "status": "auditing",
    "auditor": "DNV GL (審查中)",
    "standard": "GLEC Framework v3.0 Scope 3 Category 4",
    "breakdown": {
      "extraction": 0.01,
      "manufacturing": 0,
      "logistics": 0.07
    },
    "hash": "0x23c19aa7cb495d15d46c4a8d0bce39f685d2d21538307ca5fb7a81971405fd83"
  },
  {
    "id": "TX-2026-004",
    "date": "2026-04-28",
    "supplier": "Anglo-American Mining Group",
    "material": "優質還原鐵礦石原料 (Direct Reduced Iron Ore)",
    "category": "steel",
    "volume": 5000,
    "intensity": 1.15,
    "emissions": 5750,
    "status": "verified",
    "auditor": "SGS United Kingdom",
    "standard": "ISO 14064-1 Corporate Inventory",
    "breakdown": {
      "extraction": 0.65,
      "manufacturing": 0.35,
      "logistics": 0.15
    },
    "hash": "0xb53a8b3eaa0f82a18b36eadb9dbe939695ca6a6c955e09a1cf95ef2e2fb02bc3",
    "signature": "304402201b4e6564264ac9ff9d310dde72c3caf48a1cfec4aa9263efac5904f9c8fd8bff022025f521799f424e6465ac7c5a264ba9f5b6b91f8dcf3aad3384d87ee5817fe840"
  },
  {
    "id": "TX-2026-005",
    "date": "2026-04-25",
    "supplier": "Tokai Carbon Co., Ltd.",
    "material": "高效能針狀焦原料 (Premium Needle Coke)",
    "category": "graphite",
    "volume": 800,
    "intensity": 3.1,
    "emissions": 2480,
    "status": "self-declared",
    "auditor": "自主申報 (未查證)",
    "standard": "GHG Protocol Corporate Standard (Self-Reported)",
    "breakdown": {
      "extraction": 0.8,
      "manufacturing": 2.1,
      "logistics": 0.2
    },
    "hash": "0x14119f7eb0ac9b37119469a46f1fd9445fe9c9ef517843863a90eaaa1b79a991"
  }
];
