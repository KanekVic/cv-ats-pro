import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Type, Mic, MicOff, FlipHorizontal, Edit, RotateCcw } from 'lucide-react';

const defaultText = `Hola, y bienvenidos a este teleprompter.

Esta herramienta está diseñada para ayudarte a grabar tus videos o dar presentaciones de forma fluida y profesional.

Puedes ajustar la velocidad de desplazamiento del texto, el tamaño de la fuente, e incluso activar el apuntador de voz en tiempo real.

El apuntador de voz leerá el texto por ti y resaltará las palabras a medida que las dice, para que nunca te pierdas y mantengas un ritmo perfecto.

¡Prueba a cambiar la velocidad de scroll, ajusta la velocidad de la voz, o activa el modo espejo si estás usando un cristal divisor!`;

export default function App() {
  const [text, setText] = useState(defaultText);
  const [isEditing, setIsEditing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Settings
  const [scrollSpeed, setScrollSpeed] = useState(1.5);
  const [fontSize, setFontSize] = useState(50);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceRate, setVoiceRate] = useState(1);
  const [mirror, setMirror] = useState(false);
  
  // State for voice syncing
  const [charIndex, setCharIndex] = useState<number | null>(null);
  
  // Refs
  const scrollerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const exactScrollRef = useRef<number>(0);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [showControls, setShowControls] = useState(true);

  // Load voices early to avoid delay
  useEffect(() => {
    const loadVoices = () => { window.speechSynthesis.getVoices(); };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (!isEditing && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isEditing, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const startSpeech = useCallback((startOffset = 0) => {
    window.speechSynthesis.cancel();
    
    // Tiny delay to ensure cancel is registered by the browser before starting new utterance
    setTimeout(() => {
      const textToSpeak = text.slice(startOffset);
      if (!textToSpeak.trim()) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES'; // Default to Spanish
      
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es') && v.localService) 
                        || voices.find(v => v.lang.startsWith('es'));
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.rate = voiceRate;

      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          setCharIndex(startOffset + e.charIndex);
        }
      };

      utterance.onend = () => {
        // We do not stop playing the scroll just because the voice ended, 
        // as the user might want the text to keep scrolling out of frame.
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [text, voiceRate]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (voiceEnabled) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      if (voiceEnabled) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (!window.speechSynthesis.speaking) {
          startSpeech(charIndex || 0);
        }
      }
    }
  };

  const stopAndReset = useCallback(() => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    setCharIndex(null);
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = 0;
      exactScrollRef.current = 0;
    }
  }, []);

  const handleVoiceRateChange = (newRate: number) => {
    setVoiceRate(newRate);
    if (isPlaying && voiceEnabled) {
      startSpeech(charIndex || 0);
    }
  };

  const toggleVoice = () => {
    const nextState = !voiceEnabled;
    setVoiceEnabled(nextState);
    if (!nextState && isPlaying) {
      window.speechSynthesis.pause();
    }
    if (nextState && isPlaying) {
      if (window.speechSynthesis.paused) {
         window.speechSynthesis.resume();
      } else {
         startSpeech(charIndex || 0);
      }
    }
  };

  const animate = useCallback((time: number) => {
    if (isPlaying && scrollerRef.current && scrollSpeed > 0) {
      if (lastTimeRef.current !== undefined) {
        const deltaTime = time - lastTimeRef.current;
        // 1 speed unit ~ 1 pixel per frame (at 60fps)
        const scrollAmount = (deltaTime / 16) * scrollSpeed;
        
        // Sync if user scrolled manually
        if (Math.abs(scrollerRef.current.scrollTop - exactScrollRef.current) > 2) {
          exactScrollRef.current = scrollerRef.current.scrollTop;
        }
        
        exactScrollRef.current += scrollAmount;
        scrollerRef.current.scrollTop = exactScrollRef.current;
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = undefined;
      if (isPlaying) {
        // Keep looping if playing but speed is 0
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  }, [isPlaying, scrollSpeed]);

  useEffect(() => {
    if (isPlaying) {
      if (scrollerRef.current) {
        exactScrollRef.current = scrollerRef.current.scrollTop;
      }
      requestRef.current = requestAnimationFrame(animate);
    } else {
      lastTimeRef.current = undefined;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  const renderText = () => {
    if (!voiceEnabled || charIndex === null) return text;
    
    // Find the end of the current word
    const nextSpaceOrNewline = text.substring(charIndex).search(/[\s\n]/);
    const wordEnd = nextSpaceOrNewline === -1 ? text.length : charIndex + nextSpaceOrNewline;

    const before = text.slice(0, charIndex);
    const current = text.slice(charIndex, wordEnd);
    const after = text.slice(wordEnd);

    return (
      <>
        <span className="text-slate-500 transition-colors duration-200">{before}</span>
        <span className="text-yellow-400 bg-yellow-400/10 rounded-sm font-semibold shadow-[0_0_15px_rgba(250,204,21,0.2)]">{current}</span>
        <span className="text-white">{after}</span>
      </>
    );
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col font-sans">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Teleprompter Pro
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              Escribe o pega tu guion. El apuntador de voz lo leerá y resaltará las palabras, mientras controlas la velocidad.
            </p>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full flex-1 min-h-[50vh] bg-slate-900 border border-slate-800 rounded-2xl p-6 text-lg md:text-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner leading-relaxed"
            placeholder="Comienza a escribir tu guion aquí..."
          />
          
          <button
            onClick={() => {
              if (text.trim() === '') return;
              setIsEditing(false);
              stopAndReset();
            }}
            disabled={text.trim() === ''}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 rounded-2xl font-bold text-xl flex justify-center items-center gap-3 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            <Play fill="currentColor" size={24} /> 
            Iniciar Teleprompter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-full bg-black text-white overflow-hidden relative cursor-default select-none font-sans"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* Target Reading Line */}
      <div className="absolute top-1/3 md:top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none z-10" />
      <div className="absolute top-1/3 md:top-1/2 left-0 w-3 h-3 -mt-[5px] bg-red-500/60 rounded-r-full pointer-events-none z-10" />
      <div className="absolute top-1/3 md:top-1/2 right-0 w-3 h-3 -mt-[5px] bg-red-500/60 rounded-l-full pointer-events-none z-10" />

      {/* Scrolling Text Container */}
      <div 
        ref={scrollerRef}
        className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth"
        style={{ scrollBehavior: isPlaying ? 'auto' : 'smooth' }}
      >
        <div 
          className={`w-full max-w-5xl mx-auto px-6 md:px-12 leading-[1.6] ${mirror ? 'scale-x-[-1]' : ''}`} 
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="whitespace-pre-wrap pb-[80vh] pt-[33vh] md:pt-[50vh]">
            {renderText()}
          </div>
        </div>
      </div>

      {/* Floating Control Bar */}
      <div 
        className={`fixed bottom-6 left-4 right-4 md:bottom-8 md:left-1/2 md:-translate-x-1/2 bg-slate-900/90 border border-slate-700/50 p-4 md:px-8 rounded-3xl shadow-2xl backdrop-blur-xl z-50 md:w-max transition-all duration-500 flex flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-8 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
      >
        {/* Playback Controls */}
        <div className="flex items-center gap-4 border-r border-slate-700/50 pr-4 md:pr-8">
          <button 
            onClick={stopAndReset} 
            title="Reiniciar"
            className="p-3 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors active:scale-90"
          >
            <Square size={24} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
        </div>

        {/* Adjustments Container */}
        <div className="flex items-center gap-6 md:gap-8">
          
          {/* Text Scroll Speed */}
          <div className="flex flex-col gap-2 w-32">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Scroll</span>
              <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{scrollSpeed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="0" max="8" step="0.1" 
              value={scrollSpeed} 
              onChange={(e) => setScrollSpeed(Number(e.target.value))} 
              className="accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none" 
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-700/50" />

          {/* Voice Settings */}
          <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto">
            <button
              onClick={toggleVoice}
              className={`flex-shrink-0 p-3 rounded-xl transition-colors shadow-sm ${voiceEnabled ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-500 border border-transparent'}`}
              title="Apuntador de Voz"
            >
              {voiceEnabled ? <Mic size={22} /> : <MicOff size={22} />}
            </button>

            {voiceEnabled && (
              <div className="flex flex-col gap-2 w-full md:w-28">
                <div className="hidden md:flex justify-between text-xs text-slate-400 font-medium">
                  <span>Voz</span>
                  <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">{voiceRate.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.5" step="0.1" 
                  value={voiceRate} 
                  onChange={(e) => handleVoiceRateChange(Number(e.target.value))} 
                  className="accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none w-full" 
                />
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-slate-700/50" />

          {/* Size & Mirror Tools */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-xl p-1">
              <button onClick={() => setFontSize(f => Math.max(20, f - 5))} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Type size={16} /></button>
              <button onClick={() => setFontSize(f => Math.min(150, f + 5))} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Type size={22} /></button>
            </div>
            
            <button 
              onClick={() => setMirror(!mirror)} 
              title="Modo Espejo"
              className={`p-3 rounded-xl transition-colors ml-2 shadow-sm ${mirror ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-700'}`}
            >
              <FlipHorizontal size={22} />
            </button>
          </div>
          
          <div className="w-px h-10 bg-slate-700/50 hidden md:block" />

          {/* Edit / Exit */}
          <button 
            onClick={() => { stopAndReset(); setIsEditing(true); }} 
            className="flex items-center gap-2 p-3 hover:bg-slate-800/80 text-slate-400 hover:text-white rounded-xl transition-colors border border-transparent hover:border-slate-700"
          >
            <Edit size={20} />
            <span className="hidden md:block text-sm font-medium">Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

