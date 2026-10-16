export interface UserProfile {
  id: string;
  name: string;
  email: string;
  region: string;
  language: 'fr-FR' | 'ar-SA' | 'en-US' | 'es-ES';
  voiceSpeed: number; // 0.8 - 1.2
  vocalNotificationsEnabled: boolean;
  handsFreeVoiceEnabled: boolean;
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  status: 'linked' | 'pending';
  meshSignal: number; // %
}

export interface WatchState {
  isConnected: boolean;
  deviceName: string;
  macAddress: string;
  battery: number;
  isCharging: boolean;
  bluetoothRssi: number; // -30 to -90 dBm
  volume: number; // 0 to 100
  heartRate: number; // bpm
  steps: number;
  stepGoal: number;
  spo2: number; // %
  stress: 'Faible' | 'Normal' | 'Élevé';
  sleepHours: string;
  isSpeakerActive: boolean;
  activeWatchApp: 'home' | 'friend_voice' | 'phone_control' | 'health' | 'meds' | 'projects' | 'sos' | 'google_search';
}

export interface PhoneState {
  isScreenOff: boolean;
  isLocked: boolean;
  battery: number;
  wifiConnected: boolean;
  cellularConnected: boolean;
  activeApp: 'launcher' | 'whatsapp' | 'google' | 'music' | 'camera' | 'messages';
  scrollOffset: number;
  currentSong: {
    title: string;
    artist: string;
    isPlaying: boolean;
    duration: string;
    currentTime: string;
  };
  cameraActive: boolean;
  lastCapturedPhoto?: string;
  ringing: boolean;
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string; // e.g. "08:00", "20:00"
  takenToday: boolean;
  notes?: string;
}

export interface ProjectTrack {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 - 100%
  nextMilestone: string;
  lastAiUpdate: string;
}

export interface SmartNotification {
  id: string;
  app: 'whatsapp' | 'sms' | 'health' | 'system' | 'weather';
  sender: string;
  message: string;
  timestamp: string;
  read: boolean;
  spoken: boolean;
  priority: 'normal' | 'urgent';
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'watch_friend';
  text: string;
  timestamp: string;
  spokenLoudly?: boolean;
}
