const STORAGE_KEY = "sound";

/** A ~5 ms noise click: a 4 kHz ring over a 2.7 kHz body, kept quiet. */
const CLICK = [
  { frequency: 4000, peak: 0.066, q: 8 },
  { frequency: 2700, peak: 0.033, q: 2 },
];
const ATTACK = 0.001;
const DECAY = 0.0055;
const LENGTH = ATTACK + DECAY + 0.05;

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

type Graph = { context: AudioContext; noise: AudioBuffer };

/** `undefined` until the first click, `null` without Web Audio. */
let graph: Graph | null | undefined;

function setUpGraph(): Graph | null {
  try {
    const context = new AudioContext();
    const noise = context.createBuffer(
      1,
      context.sampleRate,
      context.sampleRate,
    );
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    return { context, noise };
  } catch {
    return null;
  }
}

/** The shared graph, with a resume requested if the browser suspended it. */
function audioGraph() {
  if (graph === undefined) graph = setUpGraph();
  if (graph && graph.context.state !== "running") void graph.context.resume();
  return graph;
}

/** Plays the click, if sound is on. */
export function tap() {
  if (!soundOn) return;
  const audio = audioGraph();
  if (!audio) return;
  const { context, noise } = audio;

  const start = context.currentTime;
  for (const { frequency, peak, q } of CLICK) {
    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + ATTACK);
    // Time constant that brings the level down 60 dB over DECAY.
    gain.gain.setTargetAtTime(0, start + ATTACK, DECAY / (3 * Math.LN10));
    source.connect(filter).connect(gain).connect(context.destination);
    source.start(start, Math.random() * (noise.duration - LENGTH));
    source.stop(start + LENGTH);
  }
}

// Plays the click for every `[data-tap]` element on any page that loads this module.
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
