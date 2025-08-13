import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const AVAILABLE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite-preview-02-05',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-8b',
];

export async function generateAI(prompt: any) {
  console.log('LAGI DI PROSES...');
  let res = '';
  for (const model of AVAILABLE_MODELS) {
    const ai = genAI.getGenerativeModel({ model });
    const { response } = await ai.generateContent(prompt);

    res = response.text();
    break;
  }

  console.log('SELESAI...');
  return res;
}
