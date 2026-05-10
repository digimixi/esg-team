import { GoogleGenerativeAI } from '@google/generative-ai';
const apiKey = 'AIzaSyAlcsfuOACBabsxnU6gddhBBMBWxDsxmj0';
async function find() {
  const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await modelsResponse.json();
  const candidates = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
  console.log('可用模型清單 (前 5 個):');
  candidates.slice(0, 5).forEach(m => console.log(`- ${m.name}`));
}
find();
