/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  UserProfile, 
  WatchState, 
  PhoneState, 
  MedicationReminder, 
  ProjectTrack, 
  VoiceMessage, 
  SmartNotification 
} from './types';
import { NavigationHeader } from './components/NavigationHeader';
import { AuthScreen } from './components/AuthScreen';
import { BluetoothPairing } from './components/BluetoothPairing';
import { SmartwatchSimulator } from './components/SmartwatchSimulator';
import { PhoneSimulator } from './components/PhoneSimulator';
import { EmergencyMeshModal } from './components/EmergencyMeshModal';
import { SettingsScreen } from './components/SettingsScreen';
import { voiceService } from './services/voiceService';
import { 
  Watch, 
  Smartphone, 
  Sparkles, 
  Volume2, 
  ShieldAlert, 
  Radio, 
  Heart, 
  Pill, 
  FolderCheck, 
  ArrowLeft,
  Search,
  Bell
} from 'lucide-react';

export default function App() {
  // 1. User Profile State (Stored in localStorage or initial null for first entry)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('aerowatch_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // 2. Navigation View Stack for reliable "Previous Page" Back Arrow
  // Starts directly on Bluetooth scan so the user connects watch & AI before Android unlocks
  const [viewHistory, setViewHistory] = useState<Array<'dashboard' | 'watch_only' | 'phone_only' | 'settings' | 'bluetooth_scan' | 'sos_hub'>>(['bluetooth_scan']);
  const activeView = viewHistory[viewHistory.length - 1] || 'bluetooth_scan';

  // 3. Smartwatch State (Starts disconnected until Bluetooth search and AI liaison are done)
  const [watchState, setWatchState] = useState<WatchState>({
    isConnected: false,
    deviceName: 'AeroWatch Ultra AI (BLE 5.4)',
    macAddress: 'E4:95:6E:8A:2B:44',
    battery: 92,
    isCharging: false,
    bluetoothRssi: -42,
    volume: 85,
    heartRate: 74,
    steps: 6840,
    stepGoal: 10000,
    spo2: 99,
    stress: 'Normal',
    sleepHours: '7h 35m',
    isSpeakerActive: false,
    activeWatchApp: 'home',
  });

  // 4. Phone State
  const [phoneState, setPhoneState] = useState<PhoneState>({
    isScreenOff: false,
    isLocked: false,
    battery: 84,
    wifiConnected: true,
    cellularConnected: true,
    activeApp: 'launcher',
    scrollOffset: 0,
    currentSong: {
      title: 'Aero Symphony No. 5',
      artist: 'AeroSound Studio',
      isPlaying: true,
      duration: '3:45',
      currentTime: '1:20',
    },
    cameraActive: false,
    ringing: false,
  });

  // 5. Medications & Reminders
  const [medications, setMedications] = useState<MedicationReminder[]>([
    { id: 'med_1', name: 'Vitamine D3 & Zinc', dosage: '1 gélule le matin', time: '08:00', takenToday: true },
    { id: 'med_2', name: 'Antibiotique Amoxicilline', dosage: '500mg au repas', time: '13:00', takenToday: true },
    { id: 'med_3', name: 'Oméga 3 & Magnésium', dosage: '2 capsules', time: '20:30', takenToday: false },
  ]);

  // 6. Projects & Goals
  const [projects, setProjects] = useState<ProjectTrack[]>([
    {
      id: 'proj_1',
      title: 'Lancement du Projet Start-up AI',
      description: 'Déploiement de la solution connectée et présentation investisseurs.',
      progress: 75,
      nextMilestone: 'Validation du prototype fonctionnel',
      lastAiUpdate: 'Avancement excellent cette semaine',
    },
    {
      id: 'proj_2',
      title: 'Entraînement Semi-Marathon',
      description: 'Programme 12 semaines pour courir 21 km.',
      progress: 60,
      nextMilestone: 'Course de 15 km ce dimanche',
      lastAiUpdate: 'Fréquence cardiaque au repos en amélioration',
    },
  ]);

  // 7. Conversation Messages with Watch Friend
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([
    {
      id: 'vm_init',
      sender: 'watch_friend',
      text: "Salut mon ami ! Je suis ton compagnon AeroWatch. Ton téléphone est connecté et sous mon contrôle. Je suis prêt à t'écouter et à t'aider !",
      timestamp: '14:00',
    },
  ]);

  // 8. Notifications
  const [notifications, setNotifications] = useState<SmartNotification[]>([
    {
      id: 'notif_1',
      app: 'whatsapp',
      sender: 'Karim (Ami)',
      message: 'Tu as vu la météo pour ce week-end ? On maintient la sortie vélo ?',
      timestamp: '14:01',
      read: false,
      spoken: false,
      priority: 'normal',
    },
    {
      id: 'notif_2',
      app: 'weather',
      sender: 'Météo Régionale',
      message: 'Ciel dégagé, 22°C dans votre région. Idéal pour vos pas aujourd’hui !',
      timestamp: '13:45',
      read: true,
      spoken: true,
      priority: 'normal',
    },
  ]);

  // 9. Voice & Hands-Free States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // Sync user profile to localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('aerowatch_user', JSON.stringify(user));
      } catch (e) {
        // ignore
      }
    }
  }, [user]);

  // Simulate subtle live biometric heart rate pulse variations
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setWatchState((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newBpm = Math.max(62, Math.min(95, prev.heartRate + delta));
        return { ...prev, heartRate: newBpm };
      });
    }, 4000);
    return () => clearInterval(pulseInterval);
  }, []);

  // Navigation handlers
  const navigateTo = (view: 'dashboard' | 'watch_only' | 'phone_only' | 'settings' | 'bluetooth_scan' | 'sos_hub') => {
    voiceService.playChime('click');
    if (view === 'sos_hub') {
      setIsSosModalOpen(true);
      return;
    }
    setViewHistory((prev) => [...prev, view]);
  };

  const handleGoBack = () => {
    voiceService.playChime('click');
    setViewHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  // Login handler
  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    setViewHistory(['bluetooth_scan']);
    voiceService.playChime('connect');
    const welcomeText = `Bienvenue ${newUser.name} ! Veuillez rechercher votre montre en Bluetooth pour initialiser l'IA et déverrouiller votre téléphone Android.`;
    voiceService.speakLoudspeaker(welcomeText, newUser.language);
  };

  const handleLogout = () => {
    voiceService.playChime('click');
    voiceService.stopSpeaking();
    voiceService.stopListening();
    setIsListening(false);
    setUser(null);
    localStorage.removeItem('aerowatch_user');
  };

  // Toggle Hands-Free voice recognition
  const handleToggleHandsFree = useCallback(() => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      voiceService.playChime('click');
    } else {
      const lang = user?.language || 'fr-FR';
      const success = voiceService.startListening(
        lang,
        (transcript) => {
          handleSendMessageToAi(transcript, 'companion');
        },
        (err) => {
          console.warn('Voice recognition notice:', err);
        }
      );
      if (success) {
        setIsListening(true);
      }
    }
  }, [isListening, user]);

  // Core AI Companion Interaction (Server-side Gemini 3.8 Flash via /api/ai/friend)
  const handleSendMessageToAi = async (text: string, mode: string = 'companion', searchQuery: string = '') => {
    if (!text.trim()) return;

    // Add User Message to History
    const userMsg: VoiceMessage = {
      id: 'vm_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setVoiceMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/ai/friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userLanguage: user?.language || 'fr-FR',
          userRegion: user?.region || 'Paris, France',
          userName: user?.name || 'Ami',
          healthContext: {
            bpm: watchState.heartRate,
            steps: watchState.steps,
            stress: watchState.stress,
            spo2: `${watchState.spo2}%`,
            sleep: watchState.sleepHours,
          },
          activeReminders: medications.filter((m) => !m.takenToday),
          activeProjects: projects,
          mode,
          searchQuery,
        }),
      });

      const data = await response.json();
      const aiReply = data.speechText || "Je suis là avec toi ! Tout fonctionne sur ta montre.";

      // Add AI reply to history
      const aiMsg: VoiceMessage = {
        id: 'vm_ai_' + Date.now(),
        sender: 'watch_friend',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        spokenLoudly: true,
      };
      setVoiceMessages((prev) => [...prev, aiMsg]);

      // Speak loudly over the Smartwatch Loudspeaker!
      setIsSpeaking(true);
      setWatchState((prev) => ({ ...prev, isSpeakerActive: true }));

      await voiceService.speakLoudspeaker(
        aiReply,
        user?.language || 'fr-FR',
        user?.voiceSpeed || 1.0,
        () => {
          setIsSpeaking(true);
        },
        () => {
          setIsSpeaking(false);
          setWatchState((prev) => ({ ...prev, isSpeakerActive: false }));
        }
      );

      // Execute Phone Action if triggered by the voice command
      if (data.phoneAction) {
        if (data.phoneAction.type === 'SEND_MESSAGE') {
          setPhoneState((prev) => ({ ...prev, activeApp: 'whatsapp' }));
        } else if (data.phoneAction.type === 'GOOGLE_SEARCH') {
          setPhoneState((prev) => ({ ...prev, activeApp: 'launcher' }));
        }
      }
    } catch (err) {
      console.error('Failed to get AI friend response:', err);
      const fallback = "Je suis avec toi ! Ta montre et ton téléphone sont connectés.";
      voiceService.speakLoudspeaker(fallback, user?.language || 'fr-FR');
    }
  };

  // SOS Emergency Trigger
  const handleTriggerSos = () => {
    setIsSosModalOpen(true);
    voiceService.playChime('notification');
    const speech = "Alerte de danger envoyée au réseau maillé de secours ! Tous les téléphones liés sont notifiés immédiatement.";
    voiceService.speakLoudspeaker(speech, user?.language || 'fr-FR');
  };

  // Medication status toggler
  const handleToggleMedsTaken = (id: string) => {
    voiceService.playChime('click');
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, takenToday: !m.takenToday } : m))
    );
  };

  const handleAddMedication = (name: string, time: string, dosage: string) => {
    voiceService.playChime('connect');
    const newMed: MedicationReminder = {
      id: 'med_' + Date.now(),
      name,
      time,
      dosage,
      takenToday: false,
    };
    setMedications((prev) => [...prev, newMed]);
  };

  // Bluetooth pairing handler
  const handleDevicePaired = (device: { name: string; mac: string; battery: number; rssi: number }) => {
    setWatchState((prev) => ({
      ...prev,
      isConnected: true,
      deviceName: device.name,
      macAddress: device.mac,
      battery: device.battery,
      bluetoothRssi: device.rssi,
    }));
    setViewHistory(['dashboard']);
    const greet = `Liaison Bluetooth et IA confirmée avec ${device.name} ! L'écran de votre téléphone Android est déverrouillé et prêt au contrôle intégral.`;
    voiceService.speakLoudspeaker(greet, user?.language || 'fr-FR');
  };

  const handleDisconnect = () => {
    voiceService.playChime('click');
    setWatchState((prev) => ({ ...prev, isConnected: false }));
  };

  // If user is not yet logged in / authenticated: Show AuthScreen
  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/70 via-white to-blue-50/40 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Global Navigation Header with Always Accessible Back Arrow */}
      <NavigationHeader
        user={user}
        watchState={watchState}
        activeView={activeView}
        onNavigate={navigateTo}
        onGoBack={handleGoBack}
        canGoBack={viewHistory.length > 1}
        onLogout={handleLogout}
        onToggleHandsFree={handleToggleHandsFree}
        isListening={isListening}
      />

      {/* 2. Main Dynamic Content Body */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* ================= VIEW: BLUETOOTH PAIRING ================= */}
        {activeView === 'bluetooth_scan' && (
          <BluetoothPairing
            isConnected={watchState.isConnected}
            onDevicePaired={handleDevicePaired}
            onDisconnect={handleDisconnect}
            onGoBack={handleGoBack}
          />
        )}

        {/* ================= VIEW: SETTINGS ================= */}
        {activeView === 'settings' && (
          <SettingsScreen
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            onGoBack={handleGoBack}
          />
        )}

        {/* ================= VIEW: DASHBOARD (DUAL VIEW: WATCH & PHONE) ================= */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Quick Overview Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/15 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-inner">
                  <Watch className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      Écosystème AeroWatch Connecté
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-blue-800">
                      En Direct
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100 mt-1">
                    Contrôle total du smartphone depuis la montre (même éteint) • Ami vocal IA en haut-parleur • SOS sans réseau
                  </p>
                </div>
              </div>

              {/* Action buttons on banner */}
              <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={handleToggleHandsFree}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center space-x-2 cursor-pointer transition-all ${
                    isListening
                      ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/40 animate-pulse'
                      : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isListening ? 'Parlez sans cliquer' : 'Activer Voix Continue'}</span>
                </button>

                <button
                  onClick={handleTriggerSos}
                  className="px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/30 flex items-center space-x-1.5 cursor-pointer transition-all"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOS Danger</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Dual Simulator: Smartwatch + Smartphone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
              
              {/* Left Column: Interactive Smartwatch OS */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-blue-100 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Watch className="w-4 h-4 text-blue-600" />
                      <span>Montre Connectée au Poignet</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      Haut-Parleur & Micro Actifs
                    </span>
                  </div>

                  <SmartwatchSimulator
                    user={user}
                    watchState={watchState}
                    phoneState={phoneState}
                    medications={medications}
                    projects={projects}
                    voiceMessages={voiceMessages}
                    isListening={isListening}
                    isSpeaking={isSpeaking}
                    onUpdateWatchState={setWatchState}
                    onUpdatePhoneState={setPhoneState}
                    onSendMessageToAi={handleSendMessageToAi}
                    onTriggerSos={handleTriggerSos}
                    onToggleMedsTaken={handleToggleMedsTaken}
                    onAddMedication={handleAddMedication}
                    onToggleHandsFree={handleToggleHandsFree}
                  />
                </div>
              </div>

              {/* Right Column: Smartphone Linked & Controlled */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-blue-100 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Smartphone Relié à Distance</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      phoneState.isScreenOff ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {phoneState.isScreenOff ? 'Écran Éteint (Veille)' : 'Écran Allumé'}
                    </span>
                  </div>

                  <PhoneSimulator
                    user={user}
                    phoneState={phoneState}
                    notifications={notifications}
                    isWatchConnected={watchState.isConnected}
                    onOpenBluetooth={() => navigateTo('bluetooth_scan')}
                    onTogglePower={() => setPhoneState((p) => ({ ...p, isScreenOff: !p.isScreenOff }))}
                    onToggleLock={() => setPhoneState((p) => ({ ...p, isLocked: !p.isLocked }))}
                    onSetApp={(app) => setPhoneState((p) => ({ ...p, activeApp: app }))}
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= VIEW: WATCH FOCUS ONLY ================= */}
        {activeView === 'watch_only' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-100 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                AeroWatch OS (Plein Écran)
              </h2>
            </div>

            <SmartwatchSimulator
              user={user}
              watchState={watchState}
              phoneState={phoneState}
              medications={medications}
              projects={projects}
              voiceMessages={voiceMessages}
              isListening={isListening}
              isSpeaking={isSpeaking}
              onUpdateWatchState={setWatchState}
              onUpdatePhoneState={setPhoneState}
              onSendMessageToAi={handleSendMessageToAi}
              onTriggerSos={handleTriggerSos}
              onToggleMedsTaken={handleToggleMedsTaken}
              onAddMedication={handleAddMedication}
              onToggleHandsFree={handleToggleHandsFree}
            />
          </div>
        )}

        {/* ================= VIEW: PHONE FOCUS ONLY ================= */}
        {activeView === 'phone_only' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-100 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Smartphone Lié (Plein Écran)
              </h2>
            </div>

            <PhoneSimulator
              user={user}
              phoneState={phoneState}
              notifications={notifications}
              isWatchConnected={watchState.isConnected}
              onOpenBluetooth={() => navigateTo('bluetooth_scan')}
              onTogglePower={() => setPhoneState((p) => ({ ...p, isScreenOff: !p.isScreenOff }))}
              onToggleLock={() => setPhoneState((p) => ({ ...p, isLocked: !p.isLocked }))}
              onSetApp={(app) => setPhoneState((p) => ({ ...p, activeApp: app }))}
            />
          </div>
        )}

      </main>

      {/* 3. Emergency SOS Mesh Modal (Accessible anytime) */}
      <EmergencyMeshModal
        user={user}
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        onAddContact={(newC) => {
          const contact = {
            id: 'ec_' + Date.now(),
            name: newC.name,
            relation: newC.relation,
            phone: newC.phone,
            status: 'linked' as const,
            meshSignal: 95,
          };
          setUser({ ...user, emergencyContacts: [...user.emergencyContacts, contact] });
        }}
      />

    </div>
  );
}
