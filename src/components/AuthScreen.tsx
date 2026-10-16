import React, { useState } from 'react';
import { 
  Watch, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Smartphone, 
  Volume2, 
  ArrowRight, 
  MapPin, 
  Globe2, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User as UserIcon,
  Zap
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('Alexandre');
  const [email, setEmail] = useState('alexandre@aerowatch.io');
  const [password, setPassword] = useState('••••••••');
  const [region, setRegion] = useState('Paris, France');
  const [language, setLanguage] = useState<'fr-FR' | 'ar-SA' | 'en-US' | 'es-ES'>('fr-FR');
  const [vocalNotifications, setVocalNotifications] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: name.trim() || 'Ami AeroWatch',
      email: email.trim() || 'user@aerowatch.io',
      region: region.trim() || 'Paris, France',
      language,
      voiceSpeed: 1.0,
      vocalNotificationsEnabled: vocalNotifications,
      handsFreeVoiceEnabled: true,
      emergencyContacts: [
        { id: 'ec_1', name: 'Papa (Urgence)', relation: 'Père', phone: '+33 6 12 34 56 78', status: 'linked', meshSignal: 94 },
        { id: 'ec_2', name: 'Sarah (Amie Proche)', relation: 'Amie', phone: '+33 6 98 76 54 32', status: 'linked', meshSignal: 89 },
        { id: 'ec_3', name: 'Dr. Laurent (Médecin)', relation: 'Médecin', phone: '+33 1 45 67 89 00', status: 'linked', meshSignal: 76 },
      ],
    };
    onLogin(newUser);
  };

  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      id: 'usr_demo',
      name: 'Alexandre',
      email: 'alexandre@aerowatch.io',
      region: 'Paris, France',
      language: 'fr-FR',
      voiceSpeed: 1.0,
      vocalNotificationsEnabled: true,
      handsFreeVoiceEnabled: true,
      emergencyContacts: [
        { id: 'ec_1', name: 'Papa (Urgence)', relation: 'Père', phone: '+33 6 12 34 56 78', status: 'linked', meshSignal: 94 },
        { id: 'ec_2', name: 'Sarah (Amie Proche)', relation: 'Amie', phone: '+33 6 98 76 54 32', status: 'linked', meshSignal: 89 },
        { id: 'ec_3', name: 'Dr. Laurent (Médecin)', relation: 'Médecin', phone: '+33 1 45 67 89 00', status: 'linked', meshSignal: 76 },
      ],
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Top Brand Hero */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 text-white shadow-xl shadow-blue-500/25 mb-4 ring-4 ring-blue-100">
          <Watch className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AeroWatch <span className="text-blue-600">OS</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 font-medium">
          L'écosystème Smartwatch intelligent en bleu & blanc
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl shadow-blue-900/10 rounded-3xl border border-blue-100">
          
          {/* Tab Selection */}
          <div className="flex bg-blue-50/80 p-1 rounded-2xl mb-6 border border-blue-100">
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Créer un Compte
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Se Connecter
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nom ou Prénom
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Alexandre ou Rayen"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Adresse Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mot de Passe
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Region / City for AI personalization */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Votre Ville / Région (pour la météo et conseils locaux de la montre)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="ex: Tunis, Paris, Casablanca, Alger, Lyon..."
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                La montre intelligente parle de l'actualité et météo de votre région.
              </p>
            </div>

            {/* Preferred Voice Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Langue Parlée par la Smartwatch (Haut-parleur)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                  <Globe2 className="w-4 h-4" />
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all font-medium text-slate-800"
                >
                  <option value="fr-FR">Français (France / Francophonie)</option>
                  <option value="ar-SA">العربية (Arabe standard / Régions arabes)</option>
                  <option value="en-US">English (United States / Global)</option>
                  <option value="es-ES">Español (Espagne / Amérique Latine)</option>
                </select>
              </div>
            </div>

            {/* Vocal notifications checkbox */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                id="vocal_notifs"
                type="checkbox"
                checked={vocalNotifications}
                onChange={(e) => setVocalNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="vocal_notifs" className="text-xs text-slate-700 font-medium cursor-pointer">
                Autoriser la prononciation vocale automatique des notifications sur la montre
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:from-blue-800 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <span>{isSignUp ? 'Créer mon Compte & Lancer' : 'Se Connecter'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Instant Demo Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>Tester Immédiatement en Mode Démo</span>
              </button>
            </div>

          </form>

          {/* Capabilities Highlights */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Fonctionnalités Incluses dans AeroWatch :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Connexion Bluetooth & Liaison Smartphone</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Contrôle total du tel (même écran éteint)</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Ami IA vocal autonome (parle sans clic)</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>SOS Réseau Maillé sans Bluetooth ni 4G</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
