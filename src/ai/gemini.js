/**
 * @module gemini
 * @description Este modulo es para interactuar con el modelo de gemini
 */
import fetch, { Headers } from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hacer fetch y Headers globales
globalThis.fetch = fetch;
globalThis.Headers = Headers;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "Actua como un traductor,tu proposito es devolverme todo el texto en italiano:",
});

const modelEntrenadorPersonal = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "Actua como un entrenador personal,tu proposito es ayudar al usuario a mejorar su vida:",
});

const modelIngenieroDeSoftware = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "Actua como un ingeniero de software,tu proposito es ayudar al usuario dandole soporte para resolver problemas de software y hardware:",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const generationConfigEntrenadorPersonal = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const generationConfigIngenieroDeSoftware = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

/**
 * @param {string} message 
 * @param {Array<{role: string, parts: {text: string}}>} history 
 * @returns {Promise<string>}
 * @description Esta funcion es para traducir el texto a italiano
 */
export async function toAskGemini({message, history}) {
  const chatSession = model.startChat({
    generationConfig,
    history,
  });

  const result = await chatSession.sendMessage(message);
  const textConvertedItaliano = result.response.text();
  return textConvertedItaliano;
}

export async function toAskEntrenadorPersonal({message, history}) {
  const chatSession = modelEntrenadorPersonal.startChat({
    generationConfigEntrenadorPersonal,
    history,
  });
  const result = await chatSession.sendMessage(message);
  const textEntrenadorPersonal = result.response.text();
  return textEntrenadorPersonal;
}

export async function toAskIngenieroDeSoftware({message, history}) {
  const chatSession = modelIngenieroDeSoftware.startChat({
    generationConfigIngenieroDeSoftware,
    history,
  });
  const result = await chatSession.sendMessage(message);
  const textIngenieroDeSoftware = result.response.text();
  return textIngenieroDeSoftware;
}