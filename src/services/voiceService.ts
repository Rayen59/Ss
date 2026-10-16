/**
 * Voice & Sound Synthesizer Service for Smartwatch Loudspeaker & Speech Recognition
 */

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;
  private isListening: boolean = false;
  private sirenOscillator: OscillatorNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = false;
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Speak text loudly via the Smartwatch virtual loudspeaker
   */
  public speakLoudspeaker(
    text: string,
    lang: string = 'fr-FR',
    rate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('SpeechSynthesis is not supported on this device');
        resolve();
        return;
      }

      // Cancel previous utterance
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1.05; // Slightly bright, friendly watch persona

      // Try finding the best matching voice for the language
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)) && (v.name.includes('Natural') || v.name.includes('Google') || v.default));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        if (onEnd) onEnd();
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Stop ongoing speech
   */
  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Start listening hands-free via mic
   */
  public startListening(
    lang: string,
    onResult: (transcript: string) => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.recognition) {
      console.warn('SpeechRecognition not available in browser');
      return false;
    }

    try {
      this.recognition.lang = lang;
      this.recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.trim();
        if (transcript) {
          onResult(transcript);
        }
      };

      this.recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        if (onError) onError(err);
      };

      this.recognition.onend = () => {
        // In continuous hands-free mode, restart if still flagged as listening
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // ignore
          }
        }
      };

      this.isListening = true;
      this.recognition.start();
      this.playChime('listen_start');
      return true;
    } catch (e) {
      console.warn('Error starting speech recognition:', e);
      return false;
    }
  }

  /**
   * Stop listening
   */
  public stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Play realistic audio cues using Web Audio API
   */
  public playChime(type: 'connect' | 'notification' | 'meds' | 'listen_start' | 'click' | 'phone_ring'): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (type === 'connect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'notification' || type === 'meds') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.12); // D6
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'listen_start') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'phone_ring') {
        for (let i = 0; i < 2; i++) {
          const t = now + i * 0.4;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.setValueAtTime(480, t + 0.1);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
        }
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Start Emergency SOS Siren
   */
  public startSosSiren(): void {
    try {
      this.stopSosSiren();
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      // Oscillate frequency like an emergency beacon
      const startTime = ctx.currentTime;
      for (let i = 0; i < 30; i++) {
        const cycle = startTime + i * 0.6;
        osc.frequency.setValueAtTime(600, cycle);
        osc.frequency.linearRampToValueAtTime(1200, cycle + 0.3);
        osc.frequency.linearRampToValueAtTime(600, cycle + 0.6);
      }

      osc.start();
      this.sirenOscillator = osc;
    } catch (e) {
      console.warn('SOS siren error:', e);
    }
  }

  public stopSosSiren(): void {
    if (this.sirenOscillator) {
      try {
        this.sirenOscillator.stop();
        this.sirenOscillator.disconnect();
      } catch (e) {
        // ignore
      }
      this.sirenOscillator = null;
    }
  }
}

export const voiceService = new VoiceService();
