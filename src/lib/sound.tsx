const STORAGE_KEY = "sound";

/** The opening click of cuelume's press-theme tap: a 4 kHz ring over a 2.7 kHz body, about 5 ms long. */
const CLICK = [
  { frequency: 4000, peak: 0.53, q: 8 },
  { frequency: 2700, peak: 0.265, q: 2 },
];
const ATTACK = 0.001;
const DECAY = 0.0055;
/** Half the level cuelume plays the same click at, so it stays subtle. */
const VOLUME = 0.125;

let soundOn = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
})();

export const isSoundOn = () => soundOn;

export function setSound(on: boolean) {
  soundOn = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Sound still follows `on` until the page reloads.
  }
}

let context: AudioContext | undefined;
let noise: AudioBuffer | undefined;

function resumed() {
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

/** Plays the click, if sound is on. */
export function tap() {
  if (!soundOn) return;
  const audio = resumed();
  if (!noise) {
    noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }

  const start = audio.currentTime;
  const output = audio.createGain();
  output.gain.value = VOLUME;
  output.connect(audio.destination);
  for (const { frequency, peak, q } of CLICK) {
    const source = audio.createBufferSource();
    source.buffer = noise;
    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + ATTACK);
    gain.gain.setTargetAtTime(0, start + ATTACK, DECAY / (3 * Math.LN10));
    source.connect(filter).connect(gain).connect(output);
    source.start(start, Math.random() * (noise.duration - 0.1));
    source.stop(start + ATTACK + DECAY + 0.05);
  }
}

if (typeof window !== "undefined") {
  document.addEventListener(
    "click",
    (event) => {
      if (event.target instanceof Element && event.target.closest("[data-tap]"))
        tap();
    },
    { capture: true },
  );
}
