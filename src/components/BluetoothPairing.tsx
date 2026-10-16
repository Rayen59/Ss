import React, { useState } from 'react';
import { 
  Bluetooth, 
  Watch, 
  RefreshCw, 
  CheckCircle2, 
  Wifi, 
  Smartphone, 
  Radio, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  Battery,
  Sparkles
} from 'lucide-react';
import { voiceService } from '../services/voiceService';

interface BluetoothPairingProps {
  isConnected: boolean;
  onDevicePaired: (device: { name: string; mac: string; battery: number; rssi: number }) => void;
  onDisconnect: () => void;
  onGoBack: () => void;
}

interface DiscoveredDevice {
  id: string;
  name: string;
  mac: string;
  battery: number;
  rssi: number;
  type: string;
  isAiReady: boolean;
}

export const BluetoothPairing: React.FC<BluetoothPairingProps> = ({
  isConnected,
  onDevicePaired,
  onDisconnect,
  onGoBack,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [pairingDevice, setPairingDevice] = useState<DiscoveredDevice | null>(null);
  const [pairingStep, setPairingStep] = useState<'idle' | 'pairing' | 'ai_handshake' | 'confirm_pin' | 'success'>('idle');
  const [pinCode, setPinCode] = useState('739 421');

  const [availableDevices, setAvailableDevices] = useState<DiscoveredDevice[]>([
    {
      id: 'dev_1',
      name: 'AeroWatch Ultra AI (BLE 5.4)',
      mac: 'E4:95:6E:8A:2B:44',
      battery: 92,
      rssi: -42,
      type: 'Smartwatch Haute Précision',
      isAiReady: true,
    },
    {
      id: 'dev_2',
      name: 'AeroPulse Chrono Active',
      mac: 'C8:72:11:F5:60:19',
      battery: 78,
      rssi: -61,
      type: 'Smartwatch Sport & Santé',
      isAiReady: true,
    },
    {
      id: 'dev_3',
      name: 'Titan Watch Pro AI',
      mac: 'A0:44:98:32:01:E7',
      battery: 65,
      rssi: -74,
      type: 'Smartwatch Titane',
      isAiReady: true,
    },
  ]);

  const handleStartScan = async () => {
    setIsScanning(true);
    voiceService.playChime('click');

    // Attempt Web Bluetooth API if available in browser
    if (typeof navigator !== 'undefined' && (navigator as any).bluetooth) {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'heart_rate'],
        });
        if (device) {
          const customDev: DiscoveredDevice = {
            id: device.id,
            name: device.name || 'Montre Bluetooth Détectée',
            mac: 'BT:' + Math.random().toString(16).slice(2, 10).toUpperCase(),
            battery: 89,
            rssi: -45,
            type: 'Périphérique Bluetooth Réel',
            isAiReady: true,
          };
          setAvailableDevices((prev) => [customDev, ...prev]);
        }
      } catch (err) {
        // User cancelled or simulated mode
        console.log('Bluetooth request fallback to simulated devices:', err);
      }
    }

    // Simulated scan cycle
    setTimeout(() => {
      setIsScanning(false);
    }, 1800);
  };

  const handleInitiatePair = (device: DiscoveredDevice) => {
    setPairingDevice(device);
    setPairingStep('pairing');
    voiceService.playChime('click');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`;
    setPinCode(formattedCode);

    // Sequence: 1. Bluetooth Connection -> 2. AI Liaison -> 3. PIN Confirmation
    setTimeout(() => {
      setPairingStep('ai_handshake');
      voiceService.playChime('notification');
    }, 1200);

    setTimeout(() => {
      setPairingStep('confirm_pin');
      voiceService.playChime('notification');
    }, 2400);
  };

  const handleConfirmPairing = () => {
    if (!pairingDevice) return;
    setPairingStep('success');
    voiceService.playChime('connect');

    setTimeout(() => {
      onDevicePaired({
        name: pairingDevice.name,
        mac: pairingDevice.mac,
        battery: pairingDevice.battery,
        rssi: pairingDevice.rssi,
      });
      setPairingStep('idle');
      setPairingDevice(null);
    }, 1400);
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

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Protocole Bluetooth :
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            BLE 5.4 Ultra-Low Latency
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-blue-900/5 border border-blue-100">
        
        {/* Notice: Android Page locked until Bluetooth & AI link */}
        {!isConnected && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
            <span className="p-1 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
              <Bluetooth className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <span className="font-bold text-sm block text-blue-950">
                Liaison Obligatoire avant Affichage Android
              </span>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                La recherche se fait via Bluetooth pour localiser les montres connectées à proximité. 
                <strong className="text-blue-900 font-bold"> Rien ne s'affichera sur la page de votre téléphone Android</strong> tant que la recherche et la liaison avec l'IA ne sont pas finalisées.
              </p>
            </div>
          </div>
        )}

        {/* Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              isConnected ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-blue-600 shadow-blue-500/20'
            }`}>
              <Bluetooth className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isConnected ? 'Montre Connectée en Direct' : 'Recherche Bluetooth Smartwatch'}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {isConnected 
                  ? 'Votre smartphone est entièrement lié et contrôlable depuis la montre'
                  : 'Recherchez et associez votre montre pour activer le contrôle intégral et l\'Ami Vocal'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            {isConnected ? (
              <button
                onClick={onDisconnect}
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm border border-red-200 transition-colors cursor-pointer"
              >
                Dissocier la Montre
              </button>
            ) : (
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-75"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Scan en cours...' : 'Lancer le Scan Bluetooth'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scan Radar animation if scanning */}
        {isScanning && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 animate-ping absolute opacity-50" />
              <div className="w-20 h-20 rounded-full bg-blue-500/20 animate-pulse-ring absolute" />
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white relative z-10 shadow-lg shadow-blue-600/30">
                <Radio className="w-8 h-8 animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Recherche des montres à proximité...</h3>
            <p className="text-xs text-slate-500 mt-1">Assurez-vous que le Bluetooth de votre montre est allumé</p>
          </div>
        )}

        {/* Device List */}
        {!isScanning && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              <span>Appareils Détectés</span>
              <span>Force du Signal</span>
            </div>

            {availableDevices.map((device) => (
              <div
                key={device.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-300 transition-all gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs">
                    <Watch className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {device.name}
                      </span>
                      {device.isAiReady && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Ami Vocal IA</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span>MAC: {device.mac}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Battery className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{device.battery}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-700">
                      {device.rssi} dBm
                    </div>
                    <div className="flex items-center space-x-0.5 justify-end mt-1">
                      <div className="w-1 h-2 bg-blue-600 rounded-xs" />
                      <div className="w-1 h-3 bg-blue-600 rounded-xs" />
                      <div className="w-1 h-4 bg-blue-600 rounded-xs" />
                      <div className={`w-1 h-5 rounded-xs ${device.rssi > -50 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleInitiatePair(device)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                  >
                    Associer & Lier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Pairing Confirmation Modal */}
      {pairingStep !== 'idle' && pairingDevice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-blue-100 text-center animate-in fade-in zoom-in-95 duration-200">
            
            {pairingStep === 'pairing' && (
              <div className="py-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Bluetooth className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Établissement du tunnel Bluetooth 5.4...</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Liaison sans fil avec <span className="font-semibold text-blue-700">{pairingDevice.name}</span>
                </p>
                <div className="mt-4 text-[11px] text-slate-400">
                  L'écran Android reste verrouillé jusqu'à la fin de la liaison
                </div>
              </div>
            )}

            {pairingStep === 'ai_handshake' && (
              <div className="py-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Initialisation de l'Ami Vocal IA...</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Synchronisation de l'IA, du haut-parleur et des commandes distantes du smartphone.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1.5 text-xs text-blue-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span>Négociation du protocole de contrôle Android</span>
                </div>
              </div>
            )}

            {pairingStep === 'confirm_pin' && (
              <div>
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Confirmez l'Appairage Sécurisé</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Vérifiez que ce code s'affiche bien sur l'écran de votre montre :
                </p>

                {/* Big PIN Display */}
                <div className="my-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-3xl font-extrabold text-blue-800 tracking-widest font-mono">
                    {pinCode}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setPairingStep('idle');
                      setPairingDevice(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmPairing}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    Lier & Déverrouiller Android
                  </button>
                </div>
              </div>
            )}

            {pairingStep === 'success' && (
              <div className="py-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Liaison Bluetooth & IA Réussie !</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-2">
                  ✓ La page Android est maintenant déverrouillée et sous votre contrôle.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  L'Ami Vocal IA est activé au poignet.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
