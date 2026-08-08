// Minimal sound effects via Web Audio API oscillator beeps.
// No audio files needed. Muted by default; toggled via localStorage-free
// in-memory flag controlled from the UI.

let audioCtx = null;
let enabled = false;

const getCtx = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  return audioCtx;
};

const beep = ({ freq = 440, duration = 0.08, type = "sine", gain = 0.05 }) => {
  if (!enabled) return;
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gainNode.gain.value = gain;
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available; fail silently.
  }
};

const sounds = {
  send: () => beep({ freq: 520, duration: 0.08, type: "sine", gain: 0.12 }),
  receive: () => beep({ freq: 340, duration: 0.11, type: "sine", gain: 0.14 }),
  complete: () => {
    beep({ freq: 440, duration: 0.12, gain: 0.14 });
    setTimeout(() => beep({ freq: 660, duration: 0.18, gain: 0.14 }), 110);
  },
};

const setSoundEnabled = (value) => {
  enabled = value;
  if (value) {
    const ctx = getCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    // Audible confirmation so the user immediately hears sound is on.
    beep({ freq: 660, duration: 0.1, gain: 0.15 });
  }
};

const isSoundEnabled = () => enabled;

export { sounds, setSoundEnabled, isSoundEnabled };