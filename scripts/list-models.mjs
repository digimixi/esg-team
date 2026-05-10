import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyAlcsfuOACBabsxnU6gddhBBMBWxDsxmj0');
async function list() {
  try {
    const models = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAlcsfuOACBabsxnU6gddhBBMBWxDsxmj0');
    const data = await models.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
list();
