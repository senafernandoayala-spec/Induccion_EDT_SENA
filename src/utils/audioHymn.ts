/**
 * Web Audio API synthesizer for the SENA Hymn march melody.
 * Provides a clean, zero-dependency institutional melody playback
 * with play, pause, and progress events.
 */

class HymnPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timeoutIds: number[] = [];
  private onStanzaChangeCallback?: (stanzaIndex: number) => void;
  private onEndCallback?: () => void;

  // Notes and durations for the anthem motive (Estudiantes del SENA adelante...)
  // [frequency in Hz, duration in seconds, stanza index]
  private notes: Array<{ freq: number; duration: number; stanza: number }> = [
    // Coro: "Estudiantes del SENA adelante..."
    { freq: 261.63, duration: 0.45, stanza: 0 }, // C4
    { freq: 329.63, duration: 0.45, stanza: 0 }, // E4
    { freq: 392.00, duration: 0.70, stanza: 0 }, // G4
    { freq: 523.25, duration: 0.90, stanza: 0 }, // C5
    { freq: 493.88, duration: 0.45, stanza: 0 }, // B4
    { freq: 440.00, duration: 0.45, stanza: 0 }, // A4
    { freq: 392.00, duration: 0.90, stanza: 0 }, // G4
    // "...por Colombia luchad con amor"
    { freq: 349.23, duration: 0.45, stanza: 0 }, // F4
    { freq: 392.00, duration: 0.45, stanza: 0 }, // G4
    { freq: 440.00, duration: 0.70, stanza: 0 }, // A4
    { freq: 392.00, duration: 0.45, stanza: 0 }, // G4
    { freq: 349.23, duration: 0.45, stanza: 0 }, // F4
    { freq: 329.63, duration: 1.10, stanza: 0 }, // E4
    // "...con el ánimo noble y constante"
    { freq: 293.66, duration: 0.45, stanza: 0 }, // D4
    { freq: 329.63, duration: 0.45, stanza: 0 }, // E4
    { freq: 349.23, duration: 0.70, stanza: 0 }, // F4
    { freq: 392.00, duration: 0.45, stanza: 0 }, // G4
    { freq: 440.00, duration: 0.45, stanza: 0 }, // A4
    { freq: 493.88, duration: 0.90, stanza: 0 }, // B4
    // "...semejante en la lucha al valor"
    { freq: 523.25, duration: 0.60, stanza: 0 }, // C5
    { freq: 493.88, duration: 0.45, stanza: 0 }, // B4
    { freq: 440.00, duration: 0.45, stanza: 0 }, // A4
    { freq: 392.00, duration: 0.60, stanza: 0 }, // G4
    { freq: 523.25, duration: 1.40, stanza: 0 }, // C5 (resolución)

    // Estrofa I: "En la forja del SENA se forman..."
    { freq: 392.00, duration: 0.45, stanza: 1 }, // G4
    { freq: 440.00, duration: 0.45, stanza: 1 }, // A4
    { freq: 493.88, duration: 0.70, stanza: 1 }, // B4
    { freq: 523.25, duration: 0.90, stanza: 1 }, // C5
    { freq: 440.00, duration: 0.45, stanza: 1 }, // A4
    { freq: 392.00, duration: 0.90, stanza: 1 }, // G4
    // "...hombres libres que saben triunfar"
    { freq: 349.23, duration: 0.45, stanza: 1 }, // F4
    { freq: 329.63, duration: 0.45, stanza: 1 }, // E4
    { freq: 293.66, duration: 0.70, stanza: 1 }, // D4
    { freq: 261.63, duration: 1.20, stanza: 1 }, // C4
  ];

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(onStanzaChange?: (index: number) => void, onEnd?: () => void) {
    this.stop();
    this.init();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.onStanzaChangeCallback = onStanzaChange;
    this.onEndCallback = onEnd;

    let cumulativeTime = 0.1;

    this.notes.forEach((note, index) => {
      const startTime = this.ctx!.currentTime + cumulativeTime;
      const duration = note.duration;

      // Schedule audio note with warm brass/chime timbre
      this.playHarmonicNote(note.freq, startTime, duration);

      // Schedule UI callback for stanza highlighting
      const timeoutMs = cumulativeTime * 1000;
      const tId = window.setTimeout(() => {
        if (this.isPlaying && this.onStanzaChangeCallback) {
          this.onStanzaChangeCallback(note.stanza);
        }
      }, timeoutMs);
      this.timeoutIds.push(tId);

      cumulativeTime += duration + 0.08;

      // Handle final note finish
      if (index === this.notes.length - 1) {
        const finalId = window.setTimeout(() => {
          this.isPlaying = false;
          if (this.onEndCallback) this.onEndCallback();
        }, (cumulativeTime + 0.5) * 1000);
        this.timeoutIds.push(finalId);
      }
    });
  }

  private playHarmonicNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm octave overtone for brass/chime presence
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const masterGain = 0.22;
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(masterGain, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);
  }

  public stop() {
    this.isPlaying = false;
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
    if (this.ctx && this.ctx.state !== 'closed') {
      // Re-create context or suspend
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const hymnPlayer = new HymnPlayer();
