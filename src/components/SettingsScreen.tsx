import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Globe2, 
  MapPin, 
  Volume2, 
  Mic, 
  Bell, 
  ShieldCheck, 
  Save, 
  UserPlus, 
  Trash2, 
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { UserProfile, EmergencyContact } from '../types';
import { voiceService } from '../services/voiceService';

interface SettingsScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onGoBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onUpdateUser,
  onGoBack,
}) => {
  const [name, setName] = useState(user.name);
  const [region, setRegion] = useState(user.region);
  const [language, setLanguage] = useState(user.language);
  const [voiceSpeed, setVoiceSpeed] = useState(user.voiceSpeed || 1.0);
  const [vocalNotifications, setVocalNotifications] = useState(user.vocalNotificationsEnabled);
  const [handsFree, setHandsFree] = useState(user.handsFreeVoiceEnabled);
  const [contacts, setContacts] = useState<EmergencyContact[]>(user.emergencyContacts);
  
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Ami Proche');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestVoice = () => {
    const testPhrases: Record<string, string> = {
      'fr-FR': `Bonjour ${name} ! Je suis votre ami AeroWatch. Je parle en direct depuis le haut-parleur de votre montre.`,
      'ar-SA': `أهلاً بك يا ${name} ! أنا صديقك الذكي في الساعة، أتحدث إليك مباشرة عبر مكبر الصوت.`,
      'en-US': `Hello ${name}! I am your AeroWatch companion speaking directly from your watch loudspeaker.`,
      'es-ES': `¡Hola ${name}! Soy tu compañero AeroWatch hablando directamente desde el altavoz de tu reloj.`,
    };
    const phrase = testPhrases[language] || testPhrases['fr-FR'];
    voiceService.speakLoudspeaker(phrase, language, voiceSpeed);
  };

  const handleAddEmergencyContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact: EmergencyContact = {
      id: 'ec_' + Date.now(),
      name: newContactName.trim(),
      relation: newContactRelation,
      phone: newContactPhone.trim(),
      status: 'linked',
      meshSignal: Math.floor(80 + Math.random() * 19),
    };
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    voiceService.playChime('connect');
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    voiceService.playChime('click');
  };

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name,
      region,
      language,
      voiceSpeed,
      vocalNotificationsEnabled: vocalNotifications,
      handsFreeVoiceEnabled: handsFree,
      emergencyContacts: contacts,
    });
    setSavedSuccess(true);
    voiceService.playChime('notification');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onGoBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-200 shadow-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'Accueil</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>Paramètres de l'Écosystème</span>
        </h1>
      </div>

      <div className="space-y-6">
        
        {/* 1. Language & Voice Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Langue & Haut-Parleur de l'Ami Vocal</h2>
              <p className="text-xs text-slate-500">Choisissez la langue que la montre parle en haut-parleur</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Langue Parlée
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="fr-FR">Français (France / Francophonie)</option>
                <option value="ar-SA">العربية (Arabe standard / Régions arabes)</option>
                <option value="en-US">English (United States / Global)</option>
                <option value="es-ES">Español (Espagne / Amérique Latine)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Vitesse de Dictée Vocale ({voiceSpeed}x)
              </label>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer mt-2"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 flex justify-end">
            <button
              onClick={handleTestVoice}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Tester la Voix sur le Haut-Parleur</span>
            </button>
          </div>
        </div>

        {/* 2. Region & Local AI Customization */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Région & Connaissance Locale</h2>
              <p className="text-xs text-slate-500">L'IA de la montre adapte ses conseils à votre localité</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Votre Nom ou Surnom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Votre Ville ou Région
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="ex: Tunis, Paris, Lyon, Casablanca..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* 3. Toggles: Vocal Notifications & Hands-Free Mode */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications & Écoute Automatique</h2>
              <p className="text-xs text-slate-500">Contrôlez les interactions vocales proactives</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Prononciation notifications */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-4">
                <div className="font-bold text-sm text-slate-900">
                  Prononciation Vocale Automatique des Notifications
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  La montre énonce à haute voix les messages et alertes reçus sur le téléphone lorsque vous l'autorisez.
                </div>
              </div>
              <input
                type="checkbox"
                checked={vocalNotifications}
                onChange={(e) => setVocalNotifications(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Hands-Free Voice Mode */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-4">
                <div className="font-bold text-sm text-slate-900">
                  Mode Écoute & Dialogue Mains-Libres (Sans Clic)
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Parlez naturellement sans cliquer sur aucun bouton : la montre écoute en continu et répond en direct.
                </div>
              </div>
              <input
                type="checkbox"
                checked={handsFree}
                onChange={(e) => setHandsFree(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Friends & SOS Mesh Network */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-blue-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Amis & Téléphones Liés d'Urgence</h2>
                <p className="text-xs text-slate-500">Destinataires du réseau maillé de détresse sans connexion</p>
              </div>
            </div>
          </div>

          {/* Add form */}
          <form onSubmit={handleAddEmergencyContact} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase">Ajouter un téléphone d'ami nécessaire :</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Nom du contact"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={newContactRelation}
                onChange={(e) => setNewContactRelation(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Parent">Parent</option>
                <option value="Ami Proche">Ami Proche</option>
                <option value="Conjoint">Conjoint</option>
                <option value="Médecin">Médecin</option>
              </select>
              <input
                type="tel"
                required
                placeholder="Numéro de téléphone"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ajouter l'Ami</span>
              </button>
            </div>
          </form>

          {/* Contacts List */}
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{contact.name} ({contact.relation})</div>
                  <div className="text-[11px] text-slate-500">{contact.phone} • Signal Réseau Maillé : {contact.meshSignal}%</div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Modifications enregistrées avec succès !</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Toutes les modifications sont synchronisées avec la montre</span>
          )}

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 flex items-center space-x-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les Préférences</span>
          </button>
        </div>

      </div>

    </div>
  );
};
