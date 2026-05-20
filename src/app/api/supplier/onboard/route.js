import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import crypto from 'crypto';
import { verifyOnboardingToken } from '@/lib/onboarding';

export const dynamic = 'force-dynamic';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2026-05-07',
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const token = formData.get('token');
    
    if (!token) {
      return NextResponse.json({ error: '缺少安全對接憑證 (Token)' }, { status: 400 });
    }

    // 1. 驗證密碼學 Token，防範資料篡改
    const verifiedData = verifyOnboardingToken(token);
    if (!verifiedData) {
      return NextResponse.json({ error: '無效或已過期的對接憑證，請與買方採購重新聯繫。' }, { status: 403 });
    }

    const { supplierName, email, type, hubSlug } = verifiedData;

    // 2. 獲取填報數據
    const materialName = formData.get('materialName');
    const volume = formData.get('volume');
    const intensity = formData.get('intensity');
    const standard = formData.get('standard') || 'ISO 14067 PCF Certificate';
    const auditor = formData.get('auditor') || '自主申報';
    const extraction = formData.get('extraction') || '0';
    const manufacturing = formData.get('manufacturing') || '0';
    const logistics = formData.get('logistics') || '0';
    const file = formData.get('certificateFile');

    if (!materialName || !volume || !intensity) {
      return NextResponse.json({ error: '請提供完整的產品名稱、採購重量與碳強度數值。' }, { status: 400 });
    }

    let fileAsset = null;
    let fileHash = '';

    // 3. 處理驗證證書上傳與 SHA-256 雜湊值計算
    if (file && file instanceof File && file.size > 0) {
      console.log(`[Supplier Onboard] Processing file upload: ${file.name} (${file.size} bytes)`);
      
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(fileArrayBuffer);
      
      // 計算證書檔案的 SHA-256 哈希值作為密碼學存證雜湊 (Ledger Hash)
      fileHash = '0x' + crypto.createHash('sha256').update(fileBuffer).digest('hex');
      console.log(`[Supplier Onboard] Computed certificate SHA-256 Hash: ${fileHash}`);

      try {
        // 上傳至 Sanity 免費 5GB 空間
        fileAsset = await writeClient.assets.upload('file', fileBuffer, {
          filename: file.name,
          contentType: file.type || 'application/pdf',
        });
        console.log(`✅ [Supplier Onboard] Asset uploaded successfully: ${fileAsset._id}`);
      } catch (uploadError) {
        console.error('❌ [Supplier Onboard] Failed to upload asset to Sanity:', uploadError);
        return NextResponse.json({ error: '證書檔案上傳雲端失敗，請重試。' }, { status: 500 });
      }
    } else {
      // 若無上傳憑證，使用申報數據雜湊作為 Base Hash，表示自我宣稱
      const baseString = `${supplierName}-${materialName}-${volume}-${intensity}-${Date.now()}`;
      fileHash = '0x' + crypto.createHash('sha256').update(baseString).digest('hex');
    }

    // 4. 計算總排放量與細分
    const totalVolume = parseFloat(volume);
    const totalIntensity = parseFloat(intensity);
    const emissions = totalVolume * totalIntensity;

    const breakdown = {
      extraction: parseFloat(extraction),
      manufacturing: parseFloat(manufacturing),
      logistics: parseFloat(logistics)
    };

    // 5. 寫入 Sanity 信任帳本交易 (scope3Transaction)
    const txId = `TX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const txDoc = {
      _type: 'scope3Transaction',
      id: txId,
      date: new Date().toISOString().split('T')[0],
      supplier: supplierName,
      material: materialName,
      category: type,
      volume: totalVolume,
      intensity: totalIntensity,
      emissions: Number(emissions.toFixed(2)),
      status: fileAsset ? 'verified' : 'self-declared',
      auditor: fileAsset ? auditor : '自主申報 (未查證)',
      standard: standard,
      hash: fileHash,
      breakdown,
      certificateFile: fileAsset ? {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: fileAsset._id
        }
      } : undefined
    };

    console.log(`[Supplier Onboard] Creating ledger transaction in Sanity:`, txId);
    const createdTx = await writeClient.create(txDoc);
    console.log(`✅ [Supplier Onboard] Transaction successfully written to ledger:`, createdTx._id);

    return NextResponse.json({
      success: true,
      transactionId: txId,
      ledgerHash: fileHash,
      message: '數據已成功通過驗證，並安全寫入供應鏈 Scope 3 信任帳本！'
    });

  } catch (error) {
    console.error('[Supplier Onboard API] Critical Failure:', error);
    return NextResponse.json({ error: '申報提交失敗，錯誤：' + error.message }, { status: 500 });
  }
}
