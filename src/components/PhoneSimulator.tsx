import React from 'react';
import { 
  Smartphone, 
  Power, 
  Lock, 
  Unlock, 
  Wifi, 
  Battery, 
  Search, 
  Send, 
  MessageSquare, 
  Music, 
  Camera, 
  ShieldAlert, 
  Bell, 
  ArrowLeft,
  Volume2,
  CheckCheck,
  Play,
  Pause,
  MapPin,
  Heart
} from 'lucide-react';
import { PhoneState, UserProfile, SmartNotification } from '../types';
import { Bluetooth } from 'lucide-react';

interface PhoneSimulatorProps {
  user: UserProfile;
  phoneState: PhoneState;
  notifications: SmartNotification[];
  isWatchConnected: boolean;
  onOpenBluetooth: () => void;
  onTogglePower: () => void;
  onToggleLock: () => void;
  onSetApp: (app: PhoneState['activeApp']) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  user,
  phoneState,
  notifications,
  isWatchConnected,
  onOpenBluetooth,
  onTogglePower,
  onToggleLock,
  onSetApp,
}) => {
  return (
    <div className="flex flex-col items-center select-none">
      
      {/* Outer Phone Hardware Mockup */}
      <div className="relative w-[320px] sm:w-[350px] h-[580px] sm:h-[620px] rounded-[48px] bg-slate-900 p-3 shadow-2xl shadow-blue-950/30 border-4 border-slate-700 ring-1 ring-blue-500/20 flex flex-col items-center">
        
        {/* Hardware Power Button (Right side) */}
        <button
          onClick={onTogglePower}
          title="Bouton Power (Allumer / Éteindre l'écran)"
          className="absolute -right-2 top-28 w-1.5 h-12 rounded-r-md bg-slate-600 hover:bg-blue-500 cursor-pointer transition-colors"
        />

        {/* Hardware Volume Buttons (Left side) */}
        <div className="absolute -left-2 top-24 w-1.5 h-10 rounded-l-md bg-slate-600" />
        <div className="absolute -left-2 top-38 w-1.5 h-10 rounded-l-md bg-slate-600" />

        {/* Dynamic Island / Speaker Pill */}
        <div className="w-24 h-4.5 rounded-full bg-black z-30 flex items-center justify-center space-x-2 px-2 shadow-xs mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700" />
          <div className="w-2 h-2 rounded-full bg-blue-900/60" />
        </div>

        {/* Phone Glass Display Screen */}
        <div className="w-full flex-1 rounded-[38px] bg-slate-100 overflow-hidden relative flex flex-col border border-slate-300/40">
          
          {/* ================= IF WATCH NOT PAIRED VIA BLUETOOTH & IA ================= */}
          {!isWatchConnected ? (
            <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-400 animate-in fade-in duration-300">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-900/30">
                  <Bluetooth className="w-10 h-10 animate-pulse text-blue-500" />
                </div>
                <span className="w-3 h-3 rounded-full bg-amber-400 absolute -top-1 -right-1 ring-2 ring-slate-950 animate-ping" />
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-wider uppercase mb-3">
                Liaison Bluetooth & IA Requise
              </span>

              <h3 className="text-base font-extrabold text-white tracking-tight">
                Écran Android en Attente
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-[240px]">
                Pour votre sécurité, rien ne s'affiche sur la page Android tant que la recherche Bluetooth de la montre et la liaison avec l'IA ne sont pas finalisées.
              </p>

              <button
                onClick={onOpenBluetooth}
                className="mt-6 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/40 flex items-center space-x-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Lancer la Recherche Bluetooth</span>
              </button>

              <div className="mt-6 text-[10px] text-slate-600">
                Protocole BLE 5.4 • Contrôle Intégral Sécurisé
              </div>
            </div>
          ) : phoneState.isScreenOff ? (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center p-6 text-center text-slate-500 animate-in fade-in duration-300">
              <Power className="w-12 h-12 text-slate-700 mb-3" />
              <h3 className="text-sm font-bold text-slate-300">Écran du Smartphone Éteint</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Le smartphone est en veille ou éteint.
              </p>
              <div className="mt-4 px-3 py-2 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-300 text-[11px] font-medium">
                ⚡ Contrôle à distance 100% actif depuis la montre AeroWatch
              </div>
              <button
                onClick={onTogglePower}
                className="mt-6 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Rallumer l'écran
              </button>
            </div>
          ) : (
            <>
              {/* Top Phone Status Bar */}
              <div className="px-5 pt-1.5 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800 bg-white/80 backdrop-blur-xs z-20 border-b border-slate-200/50">
                <span>09:41</span>
                <div className="flex items-center space-x-1.5 text-slate-700">
                  <Wifi className="w-3 h-3 text-blue-600" />
                  <span className="text-[10px] font-mono">5G</span>
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px]">{phoneState.battery}%</span>
                </div>
              </div>

              {/* Ringing Overlay if watch triggered Phone Finder */}
              {phoneState.ringing && (
                <div className="absolute inset-0 z-40 bg-blue-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center animate-bounce">
                  <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-2xl mb-4 animate-ping">
                    <Volume2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black">Recherche Téléphone Activée !</h3>
                  <p className="text-xs text-blue-100 mt-1">
                    La montre AeroWatch fait sonner votre smartphone à plein volume
                  </p>
                </div>
              )}

              {/* Main Phone Viewport */}
              <div 
                className="flex-1 overflow-y-auto bg-slate-50 transition-all duration-300 relative"
                style={{ transform: `translateY(-${Math.min(phoneState.scrollOffset % 300, 200)}px)` }}
              >
                
                {/* 1. WHATSAPP / MESSAGES VIEW */}
                {phoneState.activeApp === 'whatsapp' && (
                  <div className="min-h-full bg-emerald-50/50 flex flex-col">
                    <div className="bg-emerald-700 text-white p-3 flex items-center space-x-2">
                      <button onClick={() => onSetApp('launcher')} className="cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xs">
                        K
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold leading-none">Karim (Ami)</div>
                        <div className="text-[10px] text-emerald-200">En ligne • Contrôlé par la montre</div>
                      </div>
                    </div>

                    <div className="flex-1 p-3 space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 mr-8 text-slate-800 shadow-2xs">
                        Salut Alexandre ! Tu viens à quelle heure pour la réunion du projet ?
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-600 text-white ml-8 shadow-2xs">
                        Message dicté et envoyé depuis ma montre connectée AeroWatch ! J'arrive dans 10 minutes.
                        <div className="flex justify-end text-[9px] text-emerald-200 mt-1">
                          <CheckCheck className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CAMERA REMOTE VIEW */}
                {phoneState.activeApp === 'camera' && (
                  <div className="w-full h-full bg-slate-900 text-white flex flex-col justify-between p-4 text-center">
                    <div className="flex justify-between items-center text-xs">
                      <button onClick={() => onSetApp('launcher')} className="p-1 rounded-full bg-white/20">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-xs bg-red-600 px-2 py-0.5 rounded-full">LIVE PREVIEW</span>
                    </div>

                    <div className="my-auto py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-3xl">
                      <Camera className="w-12 h-12 text-sky-400 mb-2 animate-pulse" />
                      <span className="text-xs text-slate-300">Objectif 4K Ouvert</span>
                      <span className="text-[10px] text-slate-500 mt-1">Déclenchement instantané depuis la montre</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {phoneState.lastCapturedPhoto ? '✓ Dernière photo synchronisée' : 'En attente du déclencheur...'}
                    </div>
                  </div>
                )}

                {/* 3. DEFAULT HOME LAUNCHER VIEW */}
                {phoneState.activeApp === 'launcher' && (
                  <div className="p-4 space-y-4">
                    
                    {/* Welcome Widget */}
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-blue-100 font-medium">{user.region}</div>
                          <div className="text-xl font-bold mt-0.5">Bonjour, {user.name}</div>
                        </div>
                        <Smartphone className="w-8 h-8 text-blue-200" />
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/20 text-xs flex items-center justify-between">
                        <span>Liaison Watch : <strong className="font-bold text-white">Active</strong></span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">Synchronisé</span>
                      </div>
                    </div>

                    {/* Active Remote Scroll Notice */}
                    {phoneState.scrollOffset > 0 && (
                      <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-[11px] flex items-center justify-between">
                        <span>Défilement géré par la montre ({phoneState.scrollOffset}px)</span>
                      </div>
                    )}

                    {/* Apps Grid */}
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <button 
                        onClick={() => onSetApp('whatsapp')}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 mt-1">Messages</span>
                      </button>

                      <button 
                        onClick={() => onSetApp('camera')}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-800/20 group-hover:scale-105 transition-transform">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 mt-1">Photo</span>
                      </button>

                      <button 
                        onClick={() => {
                          onSetApp('launcher');
                        }}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                          <Music className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 mt-1">Musique</span>
                      </button>

                      <button 
                        onClick={() => {
                          // Trigger phone search
                        }}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                          <Search className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 mt-1">Google</span>
                      </button>
                    </div>

                    {/* Music Bar */}
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <Music className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-800 truncate">{phoneState.currentSong.title}</div>
                          <div className="text-[10px] text-slate-500">{phoneState.currentSong.artist}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-blue-600">
                        {phoneState.currentSong.isPlaying ? 'Lecture...' : 'Pause'}
                      </div>
                    </div>

                    {/* Incoming Notifications Card */}
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Notifications du Smartphone</span>
                        <Bell className="w-3.5 h-3.5 text-blue-600" />
                      </div>

                      <div className="space-y-2">
                        {notifications.slice(0, 3).map((notif) => (
                          <div key={notif.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-bold text-slate-700">{notif.sender}</span>
                              <span>{notif.timestamp}</span>
                            </div>
                            <div className="text-slate-600 text-[11px] mt-0.5">{notif.message}</div>
                            {user.vocalNotificationsEnabled && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-blue-600 font-semibold mt-1">
                                <Volume2 className="w-2.5 h-2.5" />
                                <span>Prononciation vocale automatique autorisée</span>
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Bottom Phone Navigation Bar */}
              <div className="h-5 bg-white flex items-center justify-center border-t border-slate-200">
                <button 
                  onClick={() => onSetApp('launcher')}
                  className="w-24 h-1 rounded-full bg-slate-400 hover:bg-slate-600 transition-colors cursor-pointer"
                />
              </div>
            </>
          )}

        </div>

      </div>

      {/* Under Phone Caption & Power Toggle */}
      <div className="mt-3 text-center flex flex-col items-center">
        <span className="text-xs font-bold text-slate-700 flex items-center space-x-1">
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>Smartphone Lié (Aperçu Temps Réel)</span>
        </span>
        <button
          onClick={onTogglePower}
          className="mt-1 text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
        >
          {phoneState.isScreenOff ? '⚡ Allumer l\'écran du téléphone' : '💤 Mettre l\'écran en veille / éteindre'}
        </button>
      </div>

    </div>
  );
};
