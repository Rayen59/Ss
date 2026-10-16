import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  MapPin, 
  Heart, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  UserPlus, 
  X, 
  AlertTriangle,
  ArrowLeft,
  Smartphone,
  Share2,
  PhoneCall
} from 'lucide-react';
import { UserProfile, EmergencyContact } from '../types';
import { voiceService } from '../services/voiceService';

interface EmergencyMeshModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: { name: string; relation: string; phone: string }) => void;
}

export const EmergencyMeshModal: React.FC<EmergencyMeshModalProps> = ({
  user,
  isOpen,
  onClose,
  onAddContact,
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Famille');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [alertSentTime] = useState(new Date().toLocaleTimeString());

  if (!isOpen) return null;

  const toggleSiren = () => {
    if (sirenPlaying) {
      voiceService.stopSosSiren();
      setSirenPlaying(false);
    } else {
      voiceService.startSosSiren();
      setSirenPlaying(true);
    }
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    onAddContact({
      name: newContactName.trim(),
      relation: newContactRelation,
      phone: newContactPhone.trim(),
    });
    setNewContactName('');
    setNewContactPhone('');
    setShowAddForm(false);
    voiceService.playChime('connect');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-red-500/40 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Réseau d'Urgence Maillé Autonome</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                  SOS ACTIF
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Diffusion directe peer-to-peer sans Internet, sans 4G et sans Bluetooth
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              voiceService.stopSosSiren();
              setSirenPlaying(false);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technology Highlights Banner */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-200 text-slate-800 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-red-800">
            <Radio className="w-4 h-4 text-red-600 animate-spin" />
            <span>Technologie d'Alerte Révolutionnaire Activée</span>
          </div>
          <p className="text-slate-700 leading-relaxed text-[11px]">
            Même si votre téléphone ou votre montre n'a aucune connexion internet ou aucun signal cellulaire, l'onde de secours radio ultra-courte portée (LoRa / P2P Mesh Beacon) propage l'alerte directement vers tous les smartphones des amis et proches situés à portée.
          </p>
        </div>

        {/* Live Distress Data Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Coordonnées GPS</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              48.8566° N, 2.3522° E
            </div>
            <span className="text-[10px] text-slate-500">{user.region}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-red-600" />
              <span>Rythme Cardiaque</span>
            </div>
            <div className="text-xs font-mono font-bold text-red-600 mt-1">
              108 BPM (Rythme Alerte)
            </div>
            <span className="text-[10px] text-slate-500">Transmis aux proches</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Sirène Sonore de Montre</span>
            </div>
            <button
              onClick={toggleSiren}
              className={`mt-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all ${
                sirenPlaying
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {sirenPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{sirenPlaying ? 'Stopper Sirène' : 'Tester Sirène SOS'}</span>
            </button>
          </div>
        </div>

        {/* Linked Phones & Friends Status ("les amis nécessaires") */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Téléphones d'Amis & Proches Liés ({user.emergencyContacts.length})</span>
            </h3>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200 cursor-pointer transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Ajouter un Proche</span>
            </button>
          </div>

          {/* Add Contact Form Inline */}
          {showAddForm && (
            <form onSubmit={handleCreateContact} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 mb-4 space-y-3 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold text-blue-900">Ajouter un téléphone d'ami lié pour les alertes :</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nom de l'ami ou parent"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Parent">Parent (Père / Mère)</option>
                  <option value="Ami Proche">Ami Proche</option>
                  <option value="Conjoint">Conjoint / Partenaire</option>
                  <option value="Médecin">Médecin traitant</option>
                  <option value="Voisin">Voisin de confiance</option>
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
                >
                  Enregistrer l'Ami
                </button>
              </div>
            </form>
          )}

          {/* Contact Cards List */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {user.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                      <span>{contact.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                        {contact.relation}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Reçu à {alertSentTime}</span>
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Signal Mesh : {contact.meshSignal}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Toutes les données sont retransmises en temps réel sur la montre AeroWatch.
          </span>
          <button
            onClick={() => {
              voiceService.stopSosSiren();
              setSirenPlaying(false);
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Fermer le Moniteur d'Urgence
          </button>
        </div>

      </div>
    </div>
  );
};
