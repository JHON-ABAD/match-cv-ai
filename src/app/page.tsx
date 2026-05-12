"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FileText, Target, Sparkles, Loader2, CheckCircle, BrainCircuit } from "lucide-react";

export default function Home() {
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencia para hacer el auto-scroll
  const resultsRef = useRef<HTMLDivElement>(null);

  // Efecto que vigila cuando el análisis termina para bajar la pantalla automáticamente
  useEffect(() => {
    if (analysis && !isLoading && resultsRef.current) {
      // Un pequeño retraso para asegurar que el componente se renderizó
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [analysis, isLoading]);

  const handleAnalyze = async () => {
    if (!cvText || !jobDescription) {
      alert("Por favor, ingresa tanto tu currículum como la descripción de la vacante.");
      return;
    }

    setIsLoading(true);
    setAnalysis("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription }),
      });

      const data = await response.json();
      
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis("Hubo un error en la respuesta del servidor.");
      }
    } catch (error) {
      console.error(error);
      setAnalysis("Error de conexión de red.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Cabecera Profesional */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BrainCircuit className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              MatchCV <span className="text-blue-600">AI</span>
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Optimización impulsada por Inteligencia Artificial. Analiza la compatibilidad de tu perfil contra cualquier vacante del mercado IT.
          </p>
        </div>

        {/* Cajas de Texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Caja CV */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              Tu Currículum Actual
            </label>
            <textarea
              className="w-full h-72 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 resize-none outline-none transition-all"
              placeholder="Pega aquí todo el texto de tu CV (Experiencia, skills, proyectos...)"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
            />
          </div>

          {/* Caja Vacante */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-slate-500" />
              Descripción de la Oferta
            </label>
            <textarea
              className="w-full h-72 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 resize-none outline-none transition-all"
              placeholder="Pega aquí los requisitos y detalles del puesto..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Botón de Acción con Estado Inteligente */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className={`
              flex items-center gap-2 font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 shadow-lg
              ${isLoading 
                ? "bg-slate-400 text-slate-100 cursor-not-allowed transform-none shadow-none" 
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-blue-500/30"
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Procesando Análisis...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Analizar Compatibilidad
              </>
            )}
          </button>
        </div>

        {/* Zona de Resultados con Markdown Real y Referencia de Auto-Scroll */}
        {analysis && (
          <div 
            ref={resultsRef} 
            className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-8 duration-700 scroll-mt-8"
          >
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              Veredicto del Tech Lead
            </h2>
            
            {/* Renderizado de Markdown a HTML Real */}
            <div className="text-slate-700 text-lg leading-relaxed">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-800 mt-5 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-blue-500" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-blue-600 font-semibold" {...props} />,
                  li: ({node, ...props}) => <li className="text-slate-700 font-normal" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-slate-900 bg-blue-50 px-1 rounded" {...props} />,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}