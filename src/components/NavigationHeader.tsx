import React from 'react';
import { 
  ArrowLeft, 
  Watch, 
  Smartphone, 
  SplitSquareVertical, 
  Settings, 
  ShieldAlert, 
  Mic, 
  Volume2, 
  VolumeX, 
  Bluetooth, 
  LogOut,
  MapPin,
  Sparkles
} from 'lucide-react';
import { UserProfile, WatchState } from '../types';

interface NavigationHeaderProps {
  user: UserProfile;
  watchState: WatchState;
  activeView: 'dashboard' | 'watch_only' | 'phone_only' | 'settings' | 'bluetooth_scan' | 'sos_hub';
  onNavigate: (view: 'dashboard' | 'watch_only' | 'phone_only' | 'settings' | 'bluetooth_scan' | 'sos_hub') => void;
  onGoBack: () => void;
  canGoBack: boolean;
  onLogout: () => void;
  onToggleHandsFree: () => void;
  isListening: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  user,
  watchState,
  activeView,
  onNavigate,
  onGoBack,
  canGoBack,
  onLogout,
  onToggleHandsFree,
  isListening,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Prominent Back Button & App Branding */}
        <div className="flex items-center space-x-3">
          {canGoBack && (
            <button
              onClick={onGoBack}
              title="Retour à la page précédente"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm transition-colors border border-blue-200 shadow-xs cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          )}

          <div 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">AeroWatch</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-600 text-white rounded-md tracking-wider">AI OS</span>
              </div>
              <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Ami vocal & Contrôle Smartphone
              </p>
            </div>
          </div>
        </div>

        {/* Center: View Switcher (Desktop & Tablets) */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'dashboard'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Vue Double (Montre & Tel)</span>
          </button>
          
          <button
            onClick={() => onNavigate('watch_only')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'watch_only'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Watch className="w-3.5 h-3.5" />
            <span>Smartwatch Écran</span>
          </button>

          <button
            onClick={() => onNavigate('phone_only')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'phone_only'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Smartphone Écran</span>
            {!watchState.isConnected && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Verrouillé
              </span>
            )}
          </button>
        </div>

        {/* Right: Bluetooth, Hands-free mic, SOS & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Hands-Free Voice Quick Toggle */}
          <button
            onClick={onToggleHandsFree}
            title={isListening ? "Mode écoute vocale mains-libres actif" : "Activer l'écoute vocale mains-libres"}
            className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isListening
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{isListening ? 'Écoute Active' : 'Parler'}</span>
            {isListening && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-white animate-ping" />
            )}
          </button>

          {/* Bluetooth Status Indicator / Trigger */}
          <button
            onClick={() => onNavigate('bluetooth_scan')}
            title="Connexion Bluetooth Smartwatch"
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              watchState.isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
            }`}
          >
            <Bluetooth className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">
              {watchState.isConnected ? 'Montre Connectée' : 'Lier Montre'}
            </span>
            {watchState.isConnected && (
              <span className="text-[10px] font-bold text-emerald-700 bg-white/70 px-1 rounded">
                {watchState.battery}%
              </span>
            )}
          </button>

          {/* SOS Quick Hub Button */}
          <button
            onClick={() => onNavigate('sos_hub')}
            title="Alerte Danger & Réseau Maillé d'Urgence"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => onNavigate('settings')}
            title="Paramètres de l'Ami IA et Réseau"
            className={`p-2 rounded-xl border transition-colors ${
              activeView === 'settings'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Region & Logout */}
          <div className="hidden lg:flex items-center pl-2 border-l border-slate-200 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1" />
            <span className="font-medium text-slate-700 truncate max-w-[100px]">{user.region}</span>
          </div>

          <button
            onClick={onLogout}
            title="Déconnexion"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
