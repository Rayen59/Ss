import React, { useState, useEffect, useRef } from 'react';
import { 
  Watch, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Heart, 
  Activity, 
  Pill, 
  FolderCheck, 
  ShieldAlert, 
  Search, 
  Send, 
  PhoneCall, 
  Camera, 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  ChevronUp, 
  ChevronDown, 
  Power, 
  Battery, 
  Wifi, 
  Bluetooth, 
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import { UserProfile, WatchState, PhoneState, MedicationReminder, ProjectTrack, VoiceMessage } from '../types';
import { voiceService } from '../services/voiceService';

interface SmartwatchSimulatorProps {
  user: UserProfile;
  watchState: WatchState;
  phoneState: PhoneState;
  medications: MedicationReminder[];
  projects: ProjectTrack[];
  voiceMessages: VoiceMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  onUpdateWatchState: (updater: (prev: WatchState) => WatchState) => void;
  onUpdatePhoneState: (updater: (prev: PhoneState) => PhoneState) => void;
  onSendMessageToAi: (text: string, mode?: string, searchQuery?: string) => Promise<void>;
  onTriggerSos: () => void;
  onToggleMedsTaken: (id: string) => void;
  onAddMedication: (name: string, time: string, dosage: string) => void;
  onToggleHandsFree: () => void;
}

export const SmartwatchSimulator: React.FC<SmartwatchSimulatorProps> = ({
  user,
  watchState,
  phoneState,
  medications,
  projects,
  voiceMessages,
  isListening,
  isSpeaking,
  onUpdateWatchState,
  onUpdatePhoneState,
  onSendMessageToAi,
  onTriggerSos,
  onToggleMedsTaken,
  onAddMedication,
  onToggleHandsFree,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chatInput, setChatInput] = useState('');
  const [googleQuery, setGoogleQuery] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('20:00');
  const [newMedDosage, setNewMedDosage] = useState('1 gélule');
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [isPhoneRinging, setIsPhoneRinging] = useState(false);

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatWatchTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatWatchDate = (date: Date) => {
    return date.toLocaleDateString(user.language === 'ar-SA' ? 'ar-SA' : 'fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  // Switch Watch App
  const setApp = (app: WatchState['activeWatchApp']) => {
    voiceService.playChime('click');
    onUpdateWatchState((prev) => ({ ...prev, activeWatchApp: app }));
  };

  // Submit Text/Voice query to AI Friend
  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const q = chatInput.trim();
    setChatInput('');
    await onSendMessageToAi(q, 'companion');
  };

  // Google vocal search
  const handleGoogleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!googleQuery.trim()) return;
    const q = googleQuery.trim();
    setGoogleQuery('');
    await onSendMessageToAi(q, 'search', q);
  };

  // Trigger Phone Ring finding
  const handleRingPhone = () => {
    voiceService.playChime('phone_ring');
    setIsPhoneRinging(true);
    onUpdatePhoneState((prev) => ({ ...prev, ringing: true }));
    setTimeout(() => {
      setIsPhoneRinging(false);
      onUpdatePhoneState((prev) => ({ ...prev, ringing: false }));
    }, 4000);
  };

  // Remote phone scroll
  const handleScrollPhone = (direction: 'up' | 'down') => {
    voiceService.playChime('click');
    onUpdatePhoneState((prev) => ({
      ...prev,
      scrollOffset: Math.max(0, prev.scrollOffset + (direction === 'down' ? 120 : -120)),
    }));
  };

  // Remote phone screen toggle (even when screen is off!)
  const handleTogglePhoneScreen = () => {
    voiceService.playChime('click');
    onUpdatePhoneState((prev) => ({ ...prev, isScreenOff: !prev.isScreenOff }));
  };

  // Remote phone camera snap
  const handleSnapCamera = () => {
    voiceService.playChime('click');
    onUpdatePhoneState((prev) => ({
      ...prev,
      activeApp: 'camera',
      lastCapturedPhoto: 'photo_' + Date.now(),
    }));
    voiceService.speakLoudspeaker('Photo capturée à distance depuis la montre !', user.language);
  };

  // Trigger immediate medication proactive alert
  const handleTestMedAlert = (med: MedicationReminder) => {
    voiceService.playChime('meds');
    const speech = `Mon ami, c'est l'heure exacte de prendre votre médicament : ${med.name}, dose de ${med.dosage}. N'oubliez pas votre verre d'eau !`;
    voiceService.speakLoudspeaker(speech, user.language);
  };

  // Trigger project check-in voice
  const handleTestProjectVoice = (proj: ProjectTrack) => {
    voiceService.playChime('notification');
    const speech = `Point projet pour toi : Ton projet ${proj.title} est complété à ${proj.progress} pour cent. Prochaine étape clé : ${proj.nextMilestone}. Tu avances super bien !`;
    voiceService.speakLoudspeaker(speech, user.language);
  };

  return (
    <div className="flex flex-col items-center select-none">
      
      {/* Device Physical Frame */}
      <div className="relative">
        
        {/* Outer Titanium / Blue Casing */}
        <div className="relative w-[340px] sm:w-[380px] h-[480px] sm:h-[510px] rounded-[52px] bg-gradient-to-b from-slate-800 via-blue-950 to-slate-900 p-4 shadow-2xl shadow-blue-950/40 border-4 border-slate-700/80 ring-1 ring-blue-500/20 flex items-center justify-center">
          
          {/* Hardware Digital Crown (Right side top) */}
          <div 
            onClick={() => setApp('home')}
            title="Couronne Digitale (Retour Écran Accueil)"
            className="absolute -right-3.5 top-20 w-4 h-16 rounded-r-lg bg-gradient-to-r from-slate-700 to-slate-500 border border-slate-600 shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all flex flex-col justify-between py-1 items-center"
          >
            <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
            <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
            <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
            <div className="w-1.5 h-0.5 bg-slate-400 rounded-full" />
          </div>

          {/* Hardware Action Button (Right side bottom) */}
          <div 
            onClick={() => onToggleHandsFree()}
            title="Bouton d'Action Vocal (Activer/Couper Écoute Mains-Libres)"
            className={`absolute -right-2.5 top-40 w-3 h-12 rounded-r-md border cursor-pointer hover:brightness-110 active:scale-95 transition-all ${
              isListening ? 'bg-blue-500 border-blue-400 shadow-md shadow-blue-500/50' : 'bg-slate-700 border-slate-600'
            }`}
          />

          {/* Hardware Loudspeaker Grille (Left side) */}
          <div className="absolute -left-1.5 top-24 flex flex-col space-y-1.5">
            <div className={`w-1 h-3 rounded-full transition-all ${isSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            <div className={`w-1 h-4 rounded-full transition-all ${isSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            <div className={`w-1 h-3 rounded-full transition-all ${isSpeaking ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
          </div>

          {/* Screen Bezel & Display Area */}
          <div className="w-full h-full rounded-[42px] bg-black text-white overflow-hidden relative flex flex-col border border-slate-800 shadow-inner">
            
            {/* Top Watch OS Status Bar */}
            <div className="px-5 pt-3.5 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-400 z-20 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center space-x-1">
                <span className="text-white font-mono">{formatWatchTime(currentTime)}</span>
                {watchState.isConnected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
                )}
              </div>

              <div className="flex items-center space-x-2">
                {isListening && (
                  <span className="flex items-center space-x-0.5 text-cyan-400 text-[10px]">
                    <Mic className="w-2.5 h-2.5 animate-pulse" />
                    <span>Écoute</span>
                  </span>
                )}
                <Bluetooth className={`w-3 h-3 ${watchState.isConnected ? 'text-blue-400' : 'text-slate-600'}`} />
                <span className="text-[10px] text-slate-300">{watchState.battery}%</span>
              </div>
            </div>

            {/* App Screen Content Body */}
            <div className="flex-1 overflow-y-auto px-4 py-2 relative scrollbar-none">
              
              {/* ================= 1. HOME SCREEN / WATCH FACE ================= */}
              {watchState.activeWatchApp === 'home' && (
                <div className="flex flex-col items-center justify-between h-full py-1 text-center animate-in fade-in duration-200">
                  
                  {/* Date & Big Time */}
                  <div className="mt-1">
                    <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                      {formatWatchDate(currentTime)}
                    </span>
                    <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono mt-0.5">
                      {formatWatchTime(currentTime)}
                    </div>
                  </div>

                  {/* Central Smart Widgets: Heart rate & Steps ring */}
                  <div className="flex items-center justify-center space-x-4 my-2">
                    {/* Heart Rate Widget */}
                    <div 
                      onClick={() => setApp('health')}
                      className="flex flex-col items-center p-2 rounded-2xl bg-blue-950/40 border border-blue-900/40 hover:bg-blue-900/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-1 text-red-400">
                        <Heart className="w-3.5 h-3.5 animate-bounce" />
                        <span className="text-xs font-bold font-mono">{watchState.heartRate}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase">BPM</span>
                    </div>

                    {/* AI Friend Vocal Button */}
                    <button
                      onClick={() => setApp('friend_voice')}
                      className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-blue-400/40"
                    >
                      <Sparkles className="w-7 h-7" />
                      {isListening && (
                        <span className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-60" />
                      )}
                    </button>

                    {/* Phone Link Status Widget */}
                    <div 
                      onClick={() => setApp('phone_control')}
                      className="flex flex-col items-center p-2 rounded-2xl bg-blue-950/40 border border-blue-900/40 hover:bg-blue-900/40 cursor-pointer transition-all"
                    >
                      <Smartphone className={`w-3.5 h-3.5 ${phoneState.isScreenOff ? 'text-slate-400' : 'text-blue-400'}`} />
                      <span className="text-[9px] text-slate-400 uppercase mt-0.5">
                        {phoneState.isScreenOff ? 'Veille' : 'Lié'}
                      </span>
                    </div>
                  </div>

                  {/* AI Quick Status Pill */}
                  <div 
                    onClick={() => setApp('friend_voice')}
                    className="w-full px-3 py-1.5 rounded-xl bg-blue-900/30 border border-blue-700/40 text-[11px] text-blue-200 flex items-center justify-between cursor-pointer hover:bg-blue-900/50 transition-all"
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <Sparkles className="w-3 h-3 text-cyan-300 shrink-0" />
                      <span className="truncate">Ami IA : "Je suis là avec toi !"</span>
                    </div>
                    <Volume2 className={`w-3 h-3 shrink-0 ${isSpeaking ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                  </div>

                  {/* Watch Quick Apps Grid */}
                  <div className="grid grid-cols-4 gap-2 w-full mt-2 pt-1 border-t border-slate-800/80">
                    <button 
                      onClick={() => setApp('phone_control')} 
                      title="Contrôle Téléphone"
                      className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900 hover:bg-blue-900/40 border border-slate-800 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-blue-400" />
                      <span className="text-[9px] text-slate-300 mt-0.5">Téléphone</span>
                    </button>

                    <button 
                      onClick={() => setApp('google_search')} 
                      title="Google Recherche Vocale"
                      className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900 hover:bg-blue-900/40 border border-slate-800 transition-all cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-sky-400" />
                      <span className="text-[9px] text-slate-300 mt-0.5">Google</span>
                    </button>

                    <button 
                      onClick={() => setApp('meds')} 
                      title="Rappels Médicaments"
                      className="flex flex-col items-center p-1.5 rounded-xl bg-slate-900 hover:bg-blue-900/40 border border-slate-800 transition-all cursor-pointer"
                    >
                      <Pill className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9px] text-slate-300 mt-0.5">Santé</span>
                    </button>

                    <button 
                      onClick={() => setApp('sos')} 
                      title="SOS Danger Réseau Maillé"
                      className="flex flex-col items-center p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-400 transition-all cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                      <span className="text-[9px] text-red-300 font-bold mt-0.5">SOS</span>
                    </button>
                  </div>

                </div>
              )}

              {/* ================= 2. AMI IA VOCAL & HAUT-PARLEUR APP ================= */}
              {watchState.activeWatchApp === 'friend_voice' && (
                <div className="flex flex-col h-full text-left animate-in fade-in duration-200">
                  
                  {/* Top Bar inside App */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline flex items-center space-x-1"
                    >
                      <span>‹ Accueil</span>
                    </button>
                    <div className="flex items-center space-x-1 text-[10px] text-cyan-300 font-bold">
                      <Volume2 className="w-3 h-3" />
                      <span>Haut-Parleur Actif</span>
                    </div>
                  </div>

                  {/* Animated Waveform when speaking or listening */}
                  <div className="my-2 p-2.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-blue-900/40 to-slate-900 border border-blue-800/40 text-center">
                    <div className="flex items-center justify-center space-x-1 h-6">
                      <div className={`w-1 rounded-full bg-cyan-400 transition-all ${isSpeaking || isListening ? 'h-6 animate-pulse' : 'h-1.5'}`} />
                      <div className={`w-1 rounded-full bg-blue-400 transition-all ${isSpeaking || isListening ? 'h-4 animate-pulse delay-75' : 'h-2'}`} />
                      <div className={`w-1 rounded-full bg-cyan-300 transition-all ${isSpeaking || isListening ? 'h-5 animate-pulse delay-150' : 'h-1'}`} />
                      <div className={`w-1 rounded-full bg-blue-500 transition-all ${isSpeaking || isListening ? 'h-3 animate-pulse delay-100' : 'h-2.5'}`} />
                      <div className={`w-1 rounded-full bg-cyan-400 transition-all ${isSpeaking || isListening ? 'h-6 animate-pulse delay-200' : 'h-1'}`} />
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium block mt-1">
                      {isSpeaking ? 'L\'Ami Vocal vous parle...' : isListening ? 'Écoute sans clic active...' : 'Mode Vocal Continu Prêt'}
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs mb-2">
                    {voiceMessages.slice(-4).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-xl ${
                          msg.sender === 'user'
                            ? 'bg-blue-600/40 border border-blue-500/40 ml-4 text-blue-100'
                            : 'bg-slate-900 border border-slate-800 mr-2 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
                          <span className="font-bold">{msg.sender === 'user' ? 'Vous' : 'Ami IA'}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Hands-Free Toggle & Suggestions */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={onToggleHandsFree}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] flex items-center justify-center space-x-1 border cursor-pointer transition-all ${
                          isListening
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500'
                        }`}
                      >
                        {isListening ? <Mic className="w-3 h-3 animate-pulse" /> : <MicOff className="w-3 h-3" />}
                        <span>{isListening ? 'Mains-Libres Activé' : 'Activer Écoute Vocale'}</span>
                      </button>

                      <button
                        onClick={() => onSendMessageToAi(`Donne-moi un conseil amical pour ma région ${user.region} et ma journée.`)}
                        title="Conseil Régional"
                        className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-[10px] cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                    </div>

                    {/* Quick Voice Chips */}
                    <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none text-[9px]">
                      <button 
                        onClick={() => onSendMessageToAi("Comment va ma santé aujourd'hui ?")}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-300 whitespace-nowrap hover:bg-slate-800"
                      >
                        🩺 Bilan santé
                      </button>
                      <button 
                        onClick={() => onSendMessageToAi("Cherche les actualités locales de ma région")}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-300 whitespace-nowrap hover:bg-slate-800"
                      >
                        📰 Infos locales
                      </button>
                      <button 
                        onClick={() => onSendMessageToAi("Raconte-moi une petite histoire drôle")}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-blue-300 whitespace-nowrap hover:bg-slate-800"
                      >
                        😄 Détente
                      </button>
                    </div>

                    {/* Fallback keyboard input if quiet room */}
                    <form onSubmit={handleSendPrompt} className="flex space-x-1">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ou tapez un ordre..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none focus:border-blue-500"
                      />
                      <button type="submit" className="px-2 py-1 bg-blue-600 rounded-lg text-white text-[10px]">
                        <Send className="w-2.5 h-2.5" />
                      </button>
                    </form>

                  </div>

                </div>
              )}

              {/* ================= 3. CONTRÔLE DU TÉLÉPHONE EN DIRECT ================= */}
              {watchState.activeWatchApp === 'phone_control' && (
                <div className="flex flex-col h-full text-left animate-in fade-in duration-200">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      ‹ Accueil
                    </button>
                    <span className="text-[10px] font-bold text-white flex items-center space-x-1">
                      <Smartphone className="w-3 h-3 text-blue-400" />
                      <span>Contrôle Téléphone</span>
                    </span>
                  </div>

                  {/* Status Banner: Even if phone is asleep / off! */}
                  <div className="my-2 p-2 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-between text-[10px]">
                    <div>
                      <div className="font-bold text-white">
                        {phoneState.isScreenOff ? 'Téléphone en Veille (Écran Éteint)' : 'Téléphone Écran Allumé'}
                      </div>
                      <span className="text-slate-400 text-[9px]">Contrôle intégral à distance actif</span>
                    </div>

                    <button
                      onClick={handleTogglePhoneScreen}
                      title="Allumer ou éteindre l'écran du tel"
                      className={`p-1.5 rounded-lg border cursor-pointer ${
                        phoneState.isScreenOff ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-blue-600 text-white border-blue-500'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remote Scrolling & Actions Grid */}
                  <div className="flex-1 space-y-2 overflow-y-auto pr-1">
                    
                    {/* Scrolling phone buttons */}
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Scroller l'Écran du Tel</span>
                        <span className="text-[9px] text-slate-500">Offset: {phoneState.scrollOffset}px</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleScrollPhone('up')}
                          className="py-1.5 px-2 rounded-lg bg-blue-900/40 hover:bg-blue-900/70 text-blue-200 text-[10px] font-bold flex items-center justify-center space-x-1 border border-blue-700/40 cursor-pointer"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Haut</span>
                        </button>
                        <button
                          onClick={() => handleScrollPhone('down')}
                          className="py-1.5 px-2 rounded-lg bg-blue-900/40 hover:bg-blue-900/70 text-blue-200 text-[10px] font-bold flex items-center justify-center space-x-1 border border-blue-700/40 cursor-pointer"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Bas</span>
                        </button>
                      </div>
                    </div>

                    {/* Find Phone / Loud Ring */}
                    <button
                      onClick={handleRingPhone}
                      disabled={isPhoneRinging}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <PhoneCall className={`w-3.5 h-3.5 ${isPhoneRinging ? 'text-amber-400 animate-bounce' : 'text-blue-400'}`} />
                        <span className="text-[11px] font-bold text-white">
                          {isPhoneRinging ? 'Le téléphone sonne...' : 'Faire Sonner le Téléphone'}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400">Sonnerie Forte</span>
                    </button>

                    {/* Camera Remote */}
                    <button
                      onClick={handleSnapCamera}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Camera className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[11px] font-bold text-white">Déclencheur Photo</span>
                      </div>
                      <span className="text-[9px] text-slate-400">Prendre photo</span>
                    </button>

                    {/* Launch WhatsApp / Messages on phone */}
                    <button
                      onClick={() => {
                        voiceService.playChime('click');
                        onUpdatePhoneState((prev) => ({ ...prev, activeApp: 'whatsapp' }));
                        voiceService.speakLoudspeaker('Ouverture de WhatsApp sur votre téléphone !', user.language);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-white">Ouvrir Messages / WhatsApp</span>
                      </div>
                      <span className="text-[9px] text-slate-400">Lancer</span>
                    </button>

                    {/* Music Player Remote */}
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-300 mb-1">
                        <span className="truncate">{phoneState.currentSong.title}</span>
                        <Music className="w-3 h-3 text-blue-400 shrink-0" />
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => {
                            voiceService.playChime('click');
                            onUpdatePhoneState((prev) => ({
                              ...prev,
                              currentSong: { ...prev.currentSong, isPlaying: !prev.currentSong.isPlaying },
                            }));
                          }}
                          className="p-1.5 rounded-full bg-blue-600 text-white cursor-pointer"
                        >
                          {phoneState.currentSong.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => {
                            voiceService.playChime('click');
                            onUpdatePhoneState((prev) => ({
                              ...prev,
                              currentSong: {
                                ...prev.currentSong,
                                title: prev.currentSong.title === 'Aero Symphony No. 5' ? 'Midnight Ambient Waves' : 'Aero Symphony No. 5',
                              },
                            }));
                          }}
                          className="p-1.5 rounded-full bg-slate-800 text-slate-300 cursor-pointer"
                        >
                          <SkipForward className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ================= 4. GOOGLE VOCAL SEARCH APP ================= */}
              {watchState.activeWatchApp === 'google_search' && (
                <div className="flex flex-col h-full text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      ‹ Accueil
                    </button>
                    <span className="text-[10px] font-bold text-white flex items-center space-x-1">
                      <Search className="w-3 h-3 text-sky-400" />
                      <span>Recherche Google Vocale</span>
                    </span>
                  </div>

                  <div className="my-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                    L'Ami Vocal cherche sur Google depuis le téléphone lié et prononce les résultats à voix haute.
                  </div>

                  {/* Search Query Input */}
                  <form onSubmit={handleGoogleSearch} className="space-y-2">
                    <input
                      type="text"
                      value={googleQuery}
                      onChange={(e) => setGoogleQuery(e.target.value)}
                      placeholder="ex: Météo demain ou actualité..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Search className="w-3 h-3" />
                      <span>Chercher & Écouter la Réponse</span>
                    </button>
                  </form>

                  {/* Quick Preset Queries */}
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Suggestions Rapides :</div>
                    <button
                      onClick={() => onSendMessageToAi("Cherche la météo locale sur Google pour ma région", 'search', "Météo locale")}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 text-[10px] border border-slate-800 truncate"
                    >
                      🌤️ Météo de ma région aujourd'hui
                    </button>
                    <button
                      onClick={() => onSendMessageToAi("Cherche les derniers résultats de sport sur Google", 'search', "Résultats sport")}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 text-[10px] border border-slate-800 truncate"
                    >
                      ⚽ Derniers scores sportifs
                    </button>
                  </div>
                </div>
              )}

              {/* ================= 5. SANTÉ & BIOMÉTRIE APP ================= */}
              {watchState.activeWatchApp === 'health' && (
                <div className="flex flex-col h-full text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      ‹ Accueil
                    </button>
                    <span className="text-[10px] font-bold text-white flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-red-400" />
                      <span>Santé & Biométrie</span>
                    </span>
                  </div>

                  <div className="space-y-2 mt-2 overflow-y-auto pr-1">
                    {/* Heart Rate Metric */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase">Fréquence Cardiaque</div>
                        <div className="text-xl font-bold font-mono text-white flex items-baseline space-x-1">
                          <span>{watchState.heartRate}</span>
                          <span className="text-xs text-red-400">BPM</span>
                        </div>
                      </div>
                      <Heart className="w-6 h-6 text-red-500 animate-pulse" />
                    </div>

                    {/* SpO2 and Stress */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-[9px] text-slate-400">Oxygène SpO2</div>
                        <div className="text-sm font-bold font-mono text-cyan-400">{watchState.spo2}%</div>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-[9px] text-slate-400">Niveau Stress</div>
                        <div className="text-sm font-bold text-emerald-400">{watchState.stress}</div>
                      </div>
                    </div>

                    {/* Step goal & sleep */}
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] flex items-center justify-between">
                      <span>Pas : <strong className="text-white font-mono">{watchState.steps}</strong> / {watchState.stepGoal}</span>
                      <span className="text-blue-400">Sommeil: {watchState.sleepHours}</span>
                    </div>

                    {/* Vocal Health Advice Trigger */}
                    <button
                      onClick={() => onSendMessageToAi("Analyse mon état de santé et donne-moi ton conseil amical vocal.", 'health')}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Conseil Vocal de l'Ami IA</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= 6. MÉDICAMENTS & RAPPELS APP ================= */}
              {watchState.activeWatchApp === 'meds' && (
                <div className="flex flex-col h-full text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      ‹ Accueil
                    </button>
                    <span className="text-[10px] font-bold text-white flex items-center space-x-1">
                      <Pill className="w-3 h-3 text-emerald-400" />
                      <span>Médicaments</span>
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1">
                    {medications.map((med) => (
                      <div 
                        key={med.id}
                        className={`p-2 rounded-xl border text-[10px] flex items-center justify-between transition-all ${
                          med.takenToday 
                            ? 'bg-emerald-950/40 border-emerald-800/40 text-slate-300' 
                            : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center space-x-1">
                            <span>{med.name}</span>
                            <span className="text-emerald-400 font-mono">({med.time})</span>
                          </div>
                          <div className="text-[9px] text-slate-400">{med.dosage}</div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleTestMedAlert(med)}
                            title="Faire sonner et prononcer le rappel vocal"
                            className="p-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-300"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onToggleMedsTaken(med.id)}
                            title="Marquer comme pris"
                            className={`p-1 rounded-lg ${med.takenToday ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Med Inline Form */}
                    {showAddMedForm ? (
                      <div className="p-2 rounded-xl bg-slate-900 border border-blue-600/40 space-y-1.5 text-[10px]">
                        <input
                          type="text"
                          placeholder="Nom du médicament"
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          className="w-full bg-black border border-slate-800 rounded px-2 py-1 text-white text-[10px]"
                        />
                        <div className="flex space-x-1">
                          <input
                            type="time"
                            value={newMedTime}
                            onChange={(e) => setNewMedTime(e.target.value)}
                            className="bg-black border border-slate-800 rounded px-2 py-1 text-white text-[10px]"
                          />
                          <input
                            type="text"
                            placeholder="Dosage (ex: 1 pilule)"
                            value={newMedDosage}
                            onChange={(e) => setNewMedDosage(e.target.value)}
                            className="flex-1 bg-black border border-slate-800 rounded px-2 py-1 text-white text-[10px]"
                          />
                        </div>
                        <div className="flex space-x-1 pt-1">
                          <button
                            onClick={() => setShowAddMedForm(false)}
                            className="flex-1 py-1 rounded bg-slate-800 text-slate-300 text-[9px]"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => {
                              if (newMedName) {
                                onAddMedication(newMedName, newMedTime, newMedDosage);
                                setNewMedName('');
                                setShowAddMedForm(false);
                              }
                            }}
                            className="flex-1 py-1 rounded bg-blue-600 text-white font-bold text-[9px]"
                          >
                            Enregistrer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddMedForm(true)}
                        className="w-full py-1.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-blue-500 text-[10px] text-center"
                      >
                        + Programmer un nouveau rappel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ================= 7. PROJETS & SUIVI APP ================= */}
              {watchState.activeWatchApp === 'projects' && (
                <div className="flex flex-col h-full text-left animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      ‹ Accueil
                    </button>
                    <span className="text-[10px] font-bold text-white flex items-center space-x-1">
                      <FolderCheck className="w-3 h-3 text-sky-400" />
                      <span>Projets & Objectifs</span>
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 mt-2 pr-1">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white truncate">{proj.title}</span>
                          <span className="text-cyan-400 font-mono font-bold">{proj.progress}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1.5">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>

                        <div className="text-[9px] text-slate-400">
                          Étape : <strong className="text-slate-300">{proj.nextMilestone}</strong>
                        </div>

                        <button
                          onClick={() => handleTestProjectVoice(proj)}
                          className="mt-1.5 w-full py-1 rounded-lg bg-blue-900/40 hover:bg-blue-900/70 border border-blue-700/40 text-blue-200 text-[9px] font-bold flex items-center justify-center space-x-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>L'Ami IA me donne des nouvelles</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 8. SOS DANGER & RÉSEAU MAILLÉ APP ================= */}
              {watchState.activeWatchApp === 'sos' && (
                <div className="flex flex-col h-full text-center items-center justify-between py-1 animate-in fade-in duration-200">
                  <div className="w-full flex items-center justify-between pb-1 border-b border-slate-800">
                    <button 
                      onClick={() => setApp('home')} 
                      className="text-xs text-blue-400 font-semibold hover:underline"
                    >
                      ‹ Accueil
                    </button>
                    <span className="text-[10px] font-bold text-red-400 flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>SOS Danger Réseau Maillé</span>
                    </span>
                  </div>

                  <div className="my-1">
                    <p className="text-[10px] text-slate-300">
                      Envoie une alerte prioritaire aux téléphones connectés <strong className="text-amber-300">même sans connexion internet et sans Bluetooth</strong> !
                    </p>
                  </div>

                  {/* Big Tactile SOS Button */}
                  <button
                    onClick={onTriggerSos}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 text-white font-black text-xl shadow-xl shadow-red-600/50 flex flex-col items-center justify-center space-y-1 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-red-400/30 animate-sos-pulse"
                  >
                    <AlertTriangle className="w-7 h-7" />
                    <span>SOS</span>
                  </button>

                  <div className="text-[9px] text-slate-400 px-2">
                    Diffusion radio directe (LoRa / Beacon 868MHz). Contacts d'urgence prévenus instantanément.
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Watch OS Dock Indicator */}
            <div className="py-1 px-4 flex items-center justify-center space-x-1.5 bg-black/90 border-t border-slate-900">
              <button 
                onClick={() => setApp('home')} 
                className={`w-5 h-1 rounded-full transition-all ${watchState.activeWatchApp === 'home' ? 'bg-blue-500 w-8' : 'bg-slate-700'}`}
              />
              <button 
                onClick={() => setApp('friend_voice')} 
                className={`w-5 h-1 rounded-full transition-all ${watchState.activeWatchApp === 'friend_voice' ? 'bg-cyan-400 w-8' : 'bg-slate-700'}`}
              />
              <button 
                onClick={() => setApp('phone_control')} 
                className={`w-5 h-1 rounded-full transition-all ${watchState.activeWatchApp === 'phone_control' ? 'bg-blue-500 w-8' : 'bg-slate-700'}`}
              />
            </div>

          </div>

        </div>

      </div>

      {/* Under watch caption */}
      <div className="mt-3 text-center">
        <span className="text-xs font-bold text-slate-700 flex items-center justify-center space-x-1">
          <Watch className="w-3.5 h-3.5 text-blue-600" />
          <span>AeroWatch Ultra (Simulation Réelle avec Audio Loudspeaker)</span>
        </span>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Cliquez sur les applications ou activez le mode vocal pour dialoguer
        </p>
      </div>

    </div>
  );
};
