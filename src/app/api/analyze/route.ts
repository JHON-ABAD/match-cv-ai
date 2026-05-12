import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Inicializamos la IA buscando la llave en tu archivo .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // 1. Extraemos lo que envías desde el Frontend
    const body = await request.json();
    const { cvText, jobDescription } = body;

    // 2. ¡EL MODELO CORRECTO! Usamos el gemini-2.5-flash que descubrimos en tu radar
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 3. El Prompt del Tech Lead
    const prompt = `Actúa como un reclutador IT experto (Tech Lead). Analiza este CV contra la siguiente oferta de trabajo.
    Devuelve un análisis corto y estructurado que incluya:
    1. Porcentaje de compatibilidad (Ej: 85%).
    2. Palabras clave de la oferta que faltan en el CV.
    3. 3 recomendaciones exactas para adaptar el CV y asegurar una entrevista.

    CV del Candidato:
    ${cvText}

    Oferta de Trabajo:
    ${jobDescription}`;

    // 4. Mandamos a pensar a la IA
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 5. Devolvemos el análisis al Frontend
    return NextResponse.json({ analysis: responseText });
    
  } catch (error) {
    console.error('Error de IA:', error);
    return NextResponse.json(
      { error: 'Error al procesar el currículum con la IA' }, 
      { status: 500 }
    );
  }
}