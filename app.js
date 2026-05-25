/* GymBuddy Log v4 — PB tracker with rep range progressive overload */

const BODY_PARTS = [
  { id: 'chest', label: 'Chest', color: '#B5F23D' },
  { id: 'back', label: 'Back', color: '#7DD3FC' },
  { id: 'shoulders', label: 'Shoulders', color: '#FCD34D' },
  { id: 'biceps', label: 'Biceps', color: '#F472B6' },
  { id: 'triceps', label: 'Triceps', color: '#FB7185' },
  { id: 'forearms', label: 'Forearms', color: '#38BDF8' },
  { id: 'legs', label: 'Legs', color: '#A78BFA' },
  { id: 'core', label: 'Core', color: '#FB923C' },
];

const SEED_EXERCISES = [
  { name: 'Bench Press', bodyPart: 'chest' },
  { name: 'Incline Bench Press', bodyPart: 'chest' },
  { name: 'Chest Press Machine', bodyPart: 'chest' },
  { name: 'Pec Deck', bodyPart: 'chest' },
  { name: 'Cable Fly', bodyPart: 'chest' },
  { name: 'Dumbbell Press', bodyPart: 'chest' },
  { name: 'Lat Pulldown', bodyPart: 'back' },
  { name: 'Seated Cable Row', bodyPart: 'back' },
  { name: 'Deadlift', bodyPart: 'back' },
  { name: 'Pull-Up', bodyPart: 'back' },
  { name: 'T-Bar Row', bodyPart: 'back' },
  { name: 'Bent Over Row', bodyPart: 'back' },
  { name: 'Overhead Press', bodyPart: 'shoulders' },
  { name: 'Lateral Raise', bodyPart: 'shoulders' },
  { name: 'Shoulder Press Machine', bodyPart: 'shoulders' },
  { name: 'Face Pull', bodyPart: 'shoulders' },
  { name: 'Rear Delt Fly', bodyPart: 'shoulders' },
  { name: 'Barbell Curl', bodyPart: 'biceps' },
  { name: 'Tricep Pushdown', bodyPart: 'triceps' },
  { name: 'Hammer Curl', bodyPart: 'biceps' },
  { name: 'Tricep Extension', bodyPart: 'triceps' },
  { name: 'Preacher Curl', bodyPart: 'biceps' },
  { name: 'Incline Dumbbell Curl', bodyPart: 'biceps' },
  { name: 'Cable Curl', bodyPart: 'biceps' },
  { name: 'Overhead Tricep Extension', bodyPart: 'triceps' },
  { name: 'Skull Crusher', bodyPart: 'triceps' },
  { name: 'Close-Grip Bench Press', bodyPart: 'triceps' },
  { name: 'Wrist Curl', bodyPart: 'forearms' },
  { name: 'Reverse Wrist Curl', bodyPart: 'forearms' },
  { name: 'Reverse Curl', bodyPart: 'forearms' },
  { name: 'Farmer Carry', bodyPart: 'forearms' },
  { name: 'Wrist Roller', bodyPart: 'forearms' },
  { name: 'Back Squat', bodyPart: 'legs' },
  { name: 'Leg Press', bodyPart: 'legs' },
  { name: 'Leg Curl', bodyPart: 'legs' },
  { name: 'Leg Extension', bodyPart: 'legs' },
  { name: 'Calf Raise', bodyPart: 'legs' },
  { name: 'Romanian Deadlift', bodyPart: 'legs' },
  { name: 'Hip Thrust', bodyPart: 'legs' },
  { name: 'Cable Crunch', bodyPart: 'core' },
  { name: 'Hanging Leg Raise', bodyPart: 'core' },
  { name: 'Plank', bodyPart: 'core' },
  { name: 'Ab Wheel', bodyPart: 'core' },
];

const REP_RANGE_PRESETS = [
  { id: 'strength', label: 'Strength', range: '1-5', min: 1, max: 5, hint: 'Heavy compound lifts' },
  { id: 'power', label: 'Power', range: '3-6', min: 3, max: 6, hint: 'Explosive movements' },
  { id: 'compound', label: 'Compound', range: '6-10', min: 6, max: 10, hint: 'Squats, deadlifts, presses' },
  { id: 'hypertrophy', label: 'Hypertrophy', range: '8-12', min: 8, max: 12, hint: 'Muscle growth, general use' },
  { id: 'machines', label: 'Machines', range: '10-15', min: 10, max: 15, hint: 'Machine exercises' },
  { id: 'isolation', label: 'Isolation', range: '12-20', min: 12, max: 20, hint: 'Curls, raises, extensions' },
  { id: 'endurance', label: 'Endurance', range: '15-25', min: 15, max: 25, hint: 'Light weight, high reps' },
];

const STORAGE_KEY = 'gymbuddy-log-v2';
const OLD_STORAGE_KEY = 'gymbuddy-log-v1';
const IOS_HINT_KEY = 'gymbuddy-ios-hint-shown';
const EXPLAINER_DISMISS_KEY = 'gymbuddy-explainer-dismissed';
const EXPLAINER_OPEN_KEY = 'gymbuddy-explainer-open';
const INTRO_SEEN_KEY = 'gymbuddy-intro-seen';
const WEIGHT_UNIT_KEY = 'gymbuddy-weight-unit';
const TIMER_NOTIFICATION_ASKED_KEY = 'gymbuddy-timer-notification-asked';
const TIMER_ALERT_VOLUME_KEY = 'gymbuddy-timer-alert-volume';
const LBS_PER_KG = 2.2046226218;
const TIMER_ALERT_VOLUMES = {
  low: { label: 'Low', peak: 0.2, vibration: [180, 100, 180, 100, 240] },
  medium: { label: 'Med', peak: 0.34, vibration: [220, 90, 220, 90, 300] },
  high: { label: 'High', peak: 0.55, vibration: [280, 90, 280, 90, 420] },
};
const TIMER_PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '45s', seconds: 45 },
  { label: '1m', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '2:30', seconds: 150 },
  { label: '3m', seconds: 180 },
];
const EQUIPMENT_OPTIONS = ['Dumbbell', 'Barbell', 'Cable', 'Rope', 'Straight Bar', 'EZ Bar'];

/* ---------- Utilities ---------- */
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtFullDate = (iso) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const bp = (id) => BODY_PARTS.find(b => b.id === id) || BODY_PARTS[0];
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const kgToLb = (kg) => Math.round((Number(kg) * LBS_PER_KG) * 10) / 10;
const lbToKg = (lb) => Math.round((Number(lb) / LBS_PER_KG) * 10) / 10;
const formatInputWeight = (kg, unit) => unit === 'lbs' ? kgToLb(kg) : kg;
const validBodyPartIds = () => new Set(BODY_PARTS.map(b => b.id));
const formatTimerTime = (ms) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

function inferArmBodyPart(exerciseName = '') {
  const name = exerciseName.toLowerCase();
  if (name.includes('tricep') || name.includes('skull') || name.includes('dip')) return 'triceps';
  if (name.includes('forearm') || name.includes('wrist') || name.includes('reverse curl')) return 'forearms';
  return 'biceps';
}

function normalizeExerciseBodyParts(exercises = []) {
  const valid = validBodyPartIds();
  return exercises.map(ex => {
    if (valid.has(ex.bodyPart)) return ex;
    if (ex.bodyPart === 'arms') return { ...ex, bodyPart: inferArmBodyPart(ex.name) };
    return { ...ex, bodyPart: 'chest' };
  });
}

function addMissingSeedExercises(exercises = []) {
  const existing = new Set(exercises.map(ex => `${ex.name.toLowerCase()}|${ex.bodyPart}`));
  const additions = SEED_EXERCISES
    .filter(ex => !existing.has(`${ex.name.toLowerCase()}|${ex.bodyPart}`))
    .map(ex => ({ id: uid(), ...ex, repRange: null, createdAt: new Date().toISOString() }));
  return additions.length ? [...exercises, ...additions] : exercises;
}

function getTimerAlertVolume() {
  try {
    const saved = localStorage.getItem(TIMER_ALERT_VOLUME_KEY);
    return TIMER_ALERT_VOLUMES[saved] ? saved : 'low';
  } catch (e) {
    return 'low';
  }
}

function setTimerAlertVolume(value) {
  if (!TIMER_ALERT_VOLUMES[value]) return;
  try { localStorage.setItem(TIMER_ALERT_VOLUME_KEY, value); } catch (e) {}
}

/* ---------- Photo compression ---------- */
async function compressPhoto(file, maxDim = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

/* ---------- State ---------- */
let state = { exercises: [], entries: [] };
let currentView = 'log';
let viewContext = {};
let isFreshInstall = false;
let timerState = {
  status: 'idle',
  durationMs: 0,
  remainingMs: 0,
  endAt: 0,
  intervalId: null,
  wakeLock: null,
};

function loadState() {
  // Try v2 first
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      state.exercises = addMissingSeedExercises(normalizeExerciseBodyParts(state.exercises || []));
      state.entries = state.entries || [];
      isFreshInstall = false;
      saveState();
      return;
    }
  } catch (e) {}
  // Try migrating from v1
  try {
    const rawOld = localStorage.getItem(OLD_STORAGE_KEY);
    if (rawOld) {
      const old = JSON.parse(rawOld);
      state = {
        exercises: addMissingSeedExercises(normalizeExerciseBodyParts((old.exercises || []).map(ex => ({ ...ex, repRange: ex.repRange || null })))),
        entries: old.entries || [],
      };
      saveState();
      isFreshInstall = false;
      showToast('Data migrated. Set rep ranges to start tracking.');
      return;
    }
  } catch (e) {}
  // Fresh install
  state = {
    exercises: SEED_EXERCISES.map(e => ({ id: uid(), ...e, repRange: null, createdAt: new Date().toISOString() })),
    entries: [],
  };
  isFreshInstall = true;
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    showToast('Storage full. Export and delete old entries.', 'error');
  }
}

/* ---------- Suggestion logic ---------- */
/* Returns { kind: 'too_heavy'|'low_end'|'mid_range'|'ceiling'|'too_light'|'no_range', text, action? } */
function getSuggestion(reps, repRange) {
  if (!repRange) return { kind: 'no_range', text: 'No rep range set for this exercise.' };
  const { min, max } = repRange;
  if (reps < min) {
    return {
      kind: 'too_heavy',
      text: `Below your ${min}-${max} range. Drop the weight, or update your rep range.`,
      action: 'edit_range',
    };
  }
  if (reps === min) {
    return {
      kind: 'low_end',
      text: `You hit the low end of your ${min}-${max} range. Push for one more rep next session.`,
    };
  }
  if (reps > min && reps < max) {
    return {
      kind: 'mid_range',
      text: `Solid. You're inside your ${min}-${max} range. Push for one more rep next session.`,
    };
  }
  if (reps === max) {
    return {
      kind: 'ceiling',
      text: `Ceiling hit. Bump the weight by ~2.5kg next session and drop back to ${min} reps.`,
    };
  }
  // reps > max
  return {
    kind: 'too_light',
    text: `Past your ${min}-${max} range. Time to increase the weight next session.`,
  };
}

/* ---------- Toast ---------- */
function showToast(msg, kind = 'success') {
  const root = document.getElementById('toast-root');
  root.innerHTML = '';
  const toast = document.createElement('div');
  toast.className = 'toast' + (kind === 'error' ? ' error' : '');
  const icon = kind === 'error'
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  toast.innerHTML = `${icon}<span>${escapeHtml(msg)}</span>`;
  root.appendChild(toast);
  setTimeout(() => { if (root.contains(toast)) root.removeChild(toast); }, 2800);
}

/* ---------- Rest timer ---------- */
function getTimerRemainingMs() {
  if (timerState.status === 'running') return Math.max(0, timerState.endAt - Date.now());
  return Math.max(0, timerState.remainingMs);
}

async function requestTimerWakeLock() {
  if (!('wakeLock' in navigator) || timerState.status !== 'running') return;
  try {
    timerState.wakeLock = await navigator.wakeLock.request('screen');
    timerState.wakeLock.addEventListener('release', () => {
      timerState.wakeLock = null;
    });
  } catch (e) {}
}

function releaseTimerWakeLock() {
  if (!timerState.wakeLock) return;
  timerState.wakeLock.release().catch(() => {});
  timerState.wakeLock = null;
}

function playTimerAlarm() {
  const volume = TIMER_ALERT_VOLUMES[getTimerAlertVolume()] || TIMER_ALERT_VOLUMES.low;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, now);
      compressor.knee.setValueAtTime(18, now);
      compressor.ratio.setValueAtTime(8, now);
      compressor.attack.setValueAtTime(0.003, now);
      compressor.release.setValueAtTime(0.18, now);
      compressor.connect(ctx.destination);
      [0, 0.36, 0.72, 1.08, 1.44, 1.8].forEach((offset) => {
        const lowOsc = ctx.createOscillator();
        const highOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        lowOsc.type = 'square';
        highOsc.type = 'sine';
        lowOsc.frequency.setValueAtTime(720, now + offset);
        highOsc.frequency.setValueAtTime(960, now + offset);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now + offset);
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(volume.peak, now + offset + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.24);

        lowOsc.connect(filter);
        highOsc.connect(filter);
        filter.connect(gain);
        gain.connect(compressor);
        lowOsc.start(now + offset);
        highOsc.start(now + offset);
        lowOsc.stop(now + offset + 0.26);
        highOsc.stop(now + offset + 0.26);
      });
      setTimeout(() => ctx.close().catch(() => {}), 2400);
    }
  } catch (e) {}

  if ('vibrate' in navigator) {
    navigator.vibrate([280, 90, 280, 90, 280, 90, 280, 90, 420]);
  }
}

function canUseTimerNotifications() {
  return 'Notification' in window;
}

function hasAskedTimerNotificationPermission() {
  try { return localStorage.getItem(TIMER_NOTIFICATION_ASKED_KEY) === '1'; }
  catch (e) { return true; }
}

function markTimerNotificationPermissionAsked() {
  try { localStorage.setItem(TIMER_NOTIFICATION_ASKED_KEY, '1'); }
  catch (e) {}
}

async function requestTimerNotificationPermission() {
  if (!canUseTimerNotifications() || Notification.permission !== 'default') {
    markTimerNotificationPermissionAsked();
    return canUseTimerNotifications() ? Notification.permission : 'unsupported';
  }
  markTimerNotificationPermissionAsked();
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'denied';
  }
}

async function showRestTimerNotification() {
  if (!canUseTimerNotifications() || Notification.permission !== 'granted') return;

  const title = 'Rest complete';
  const options = {
    body: 'Time for your next set',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: 'gymbuddy-rest-timer',
    renotify: true,
    requireInteraction: false,
  };

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'GYMBUDDY_REST_TIMER_DONE',
          title,
          options,
        });
        return;
      }
      await registration.showNotification(title, options);
      return;
    }
  } catch (e) {}

  try { new Notification(title, options); } catch (e) {}
}

function startTimerTicker() {
  clearInterval(timerState.intervalId);
  timerState.intervalId = setInterval(() => {
    if (timerState.status !== 'running') return;
    timerState.remainingMs = getTimerRemainingMs();
    if (timerState.remainingMs <= 0) {
      finishRestTimer();
      return;
    }
    updateTimerReadouts();
  }, 250);
}

function startRestTimer(seconds) {
  const durationMs = seconds * 1000;
  timerState.status = 'running';
  timerState.durationMs = durationMs;
  timerState.remainingMs = durationMs;
  timerState.endAt = Date.now() + durationMs;
  startTimerTicker();
  requestTimerWakeLock();
  updateTimerReadouts();
  renderTimerDock();
}

function pauseRestTimer() {
  if (timerState.status !== 'running') return;
  timerState.remainingMs = getTimerRemainingMs();
  timerState.status = 'paused';
  timerState.endAt = 0;
  clearInterval(timerState.intervalId);
  releaseTimerWakeLock();
  updateTimerReadouts();
  renderTimerDock();
}

function resumeRestTimer() {
  if (timerState.status !== 'paused') return;
  timerState.status = 'running';
  timerState.endAt = Date.now() + timerState.remainingMs;
  startTimerTicker();
  requestTimerWakeLock();
  updateTimerReadouts();
  renderTimerDock();
}

function restartRestTimer() {
  if (!timerState.durationMs) return;
  startRestTimer(timerState.durationMs / 1000);
}

function stopRestTimer() {
  clearInterval(timerState.intervalId);
  releaseTimerWakeLock();
  timerState = {
    status: 'idle',
    durationMs: 0,
    remainingMs: 0,
    endAt: 0,
    intervalId: null,
    wakeLock: null,
  };
  updateTimerReadouts();
  renderTimerDock();
}

function finishRestTimer() {
  clearInterval(timerState.intervalId);
  releaseTimerWakeLock();
  timerState.status = 'done';
  timerState.remainingMs = 0;
  timerState.endAt = 0;
  playTimerAlarm();
  showRestTimerNotification();
  document.body.classList.add('timer-finished-alert');
  setTimeout(() => document.body.classList.remove('timer-finished-alert'), 2200);
  showToast('Rest timer done');
  updateTimerReadouts();
  renderTimerDock();
  if (currentView === 'timer') render();
}

function updateTimerReadouts() {
  const remainingMs = getTimerRemainingMs();
  const label = timerState.status === 'done'
    ? 'Rest complete'
    : timerState.status === 'paused'
      ? 'Paused'
      : timerState.status === 'running'
        ? 'Rest running'
        : 'Ready when you are';
  const timeText = timerState.status === 'idle'
    ? formatTimerTime(TIMER_PRESETS[4].seconds * 1000)
    : formatTimerTime(remainingMs || timerState.durationMs);
  const progress = timerState.durationMs ? 1 - (remainingMs / timerState.durationMs) : 0;

  document.querySelectorAll('[data-timer-time]').forEach(el => { el.textContent = timeText; });
  document.querySelectorAll('[data-timer-label]').forEach(el => { el.textContent = label; });
  document.querySelectorAll('[data-timer-progress]').forEach(el => {
    el.style.setProperty('--timer-progress', Math.max(0, Math.min(1, progress)));
  });
}

function renderTimerDock() {
  let dock = document.getElementById('rest-timer-dock');
  if (timerState.status === 'idle') {
    if (dock) dock.remove();
    return;
  }
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'rest-timer-dock';
    document.body.appendChild(dock);
  }
  dock.innerHTML = `
    <button class="timer-dock-main" type="button" data-open-timer>
      <span class="timer-dock-icon">${ICONS.timer}</span>
      <span>
        <span class="timer-dock-label" data-timer-label></span>
        <strong data-timer-time></strong>
      </span>
    </button>
    <button class="timer-dock-stop" type="button" data-stop-timer aria-label="Stop rest timer">${ICONS.x}</button>
  `;
  dock.querySelector('[data-open-timer]').addEventListener('click', () => switchView('timer'));
  dock.querySelector('[data-stop-timer]').addEventListener('click', () => {
    stopRestTimer();
    if (currentView === 'timer') render();
  });
  updateTimerReadouts();
}

/* ---------- Icons ---------- */
const ICONS = {
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  xLg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
  back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  chev: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  imageLg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  image: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  target: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  chart: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  calendar: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  timer: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9 2h6"/></svg>',
  play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  rotate: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
  trophy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 13 20.24 13 22"/><path d="M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 11 20.24 11 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  arrowUp: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  arrowDown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  range: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  edit: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  spark: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></svg>',
  bulb: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
  warn: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
};

/* ---------- Render shell + tabs ---------- */
function switchView(view) {
  currentView = view;
  viewContext = {};
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  render();
}

function render() {
  const root = document.getElementById('view');
  if (currentView === 'log') renderLog(root);
  else if (currentView === 'exercises') renderExercises(root);
  else if (currentView === 'timer') renderTimer(root);
  else if (currentView === 'progress') renderProgress(root);
  else if (currentView === 'history') renderHistory(root);
  renderTimerDock();
}

/* ---------- Intro guide ---------- */
function introCardHTML() {
  return `
    <button class="intro-card" id="intro-card">
      <span class="intro-card-title">${ICONS.spark}<span>What is GymBuddy Log?</span></span>
      <span class="intro-card-action">Open guide ${ICONS.chev}</span>
    </button>
  `;
}

function openIntroModal() {
  try { localStorage.setItem(INTRO_SEEN_KEY, '1'); } catch (e) {}
  const slides = [
    {
      title: 'What is GymBuddy Log?',
      body: 'GymBuddy Log is a progressive overload PB tracker. It is not meant for logging every set. Use it to record the best weight or rep performance you have beaten for each exercise.',
      points: ['Log only when you beat a previous PB', 'Track weight PBs and rep PBs', 'Know exactly what to beat next time'],
    },
    {
      title: 'Progressive overload',
      body: 'Progressive overload means making an exercise slightly harder over time so your body has a reason to adapt. The simplest wins are lifting more weight than before, or doing more reps with the same weight than before.',
      points: ['More weight than your old PB', 'More reps than your old PB', 'Small improvements repeated over weeks'],
    },
    {
      title: 'How rep ranges help',
      body: 'Pick a rep range for each exercise, like 8 to 12. Start with a weight you can do near the low end. Try to add reps over sessions. When you reach the top of the range, increase the weight next time and build up again.',
      points: ['Example: 20kg x 8, then 20kg x 9, then 20kg x 12', 'After the top of the range, increase weight', 'The app tells you what the log means'],
    },
    {
      title: 'When to log',
      body: 'During a workout, only log a set if it is a new best for that exercise. If you do the same weight and same reps as before, skip it. GymBuddy stays clean because every entry should mean progress.',
      points: ['New weight PB? Log it', 'New rep PB at the same weight? Log it', 'No PB? Keep training, no log needed'],
    },
    {
      title: 'Review progress',
      body: 'Use Progress to search an exercise and see its PB history, chart, rep range, and latest suggestion. Use History for old PB entries. Export backups from the menu because your data stays on this device.',
      points: ['Search exercise progress', 'Review old PB entries', 'Export and import backups'],
    },
  ];

  let index = 0;
  const modal = createModal('GymBuddy Log Guide');
  modal.overlay.classList.add('intro-modal');
  const body = modal.body;

  const renderSlide = () => {
    const slide = slides[index];
    body.innerHTML = `
      <div class="intro-slide">
        <div class="intro-step">${index + 1} of ${slides.length}</div>
        <div class="intro-slide-title">${escapeHtml(slide.title)}</div>
        <div class="intro-slide-body">${escapeHtml(slide.body)}</div>
        <div class="intro-points">
          ${slide.points.map(point => `<div class="intro-point">${ICONS.check}<span>${escapeHtml(point)}</span></div>`).join('')}
        </div>
        <div class="intro-dots">
          ${slides.map((_, i) => `<span class="intro-dot ${i === index ? 'active' : ''}"></span>`).join('')}
        </div>
        <div class="intro-actions">
          <button class="btn-outline intro-skip" id="intro-skip">Skip</button>
          <div class="intro-nav">
            ${index > 0 ? `<button class="btn-outline" id="intro-back">Back</button>` : ''}
            <button class="btn-primary intro-next" id="intro-next">${index === slides.length - 1 ? 'Done' : 'Next'}</button>
          </div>
        </div>
      </div>
    `;

    const skip = document.getElementById('intro-skip');
    const back = document.getElementById('intro-back');
    const next = document.getElementById('intro-next');
    if (skip) skip.addEventListener('click', closeModal);
    if (back) back.addEventListener('click', () => { index -= 1; renderSlide(); });
    if (next) next.addEventListener('click', () => {
      if (index === slides.length - 1) closeModal();
      else { index += 1; renderSlide(); }
    });
  };

  renderSlide();
}

/* ---------- Explainer card ---------- */
function explainerCardHTML() {
  let open = false;
  try { open = !!localStorage.getItem(EXPLAINER_OPEN_KEY); } catch (e) {}
  return `
    <div class="explainer-card ${open ? 'open' : 'collapsed'}">
      <button class="explainer-toggle" id="explainer-toggle" aria-expanded="${open}">
        <span class="explainer-title">${ICONS.bulb}<span>Rep Range and How it works</span></span>
        <span class="explainer-chevron">${ICONS.chevDown}</span>
      </button>
      ${open ? `
        <div class="explainer-body">
          <p>The rep range progressive overload method is a strategy where you work within a specific repetition bracket (e.g., 8 to 12 reps). You master a given weight by hitting the upper rep limit, then increase the weight, which drops your reps back to the bottom of the range, and repeat the cycle.</p>
          Pick a <strong>rep range</strong> for each exercise (like 8 to 12 reps). Use a weight that's hard at the low end. Each session, try to add one rep. When you hit the top of the range, increase the weight ~2.5kg next time and start from the bottom again.
        </div>
        <div class="explainer-example">
          <div class="explainer-example-row"><span class="ee-label">Week 1</span><span class="ee-val">20kg × 8 reps</span><span class="ee-note">hard</span></div>
          <div class="explainer-example-row"><span class="ee-label">Week 2</span><span class="ee-val">20kg × 10 reps</span><span class="ee-note">easier</span></div>
          <div class="explainer-example-row"><span class="ee-label">Week 3</span><span class="ee-val">20kg × 12 reps</span><span class="ee-note">ceiling hit</span></div>
          <div class="explainer-example-row"><span class="ee-label">Week 4</span><span class="ee-val">22.5kg × 8 reps</span><span class="ee-note">new cycle</span></div>
        </div>
        <div class="explainer-footer">Log a weight to start. The app suggests what to do next based on your range.</div>
      ` : ''}
    </div>
  `;
}

function attachExplainerHandler() {
  const toggleBtn = document.getElementById('explainer-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    try {
      if (localStorage.getItem(EXPLAINER_OPEN_KEY)) localStorage.removeItem(EXPLAINER_OPEN_KEY);
      else localStorage.setItem(EXPLAINER_OPEN_KEY, '1');
    } catch (e) {}
    render();
  });
}

/* ---------- Timer View ---------- */
function renderTimer(root) {
  const isActive = timerState.status !== 'idle';
  const remainingMs = getTimerRemainingMs();
  const displayMs = isActive ? remainingMs : TIMER_PRESETS[4].seconds * 1000;
  const alertVolume = getTimerAlertVolume();
  const shouldAskNotifications = canUseTimerNotifications()
    && Notification.permission === 'default'
    && !hasAskedTimerNotificationPermission();
  const statusText = timerState.status === 'running'
    ? 'Rest running'
    : timerState.status === 'paused'
      ? 'Paused'
      : timerState.status === 'done'
        ? 'Rest complete'
        : 'Pick a rest time';

  root.innerHTML = `
    <div class="section-title">Rest Timer</div>
    <div class="date-line">One tap starts the countdown.</div>

    <div class="timer-volume-card">
      <div>
        <strong>Alert volume</strong>
        <span>High is designed for noisy gyms.</span>
      </div>
      <div class="timer-volume-segment" role="group" aria-label="Timer alert volume">
        ${Object.entries(TIMER_ALERT_VOLUMES).map(([key, value]) => `
          <button type="button" class="${alertVolume === key ? 'active' : ''}" data-timer-volume="${key}">${value.label}</button>
        `).join('')}
      </div>
    </div>

    ${shouldAskNotifications ? `
      <div class="timer-notification-card">
        <div>
          <strong>Allow rest timer alerts?</strong>
          <span>Get a notification when your rest ends.</span>
        </div>
        <div class="timer-notification-actions">
          <button type="button" data-timer-notify="allow">Allow</button>
          <button type="button" data-timer-notify="skip">Not now</button>
        </div>
      </div>
    ` : ''}

    <div class="timer-hero ${timerState.status}" data-timer-progress>
      <div class="timer-ring">
        <div class="timer-ring-inner">
          <div class="timer-state" data-timer-label>${statusText}</div>
          <div class="timer-time" data-timer-time>${formatTimerTime(displayMs)}</div>
        </div>
      </div>
      <div class="timer-actions">
        ${timerState.status === 'running' ? `<button class="timer-action-btn" type="button" data-timer-act="pause">${ICONS.pause}<span>Pause</span></button>` : ''}
        ${timerState.status === 'paused' ? `<button class="timer-action-btn primary" type="button" data-timer-act="resume">${ICONS.play}<span>Resume</span></button>` : ''}
        ${timerState.status === 'done' ? `<button class="timer-action-btn primary" type="button" data-timer-act="restart">${ICONS.rotate}<span>Restart</span></button>` : ''}
        ${isActive && timerState.status !== 'done' ? `<button class="timer-action-btn" type="button" data-timer-act="restart">${ICONS.rotate}<span>Restart</span></button>` : ''}
        ${isActive ? `<button class="timer-action-btn danger" type="button" data-timer-act="stop">${ICONS.x}<span>Stop</span></button>` : ''}
      </div>
    </div>

    <div class="timer-preset-grid">
      ${TIMER_PRESETS.map(preset => `
        <button class="timer-preset-card" type="button" data-timer-seconds="${preset.seconds}">
          <span>${preset.label}</span>
          <small>Start rest</small>
        </button>
      `).join('')}
    </div>
  `;

  root.querySelectorAll('[data-timer-seconds]').forEach(btn => {
    btn.addEventListener('click', () => {
      startRestTimer(Number(btn.dataset.timerSeconds));
      renderTimer(root);
    });
  });
  root.querySelectorAll('[data-timer-act]').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.timerAct;
      if (act === 'pause') pauseRestTimer();
      if (act === 'resume') resumeRestTimer();
      if (act === 'restart') restartRestTimer();
      if (act === 'stop') stopRestTimer();
      renderTimer(root);
    });
  });
  root.querySelectorAll('[data-timer-notify]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (btn.dataset.timerNotify === 'allow') {
        const permission = await requestTimerNotificationPermission();
        showToast(permission === 'granted' ? 'Timer alerts enabled' : 'Timer alerts not enabled', permission === 'granted' ? 'success' : 'error');
      } else {
        markTimerNotificationPermissionAsked();
      }
      renderTimer(root);
    });
  });
  root.querySelectorAll('[data-timer-volume]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimerAlertVolume(btn.dataset.timerVolume);
      showToast(`Timer alert: ${TIMER_ALERT_VOLUMES[btn.dataset.timerVolume].label}`);
      renderTimer(root);
    });
  });
  updateTimerReadouts();
}

/* ---------- Log View ---------- */
function renderLog(root) {
  if (viewContext.selectedExercise) {
    renderLogEntryForm(root, viewContext.selectedExercise);
    return;
  }

  const today = todayISO();
  const todayEntries = state.entries.filter(e => e.date === today);

  let html = `
    ${introCardHTML()}
    ${explainerCardHTML()}
    <div class="section-title">Today</div>
    <div class="date-line">${fmtFullDate(today)}</div>
    <button id="timer-quick-btn" class="timer-quick-btn" type="button">
      ${ICONS.timer}
      <span>Rest timer</span>
      <strong>${timerState.status === 'idle' ? 'Start' : formatTimerTime(getTimerRemainingMs())}</strong>
    </button>
    <button id="log-btn" class="btn-primary log-top-btn">${ICONS.plus}<span>Log a Weight</span></button>
  `;

  if (todayEntries.length === 0) {
    html += `
      <div class="empty-state">
        ${ICONS.target}
        <div class="empty-title">Nothing logged yet</div>
        <div class="empty-sub">Pick an exercise to log a weight</div>
      </div>
    `;
  } else {
    html += todayEntries.map(entry => entryCardHTML(entry, { showSuggestion: true })).join('');
  }

  root.innerHTML = html;

  document.getElementById('intro-card').addEventListener('click', openIntroModal);
  attachExplainerHandler();
  document.getElementById('log-btn').addEventListener('click', openExercisePicker);
  document.getElementById('timer-quick-btn').addEventListener('click', () => switchView('timer'));
  attachEntryCardHandlers();
}

/* ---------- Entry card ---------- */
function entryCardHTML(entry, opts = {}) {
  const ex = state.exercises.find(x => x.id === entry.exerciseId);
  if (!ex) return '';
  const b = bp(ex.bodyPart);

  // Delta vs previous entry
  const previousEntries = state.entries
    .filter(e => e.exerciseId === entry.exerciseId && e.createdAt < entry.createdAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const prev = previousEntries[0];
  let deltaHTML = '';
  if (prev) {
    const d = entry.weight - prev.weight;
    if (d > 0) deltaHTML = `<span class="delta up">${ICONS.arrowUp}<span>+${d}kg vs last</span></span>`;
    else if (d < 0) deltaHTML = `<span class="delta down">${ICONS.arrowDown}<span>${d}kg vs last</span></span>`;
    else deltaHTML = `<span class="delta same">${ICONS.minus}<span>same weight</span></span>`;
  } else {
    deltaHTML = `<span class="delta first"><span>first entry</span></span>`;
  }

  // Rep range pill — uses range as stored on entry (snapshot at time of logging)
  // Fall back to exercise's current range if entry doesn't have one (old data)
  const range = entry.repRange || ex.repRange;
  const rangePill = range
    ? `<span class="range-pill">${ICONS.range}<span>${range.min}-${range.max}</span></span>`
    : '';

  // Suggestion (only on Log + History + Progress detail, not modal pickers etc.)
  let suggestionHTML = '';
  const latestForExercise = state.entries
    .filter(e => e.exerciseId === entry.exerciseId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const isLatestForExercise = latestForExercise?.id === entry.id;
  if (opts.showSuggestion !== false && isLatestForExercise && range) {
    const sug = getSuggestion(entry.reps, range);
    if (sug.kind !== 'no_range') {
      const kindClass = `sug-${sug.kind}`;
      const iconHTML = (sug.kind === 'too_heavy') ? ICONS.warn : (sug.kind === 'ceiling' || sug.kind === 'too_light') ? ICONS.trophy : ICONS.bulb;
      const actionBtn = sug.action === 'edit_range'
        ? `<button class="sug-action" data-edit-range="${ex.id}">${ICONS.edit}<span>Edit Rep Range</span></button>`
        : '';
      suggestionHTML = `
        <div class="suggestion ${kindClass}">
          <div class="suggestion-icon">${iconHTML}</div>
          <div class="suggestion-body">
            <div class="suggestion-text">${escapeHtml(sug.text)}</div>
            ${actionBtn}
          </div>
        </div>
      `;
    }
  }

  return `
    <div class="entry-card">
      ${opts.showDelete ? `<button class="delete-btn" data-delete-entry="${entry.id}" aria-label="Delete entry">${ICONS.trash}</button>` : ''}
      <div class="entry-card-top">
        <div style="flex:1;min-width:0">
          <div class="entry-tags">
            <span class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44">${b.label}</span>
            ${rangePill}
            ${deltaHTML}
          </div>
          <div class="exercise-name">${escapeHtml(ex.name)}</div>
        </div>
        <div class="entry-stats">
          <div class="stat-big" style="color:${b.color}">${entry.weight}<span class="stat-unit">kg</span></div>
          <div class="stat-label">× ${entry.reps} reps</div>
        </div>
      </div>
      ${entry.photo ? `
        <div class="entry-photo-row">
          <button class="entry-photo-thumb" data-view-photo="${entry.id}" aria-label="View photo">
            <img src="${entry.photo}" alt="exercise attachment note" />
          </button>
          <div class="entry-photo-label">${ICONS.image}<span>Attachment / setup photo</span></div>
        </div>
      ` : ''}
      ${entry.notes ? `<div class="notes-block">${escapeHtml(entry.notes)}</div>` : ''}
      ${suggestionHTML}
    </div>
  `;
}

function attachEntryCardHandlers() {
  document.querySelectorAll('[data-view-photo]').forEach(btn => {
    btn.addEventListener('click', () => {
      const entry = state.entries.find(e => e.id === btn.dataset.viewPhoto);
      if (entry?.photo) openPhotoLightbox(entry.photo);
    });
  });
  document.querySelectorAll('[data-delete-entry]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('Delete this entry?')) return;
      state.entries = state.entries.filter(e => e.id !== btn.dataset.deleteEntry);
      saveState();
      showToast('Entry deleted');
      render();
    });
  });
  document.querySelectorAll('[data-edit-range]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = state.exercises.find(x => x.id === btn.dataset.editRange);
      if (ex) openRepRangePicker(ex.repRange, (newRange) => {
        ex.repRange = newRange;
        saveState();
        render();
        showToast(`Rep range updated: ${newRange.min}-${newRange.max}`);
      });
    });
  });
}

/* ---------- Log Entry Form ---------- */
function renderLogEntryForm(root, exercise) {
  const b = bp(exercise.bodyPart);
  const recent = state.entries
    .filter(e => e.exerciseId === exercise.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const allTimePB = (() => {
    const all = state.entries.filter(e => e.exerciseId === exercise.id);
    return all.length ? Math.max(...all.map(e => e.weight)) : null;
  })();

  // Initialize form context
  if (viewContext.formWeight === undefined) {
    try { viewContext.formWeightUnit = localStorage.getItem(WEIGHT_UNIT_KEY) || 'kg'; } catch (e) { viewContext.formWeightUnit = 'kg'; }
    viewContext.formWeight = recent ? formatInputWeight(recent.weight, viewContext.formWeightUnit) : '';
    viewContext.formReps = recent?.reps ?? '';
    viewContext.formNotes = '';
    viewContext.formPhoto = null;
    viewContext.formRepRange = exercise.repRange || null;
  }

  const renderForm = () => {
    const range = viewContext.formRepRange;
    const hasRange = !!range;
    const unit = viewContext.formWeightUnit || 'kg';

    root.innerHTML = `
      <button id="back-btn" class="btn-back">${ICONS.back}<span>Back</span></button>
      <div class="entry-tags" style="margin-bottom:8px">
        <span class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44">${b.label}</span>
      </div>
      <div class="form-title">${escapeHtml(exercise.name)}</div>
      ${recent ? `
        <div class="last-set-hint">
          Last: ${fmtDate(recent.date)} · ${recent.weight}kg × ${recent.reps} reps${allTimePB !== null && allTimePB !== recent.weight ? ` · PB ${allTimePB}kg` : ''}
        </div>
      ` : ''}

      <!-- Rep range section -->
      <div class="list-label">Rep Range ${!hasRange ? '<span class="required-tag">required</span>' : ''}</div>
      <button id="range-select-btn" class="range-selector ${!hasRange ? 'unset' : ''}">
        <div class="range-selector-inner">
          ${hasRange ? `
            <div>
              <div class="range-selector-value">${range.min} to ${range.max} reps</div>
              <div class="range-selector-hint">${range.label || 'Custom range'}</div>
            </div>
          ` : `
            <div>
              <div class="range-selector-value muted">Tap to select your target range</div>
              <div class="range-selector-hint">Required before logging</div>
            </div>
          `}
          ${ICONS.chevDown}
        </div>
      </button>

      <!-- Weight and reps -->
      <div class="weight-row" style="margin-top:18px">
        <div class="weight-field">
          <div class="input-label-row">
            <div class="list-label">Weight</div>
            <div class="unit-toggle" role="group" aria-label="Weight unit">
              <button class="unit-btn ${unit === 'kg' ? 'active' : ''}" data-unit="kg" type="button">KG</button>
              <button class="unit-btn ${unit === 'lbs' ? 'active' : ''}" data-unit="lbs" type="button">LBS</button>
            </div>
          </div>
          <input type="number" inputmode="decimal" id="weight-input" class="num-input-big" placeholder="0" value="${viewContext.formWeight}" />
        </div>
        <div class="weight-field">
          <div class="list-label">Reps</div>
          <input type="number" inputmode="numeric" id="reps-input" class="num-input-big" placeholder="0" value="${viewContext.formReps}" />
        </div>
      </div>

      <!-- Photo -->
      <div class="list-label" style="margin-top:20px">Attachment / Setup Photo (optional)</div>
      <div class="photo-help">For exercises with attachments you don't know the name of (cable handles, machine settings, etc.). The photo saves with this entry as a visual note.</div>
      ${viewContext.formPhoto ? `
        <div class="photo-preview-wrap">
          <img src="${viewContext.formPhoto}" class="photo-preview" alt="attachment photo" />
          <button id="photo-clear" class="photo-clear">${ICONS.x}</button>
        </div>
      ` : `
        <button id="photo-trigger" class="photo-drop">
          ${ICONS.imageLg}
          <div class="photo-drop-text">Tap to take or upload</div>
          <div class="photo-drop-sub">Optional · auto-compressed to save storage</div>
        </button>
        <input type="file" id="photo-input" accept="image/*" capture="environment" style="display:none" />
      `}

      <!-- Notes -->
      <div class="list-label" style="margin-top:20px">Notes (optional)</div>
      <textarea id="notes-input" class="textarea" rows="2" placeholder="setup notes, form cues, machine pin position…">${escapeHtml(viewContext.formNotes)}</textarea>

      <button id="save-btn" class="btn-primary">${ICONS.check}<span>Save Entry</span></button>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
      viewContext = {};
      render();
    });

    document.getElementById('range-select-btn').addEventListener('click', () => {
      openRepRangePicker(viewContext.formRepRange, (newRange) => {
        viewContext.formRepRange = newRange;
        // Also persist to exercise immediately
        exercise.repRange = newRange;
        saveState();
        renderForm();
      });
    });

    document.querySelectorAll('[data-unit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextUnit = btn.dataset.unit;
        if (nextUnit === viewContext.formWeightUnit) return;
        const current = Number(viewContext.formWeight);
        if (viewContext.formWeight !== '' && !isNaN(current)) {
          viewContext.formWeight = nextUnit === 'lbs' ? kgToLb(current) : lbToKg(current);
        }
        viewContext.formWeightUnit = nextUnit;
        try { localStorage.setItem(WEIGHT_UNIT_KEY, nextUnit); } catch (e) {}
        renderForm();
      });
    });

    document.getElementById('weight-input').addEventListener('input', (e) => {
      viewContext.formWeight = e.target.value;
      updateSaveBtn();
    });
    document.getElementById('reps-input').addEventListener('input', (e) => {
      viewContext.formReps = e.target.value;
      updateSaveBtn();
    });
    document.getElementById('notes-input').addEventListener('input', (e) => {
      viewContext.formNotes = e.target.value;
    });

    const photoTrigger = document.getElementById('photo-trigger');
    const photoInput = document.getElementById('photo-input');
    if (photoTrigger && photoInput) {
      photoTrigger.addEventListener('click', () => photoInput.click());
      photoInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          showToast('Compressing photo…');
          viewContext.formPhoto = await compressPhoto(file);
          renderForm();
        } catch (err) {
          showToast('Could not process photo', 'error');
        }
      });
    }
    const photoClear = document.getElementById('photo-clear');
    if (photoClear) photoClear.addEventListener('click', () => {
      viewContext.formPhoto = null;
      renderForm();
    });

    document.getElementById('save-btn').addEventListener('click', () => {
      if (!viewContext.formRepRange) {
        showToast('Pick a rep range first', 'error');
        document.getElementById('range-select-btn').focus();
        return;
      }
      const inputWeight = Number(viewContext.formWeight);
      const w = viewContext.formWeightUnit === 'lbs' ? lbToKg(inputWeight) : inputWeight;
      const r = Number(viewContext.formReps);
      if (!viewContext.formWeight || !viewContext.formReps || isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
        showToast('Enter a valid weight and reps', 'error');
        return;
      }
      const entry = {
        id: uid(),
        exerciseId: exercise.id,
        date: todayISO(),
        weight: w,
        reps: r,
        repRange: { ...viewContext.formRepRange }, // snapshot
        photo: viewContext.formPhoto || null,
        notes: viewContext.formNotes || '',
        createdAt: new Date().toISOString(),
      };
      const prevPB = allTimePB;
      const isNewPB = prevPB === null || w > prevPB;

      state.entries = [entry, ...state.entries];
      saveState();
      viewContext = {};
      render();
      if (isNewPB && prevPB !== null) {
        showToast(`New PB! ${w}kg (was ${prevPB}kg) 🎉`);
      } else {
        showToast(`Logged ${exercise.name} · ${w}kg × ${r}`);
      }
    });

    updateSaveBtn();
  };

  const updateSaveBtn = () => {
    const btn = document.getElementById('save-btn');
    if (!btn) return;
    const valid = !!viewContext.formRepRange
      && viewContext.formWeight !== '' && viewContext.formReps !== ''
      && Number(viewContext.formWeight) > 0 && Number(viewContext.formReps) > 0;
    btn.disabled = !valid;
    btn.style.opacity = valid ? '1' : '0.4';
  };

  renderForm();
}

/* ---------- Rep Range Picker Modal ---------- */
function openRepRangePicker(currentRange, onSave) {
  const modal = createModal('Pick Rep Range');
  const body = modal.body;

  let mode = 'preset'; // 'preset' | 'custom'
  let selectedPresetId = currentRange?.presetId || null;
  let customMin = currentRange?.min ?? 8;
  let customMax = currentRange?.max ?? 12;
  // If currentRange exists and matches no preset, start in custom mode
  if (currentRange && !currentRange.presetId) {
    mode = 'custom';
    customMin = currentRange.min;
    customMax = currentRange.max;
  }

  const renderBody = () => {
    body.innerHTML = `
      <div class="range-info">
        <div class="range-info-icon">${ICONS.info}</div>
        <div class="range-info-text">
          Choose a target rep range. Use a weight you can do for the lower number. Add reps each session. When you hit the top, increase the weight next time.
        </div>
      </div>

      <div class="toggle-row">
        <button class="toggle-btn ${mode === 'preset' ? 'active' : ''}" data-mode="preset">Presets</button>
        <button class="toggle-btn ${mode === 'custom' ? 'active' : ''}" data-mode="custom">Custom</button>
      </div>

      ${mode === 'preset' ? `
        <div class="preset-list">
          ${REP_RANGE_PRESETS.map(p => `
            <button class="preset-row ${selectedPresetId === p.id ? 'selected' : ''}" data-preset="${p.id}">
              <div class="preset-row-main">
                <div class="preset-row-label">${p.label}</div>
                <div class="preset-row-hint">${p.hint}</div>
              </div>
              <div class="preset-row-range">${p.range}</div>
            </button>
          `).join('')}
        </div>
        <div class="custom-cta" id="switch-to-custom">
          Can't find your ideal rep range? <strong>Set a custom range</strong>
        </div>
      ` : `
        <div class="custom-range-wrap">
          <div class="custom-range-field">
            <div class="list-label">Lower</div>
            <input type="number" inputmode="numeric" id="custom-min" class="num-input-big" min="1" max="50" value="${customMin}" />
          </div>
          <div class="custom-range-sep">to</div>
          <div class="custom-range-field">
            <div class="list-label">Upper</div>
            <input type="number" inputmode="numeric" id="custom-max" class="num-input-big" min="1" max="50" value="${customMax}" />
          </div>
        </div>
        <div id="custom-error" class="custom-error" hidden></div>
      `}

      <button id="range-save-btn" class="btn-primary">${ICONS.check}<span>Save Rep Range</span></button>
    `;

    document.querySelectorAll('[data-mode]').forEach(b => {
      b.addEventListener('click', () => { mode = b.dataset.mode; renderBody(); });
    });

    document.querySelectorAll('[data-preset]').forEach(b => {
      b.addEventListener('click', () => {
        selectedPresetId = b.dataset.preset;
        renderBody();
      });
    });

    const switchBtn = document.getElementById('switch-to-custom');
    if (switchBtn) switchBtn.addEventListener('click', () => { mode = 'custom'; renderBody(); });

    const minInput = document.getElementById('custom-min');
    const maxInput = document.getElementById('custom-max');
    if (minInput) minInput.addEventListener('input', (e) => { customMin = Number(e.target.value); validateCustom(); });
    if (maxInput) maxInput.addEventListener('input', (e) => { customMax = Number(e.target.value); validateCustom(); });

    document.getElementById('range-save-btn').addEventListener('click', () => {
      if (mode === 'preset') {
        if (!selectedPresetId) { showToast('Pick a preset or use Custom', 'error'); return; }
        const p = REP_RANGE_PRESETS.find(x => x.id === selectedPresetId);
        const range = { presetId: p.id, label: p.label, min: p.min, max: p.max };
        closeModal();
        onSave(range);
      } else {
        const err = validateCustom();
        if (err) return;
        const range = { presetId: null, label: 'Custom', min: customMin, max: customMax };
        closeModal();
        onSave(range);
      }
    });
  };

  const validateCustom = () => {
    const errEl = document.getElementById('custom-error');
    let msg = null;
    if (!Number.isInteger(customMin) || !Number.isInteger(customMax)) msg = 'Both values must be whole numbers';
    else if (customMin < 1 || customMax < 1) msg = 'Reps must be at least 1';
    else if (customMin > 50 || customMax > 50) msg = 'Max 50 reps';
    else if (customMin >= customMax) msg = 'Upper must be greater than lower';
    if (errEl) {
      if (msg) { errEl.textContent = msg; errEl.hidden = false; }
      else { errEl.hidden = true; }
    }
    return msg;
  };

  renderBody();
}

/* ---------- Photo Lightbox ---------- */
function openPhotoLightbox(dataUrl) {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">${ICONS.xLg}</button>
    <img src="${dataUrl}" alt="photo" />
  `;
  root.appendChild(overlay);
  const close = () => { root.innerHTML = ''; };
  overlay.addEventListener('click', close);
  overlay.querySelector('.lightbox-close').addEventListener('click', close);
}

/* ---------- Exercise Picker ---------- */
function openExercisePicker() {
  const modal = createModal('Pick Exercise');
  const body = modal.body;

  let search = '';
  let bodyFilter = null;

  body.innerHTML = `
    <div class="search-wrap">
      ${ICONS.search}
      <input type="text" id="picker-search" class="search-input" placeholder="Search exercises…" />
    </div>
    <div class="chips-row" id="picker-chips"></div>
    <div class="exercise-list"></div>
    <button id="picker-add-new" class="btn-outline">${ICONS.plus}<span>Add New Exercise</span></button>
  `;

  const renderList = () => {
    const filtered = state.exercises
      .filter(e => (!bodyFilter || e.bodyPart === bodyFilter))
      .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));

    const listEl = body.querySelector('.exercise-list');
    listEl.innerHTML = filtered.length === 0
      ? `<div style="padding:24px 4px;color:#666;text-align:center;font-size:14px">No matches. Add a new exercise below.</div>`
      : filtered.map(ex => {
          const b = bp(ex.bodyPart);
          const rangeText = ex.repRange ? `${ex.repRange.min}-${ex.repRange.max}` : '—';
          return `
            <button class="exercise-row" data-pick-ex="${ex.id}">
              <div class="body-dot" style="background:${b.color}"></div>
              <span>${escapeHtml(ex.name)}</span>
              <span class="ex-range-mini">${rangeText}</span>
              <span class="ex-bp-mini">${b.label}</span>
              ${ICONS.chev}
            </button>
          `;
        }).join('');
    listEl.querySelectorAll('[data-pick-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ex = state.exercises.find(x => x.id === btn.dataset.pickEx);
        closeModal();
        viewContext.selectedExercise = ex;
        currentView = 'log';
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'log'));
        render();
      });
    });
  };

  const renderChips = () => {
    const chipsEl = document.getElementById('picker-chips');
    chipsEl.innerHTML = `
      <button class="chip ${bodyFilter === null ? 'active' : ''}" data-bp="">All</button>
      ${BODY_PARTS.map(b => `<button class="chip ${bodyFilter === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyFilter === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    `;
    chipsEl.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.bp;
        bodyFilter = id === '' ? null : (id === bodyFilter ? null : id);
        renderChips();
        renderList();
      });
    });
  };

  document.getElementById('picker-search').addEventListener('input', (e) => {
    search = e.target.value;
    renderList();
  });
  renderChips();
  renderList();

  document.getElementById('picker-add-new').addEventListener('click', () => {
    openExerciseAdder((newEx) => {
      closeModal();
      viewContext.selectedExercise = newEx;
      currentView = 'log';
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'log'));
      render();
    });
  });
}

/* ---------- Exercise Adder ---------- */
function openExerciseAdder(onAdded) {
  const modal = createModal('Add Exercise');
  const body = modal.body;

  let name = '';
  let equipment = '';
  let bodyPart = 'chest';

  body.innerHTML = `
    <div class="list-label">Exercise Name</div>
    <input type="text" id="ex-name" class="text-input" placeholder="e.g. Lat Pulldown" />
    <div class="list-label" style="margin-top:16px">Equipment / Attachment <span style="color:#666;font-weight:400">(optional)</span></div>
    <select id="ex-equipment" class="select-input">
      <option value="">None</option>
      ${EQUIPMENT_OPTIONS.map(option => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join('')}
    </select>
    <div class="list-label" style="margin-top:16px">Body Part</div>
    <div class="chips-row" id="adder-chips">
      ${BODY_PARTS.map(b => `<button class="chip ${bodyPart === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyPart === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    </div>
    <div class="adder-meta">You'll set the rep range when you log a weight for this exercise.</div>
    <button id="add-ex-btn" class="btn-primary" disabled style="opacity:0.4">${ICONS.check}<span>Add Exercise</span></button>
  `;

  const nameInput = document.getElementById('ex-name');
  const equipmentInput = document.getElementById('ex-equipment');
  const addBtn = document.getElementById('add-ex-btn');
  nameInput.addEventListener('input', (e) => {
    name = e.target.value;
    addBtn.disabled = !name.trim();
    addBtn.style.opacity = name.trim() ? '1' : '0.4';
  });
  equipmentInput.addEventListener('input', (e) => {
    equipment = e.target.value;
  });

  document.querySelectorAll('#adder-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      bodyPart = chip.dataset.bp;
      document.querySelectorAll('#adder-chips .chip').forEach(c => {
        c.classList.toggle('active', c.dataset.bp === bodyPart);
        if (c.dataset.bp === bodyPart) {
          const b = bp(bodyPart);
          c.setAttribute('style', `background:${b.color}22;color:${b.color};border-color:${b.color}`);
        } else {
          c.removeAttribute('style');
        }
      });
    });
  });

  addBtn.addEventListener('click', () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const equipmentText = equipment.trim();
    const finalName = equipmentText ? `${trimmed} (${equipmentText})` : trimmed;
    const newEx = { id: uid(), name: finalName, bodyPart, repRange: null, createdAt: new Date().toISOString() };
    state.exercises.push(newEx);
    saveState();
    showToast(`Added ${finalName}`);
    closeModal();
    if (onAdded) onAdded(newEx);
    else render();
  });

  nameInput.focus();
}

function openExerciseEditor(exercise, onSaved) {
  const modal = createModal('Edit Exercise');
  const body = modal.body;

  let name = exercise.name;
  let bodyPart = exercise.bodyPart;

  const renderChips = () => BODY_PARTS.map(b => `
    <button class="chip ${bodyPart === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyPart === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>
  `).join('');

  body.innerHTML = `
    <div class="list-label">Exercise Name</div>
    <input type="text" id="edit-ex-name" class="text-input" value="${escapeHtml(name)}" />
    <div class="list-label" style="margin-top:16px">Body Part</div>
    <div class="chips-row" id="edit-ex-chips">
      ${renderChips()}
    </div>
    <div class="adder-meta">This changes the exercise everywhere it appears, including old PB entries and progress filters.</div>
    <button id="save-ex-details-btn" class="btn-primary">${ICONS.check}<span>Save Details</span></button>
  `;

  const nameInput = document.getElementById('edit-ex-name');
  const saveBtn = document.getElementById('save-ex-details-btn');
  const refreshSaveState = () => {
    const changed = name.trim() !== exercise.name || bodyPart !== exercise.bodyPart;
    saveBtn.disabled = !name.trim() || !changed;
    saveBtn.style.opacity = !name.trim() || !changed ? '0.4' : '1';
  };

  nameInput.addEventListener('input', (e) => {
    name = e.target.value;
    refreshSaveState();
  });

  document.querySelectorAll('#edit-ex-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      bodyPart = chip.dataset.bp;
      document.querySelectorAll('#edit-ex-chips .chip').forEach(c => {
        c.classList.toggle('active', c.dataset.bp === bodyPart);
        if (c.dataset.bp === bodyPart) {
          const b = bp(bodyPart);
          c.setAttribute('style', `background:${b.color}22;color:${b.color};border-color:${b.color}`);
        } else {
          c.removeAttribute('style');
        }
      });
      refreshSaveState();
    });
  });

  saveBtn.addEventListener('click', () => {
    const trimmed = name.trim();
    if (!trimmed || (trimmed === exercise.name && bodyPart === exercise.bodyPart)) return;
    const oldName = exercise.name;
    const oldPart = bp(exercise.bodyPart).label;
    const newPart = bp(bodyPart).label;
    const message = `Update "${oldName}"?\n\nThis will rename the exercise to "${trimmed}" and move it from ${oldPart} to ${newPart}. Existing logs and progress history will use the new details.\n\nContinue?`;
    if (!confirm(message)) return;
    exercise.name = trimmed;
    exercise.bodyPart = bodyPart;
    saveState();
    closeModal();
    showToast('Exercise updated');
    if (onSaved) onSaved(exercise);
    else render();
  });

  refreshSaveState();
  nameInput.focus();
}

/* ---------- Exercises View ---------- */
function renderExercises(root) {
  let search = viewContext.exSearch || '';
  let bodyFilter = viewContext.exFilter || null;

  const counts = {};
  for (const e of state.entries) counts[e.exerciseId] = (counts[e.exerciseId] || 0) + 1;

  const visibleBPs = bodyFilter ? BODY_PARTS.filter(b => b.id === bodyFilter) : BODY_PARTS;

  const renderListHTML = () => visibleBPs.map(b => {
    const list = state.exercises
      .filter(e => e.bodyPart === b.id)
      .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (list.length === 0) return '';
    return `
      <div>
        <div class="body-part-header">
          <div class="body-dot-lg" style="background:${b.color}"></div>
          <div class="body-part-header-text">${b.label}</div>
          <div class="body-part-header-count">${list.length}</div>
        </div>
        ${list.map(ex => {
          const rangeText = ex.repRange ? `${ex.repRange.min}-${ex.repRange.max}` : 'not set';
          const rangeClass = ex.repRange ? '' : 'unset';
          return `
            <div class="exercise-row-card">
              <div style="flex:1;min-width:0">
                <div>${escapeHtml(ex.name)}</div>
                <div class="ex-row-meta">
                  <span class="ex-row-range ${rangeClass}">${ICONS.range}<span>Range: ${rangeText}</span></span>
                  <span class="ex-row-count">${counts[ex.id] ? `${counts[ex.id]} log${counts[ex.id] > 1 ? 's' : ''}` : 'new'}</span>
                </div>
              </div>
              <div class="exercise-row-actions">
                <button class="exercise-action-btn" data-edit-ex="${ex.id}" aria-label="Edit exercise details">${ICONS.edit}<span>Details</span></button>
                <button class="exercise-action-btn range" data-edit-range-ex="${ex.id}" aria-label="Edit rep range">${ICONS.range}<span>Range</span></button>
                <button class="exercise-action-btn danger icon-only" data-delete-ex="${ex.id}" aria-label="Delete">${ICONS.trash}</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  root.innerHTML = `
    <div class="section-title">Exercises</div>
    <div class="date-line">${state.exercises.length} total · ${Object.keys(counts).length} logged</div>
    <div class="search-wrap">
      ${ICONS.search}
      <input type="text" id="ex-search" class="search-input" placeholder="Search by name…" value="${escapeHtml(search)}" />
    </div>
    <div class="chips-row" id="ex-chips">
      <button class="chip ${bodyFilter === null ? 'active' : ''}" data-bp="">All</button>
      ${BODY_PARTS.map(b => `<button class="chip ${bodyFilter === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyFilter === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    </div>
    <div id="ex-list">${renderListHTML()}</div>
    <button id="add-ex-trigger" class="btn-primary">${ICONS.plus}<span>Add Exercise</span></button>
  `;

  document.getElementById('ex-search').addEventListener('input', (e) => {
    viewContext.exSearch = e.target.value;
    search = e.target.value;
    document.getElementById('ex-list').innerHTML = renderListHTML();
    attachExHandlers();
  });

  document.querySelectorAll('#ex-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.bp;
      bodyFilter = id === '' ? null : (id === bodyFilter ? null : id);
      viewContext.exFilter = bodyFilter;
      renderExercises(root);
    });
  });

  const attachExHandlers = () => {
    document.querySelectorAll('[data-delete-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.dataset.deleteEx;
        const ex = state.exercises.find(x => x.id === exId);
        if (!ex) return;
        if (!confirm(`Delete "${ex.name}"? This also removes all logged entries for it.`)) return;
        state.exercises = state.exercises.filter(x => x.id !== exId);
        state.entries = state.entries.filter(e => e.exerciseId !== exId);
        saveState();
        showToast(`Deleted ${ex.name}`);
        renderExercises(root);
      });
    });
    document.querySelectorAll('[data-edit-range-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ex = state.exercises.find(x => x.id === btn.dataset.editRangeEx);
        if (!ex) return;
        openRepRangePicker(ex.repRange, (newRange) => {
          ex.repRange = newRange;
          saveState();
          renderExercises(root);
          showToast(`Rep range updated: ${newRange.min}-${newRange.max}`);
        });
      });
    });
    document.querySelectorAll('[data-edit-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ex = state.exercises.find(x => x.id === btn.dataset.editEx);
        if (!ex) return;
        openExerciseEditor(ex, () => renderExercises(root));
      });
    });
  };
  attachExHandlers();

  document.getElementById('add-ex-trigger').addEventListener('click', () => {
    openExerciseAdder(() => renderExercises(root));
  });
}

/* ---------- Progress View ---------- */
function renderProgress(root) {
  if (viewContext.selectedProgressEx) {
    renderProgressDetail(root, viewContext.selectedProgressEx);
    return;
  }

  const bodyFilter = viewContext.progFilter || null;
  let search = viewContext.progSearch || '';
  const byEx = {};
  for (const e of state.entries) {
    if (!byEx[e.exerciseId]) byEx[e.exerciseId] = [];
    byEx[e.exerciseId].push(e);
  }

  const exercisesWithData = state.exercises
    .filter(ex => byEx[ex.id] && byEx[ex.id].length > 0)
    .filter(ex => !bodyFilter || ex.bodyPart === bodyFilter)
    .filter(ex => !search || ex.name.toLowerCase().includes(search.toLowerCase()))
    .map(ex => {
      const entries = byEx[ex.id].slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const pb = Math.max(...entries.map(e => e.weight));
      const latest = entries[entries.length - 1];
      const previous = entries.length > 1 ? entries[entries.length - 2] : null;
      const delta = previous ? latest.weight - previous.weight : null;
      return { ex, pb, latest, previous, delta, entryCount: entries.length };
    })
    .sort((a, b) => b.latest.createdAt.localeCompare(a.latest.createdAt));

  const totalTracked = state.exercises.filter(ex => byEx[ex.id]?.length).length;

  root.innerHTML = `
    <div class="section-title">Progress</div>
    <div class="date-line">${totalTracked} exercise${totalTracked !== 1 ? 's' : ''} tracked</div>

    <div class="search-wrap">
      ${ICONS.search}
      <input type="text" id="prog-search" class="search-input" placeholder="Search tracked exercises…" value="${escapeHtml(search)}" />
    </div>

    <div class="chips-row" style="margin-top:12px" id="prog-chips">
      <button class="chip ${bodyFilter === null ? 'active' : ''}" data-bp="">All</button>
      ${BODY_PARTS.map(b => `<button class="chip ${bodyFilter === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyFilter === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    </div>

    ${exercisesWithData.length === 0 ? `
      <div class="empty-state">
        ${ICONS.chart}
        <div class="empty-title">Nothing to show yet</div>
        <div class="empty-sub">${totalTracked === 0 ? 'Log a new PB and it will appear here' : 'Try a different search or body-part filter'}</div>
      </div>
    ` : `
      <div style="margin-top:14px">
        ${exercisesWithData.map(({ ex, pb, latest, delta, entryCount }) => {
          const b = bp(ex.bodyPart);
          const isLatestPB = latest.weight === pb;
          let deltaBadge = '';
          if (delta !== null) {
            if (delta > 0) deltaBadge = `<div class="delta-badge up">${ICONS.arrowUp}+${delta}kg</div>`;
            else if (delta < 0) deltaBadge = `<div class="delta-badge down">${ICONS.arrowDown}${delta}kg</div>`;
            else deltaBadge = `<div class="delta-badge same">${ICONS.minus}same</div>`;
          } else {
            deltaBadge = `<div class="delta-badge first">first</div>`;
          }
          const rangePill = ex.repRange
            ? `<span class="range-pill-sm">${ICONS.range}<span>${ex.repRange.min}-${ex.repRange.max}</span></span>`
            : '';
          return `
            <button class="progress-row" data-prog-ex="${ex.id}">
              <div style="flex:1;min-width:0">
                <div class="entry-tags">
                  <span class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44;font-size:9px">${b.label}</span>
                  ${rangePill}
                </div>
                <div class="progress-row-name">${escapeHtml(ex.name)}</div>
                <div class="progress-row-meta">
                  ${entryCount} entr${entryCount > 1 ? 'ies' : 'y'} · last ${fmtDate(latest.date)}
                  ${isLatestPB && entryCount > 1 ? ` · <span style="color:${b.color}">${ICONS.trophy} latest is PB</span>` : ''}
                </div>
                ${deltaBadge}
              </div>
              <div class="progress-row-right">
                <div class="progress-row-pr" style="color:${b.color}">${pb}<span class="stat-unit">kg</span></div>
                <div class="progress-row-pr-label">PB</div>
              </div>
              <div style="color:#444">${ICONS.chev}</div>
            </button>
          `;
        }).join('')}
      </div>
    `}
  `;

  document.querySelectorAll('#prog-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.bp;
      viewContext.progFilter = id === '' ? null : (id === viewContext.progFilter ? null : id);
      renderProgress(root);
    });
  });

  document.getElementById('prog-search').addEventListener('input', (e) => {
    viewContext.progSearch = e.target.value;
    viewContext.progSearchFocus = true;
    renderProgress(root);
  });
  if (viewContext.progSearchFocus) {
    const searchInput = document.getElementById('prog-search');
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
  }

  document.querySelectorAll('[data-prog-ex]').forEach(btn => {
    btn.addEventListener('click', () => {
      viewContext.selectedProgressEx = state.exercises.find(x => x.id === btn.dataset.progEx);
      renderProgress(root);
    });
  });
}

function renderProgressDetail(root, exercise) {
  const b = bp(exercise.bodyPart);
  const entries = state.entries
    .filter(e => e.exerciseId === exercise.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const weights = entries.map(e => e.weight);
  const pb = weights.length ? Math.max(...weights) : 0;
  const latest = entries[entries.length - 1];
  const previous = entries.length > 1 ? entries[entries.length - 2] : null;
  const delta = previous ? latest.weight - previous.weight : null;

  const chartData = entries.map(e => ({ date: fmtDate(e.date), weight: e.weight }));
  const rangeText = exercise.repRange ? `${exercise.repRange.min}-${exercise.repRange.max}` : 'not set';

  root.innerHTML = `
    <button id="prog-back" class="btn-back">${ICONS.back}<span>Back</span></button>
    <div class="entry-tags" style="margin-bottom:8px">
      <span class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44">${b.label}</span>
    </div>
    <div class="form-title">${escapeHtml(exercise.name)}</div>

    <div class="range-summary-row">
      <span class="range-summary-label">${ICONS.range} Target Range</span>
      <span class="range-summary-value ${exercise.repRange ? '' : 'unset'}">${rangeText}</span>
      <button class="range-edit-btn" id="detail-edit-range">${ICONS.edit}<span>Edit</span></button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-label">Personal best</div>
        <div class="stat-card-value" style="color:${b.color}">${pb}<span class="stat-unit">kg</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Entries</div>
        <div class="stat-card-value">${entries.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Last vs Prev</div>
        <div class="stat-card-value" style="color:${delta === null ? '#888' : delta > 0 ? '#B5F23D' : delta < 0 ? '#F87171' : '#888'}">
          ${delta === null ? '—' : (delta > 0 ? '+' : '') + delta + '<span class="stat-unit">kg</span>'}
        </div>
      </div>
    </div>

    ${chartData.length >= 2 ? `
      <div class="chart-wrap">
        <div class="chart-label">Weight per entry</div>
        ${buildLineChart(chartData, b.color)}
      </div>
    ` : ''}

    <div style="margin-top:24px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1.5px">All Entries</div>
    <div style="margin-top:8px">
      ${entries.slice().reverse().map(e => entryCardHTML(e, { showDelete: true, showSuggestion: true })).join('')}
    </div>
  `;

  document.getElementById('prog-back').addEventListener('click', () => {
    viewContext.selectedProgressEx = null;
    renderProgress(root);
  });

  document.getElementById('detail-edit-range').addEventListener('click', () => {
    openRepRangePicker(exercise.repRange, (newRange) => {
      exercise.repRange = newRange;
      saveState();
      renderProgressDetail(root, exercise);
      showToast(`Rep range updated: ${newRange.min}-${newRange.max}`);
    });
  });

  attachEntryCardHandlers();
}

/* ---------- Line chart ---------- */
function buildLineChart(data, color) {
  const W = 320, H = 180;
  const PAD_L = 36, PAD_R = 12, PAD_T = 12, PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const values = data.map(d => d.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const yPad = range * 0.15;
  const yMin = Math.max(0, min - yPad);
  const yMax = max + yPad;
  const yRange = yMax - yMin || 1;
  const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;
  const points = data.map((d, i) => {
    const x = PAD_L + i * xStep;
    const y = PAD_T + innerH - ((d.weight - yMin) / yRange) * innerH;
    return { x, y, d };
  });
  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const yTicks = [yMin, yMin + yRange / 2, yMax].map(v => {
    const y = PAD_T + innerH - ((v - yMin) / yRange) * innerH;
    return { y, label: Math.round(v) };
  });
  const xLabelIndices = data.length <= 5 ? data.map((_, i) => i) : [0, Math.floor(data.length / 2), data.length - 1];
  return `
    <svg viewBox="0 0 ${W} ${H}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      ${yTicks.map(t => `
        <line x1="${PAD_L}" y1="${t.y}" x2="${W - PAD_R}" y2="${t.y}" stroke="#222" stroke-dasharray="2 4"/>
        <text x="${PAD_L - 6}" y="${t.y + 3}" fill="#666" font-size="9" text-anchor="end" font-family="JetBrains Mono, monospace">${t.label}</text>
      `).join('')}
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>`).join('')}
      ${xLabelIndices.map(i => `<text x="${points[i].x}" y="${H - 8}" fill="#666" font-size="9" text-anchor="middle">${data[i].date}</text>`).join('')}
    </svg>
  `;
}

/* ---------- History ---------- */
function renderHistory(root) {
  const bodyFilter = viewContext.histFilter || null;
  const filtered = state.entries.filter(e => {
    if (!bodyFilter) return true;
    const ex = state.exercises.find(x => x.id === e.exerciseId);
    return ex?.bodyPart === bodyFilter;
  });
  const byDate = {};
  for (const e of filtered) {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  }
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  root.innerHTML = `
    <div class="section-title">History</div>
    <div class="date-line">${state.entries.length} total entries</div>
    <div class="chips-row" id="hist-chips">
      <button class="chip ${bodyFilter === null ? 'active' : ''}" data-bp="">All</button>
      ${BODY_PARTS.map(b => `<button class="chip ${bodyFilter === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyFilter === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    </div>
    ${sortedDates.length === 0 ? `
      <div class="empty-state">
        ${ICONS.calendar}
        <div class="empty-title">No history yet</div>
        <div class="empty-sub">Logged weights will show up here</div>
      </div>
    ` : sortedDates.map(date => `
      <div>
        <div class="date-header">${fmtFullDate(date)}</div>
        ${byDate[date].map(e => entryCardHTML(e, { showDelete: true, showSuggestion: true })).join('')}
      </div>
    `).join('')}
  `;

  document.querySelectorAll('#hist-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.bp;
      viewContext.histFilter = id === '' ? null : (id === viewContext.histFilter ? null : id);
      renderHistory(root);
    });
  });
  attachEntryCardHandlers();
}

/* ---------- Modal helpers ---------- */
function createModal(title) {
  const root = document.getElementById('modal-root');
  root.innerHTML = '';
  const overlay = document.createElement('div');
  overlay.className = 'modal';
  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">${escapeHtml(title)}</div>
        <button class="icon-btn-plain" data-close-modal>${ICONS.xLg}</button>
      </div>
      <div data-modal-body></div>
    </div>
  `;
  root.appendChild(overlay);
  // Click outside to close
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('[data-close-modal]').addEventListener('click', closeModal);

  // Keyboard handling: when an input inside the modal focuses, scroll it into view
  setTimeout(() => {
    const card = overlay.querySelector('.modal-card');
    overlay.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Use scrollIntoView with a small delay to wait for keyboard animation
        setTimeout(() => {
          try { e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (err) {}
        }, 300);
      }
    });
  }, 50);

  return { overlay, body: overlay.querySelector('[data-modal-body]') };
}
function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
}

/* ---------- Menu ---------- */
function openMenu() {
  const modal = createModal('Menu');
  const body = modal.body;
  const entryCount = state.entries.length;
  const exerciseCount = state.exercises.length;
  const photoCount = state.entries.filter(e => e.photo).length;
  const storageSize = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      const bytes = new Blob([raw]).size;
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    } catch (e) { return 'unknown'; }
  })();

  body.innerHTML = `
    <div class="menu-list">
      <button class="menu-item" data-act="export">${ICONS.download}<span>Export backup (JSON)</span></button>
      <button class="menu-item" data-act="import">${ICONS.upload}<span>Import backup</span></button>
      <button class="menu-item danger" data-act="reset">${ICONS.trash}<span>Reset all data</span></button>
    </div>
    <div class="menu-meta">
      ${entryCount} entries · ${exerciseCount} exercises · ${photoCount} photo${photoCount !== 1 ? 's' : ''}<br/>
      Storage: ${storageSize} of ~5 MB<br/>
      <span style="color:#888">Export weekly. iOS may clear PWA storage if unused for ~7 weeks.</span>
    </div>
    <input type="file" id="import-file" accept="application/json" style="display:none" />
  `;

  body.querySelector('[data-act="export"]').addEventListener('click', () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymbuddy-log-backup-${todayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup downloaded');
  });

  body.querySelector('[data-act="import"]').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });

  body.querySelector('#import-file').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.exercises || !parsed.entries) throw new Error('Invalid format');
        if (!confirm(`Import will REPLACE current data: ${state.entries.length} entries.\n\nNew data: ${parsed.entries.length} entries, ${parsed.exercises.length} exercises.\n\nContinue?`)) return;
        state = parsed;
        saveState();
        closeModal();
        render();
        showToast('Backup imported');
      } catch (err) {
        showToast('Invalid backup file', 'error');
      }
    };
    reader.readAsText(file);
  });

  body.querySelector('[data-act="reset"]').addEventListener('click', () => {
    if (!confirm('This will delete all entries, exercises, and reset to defaults. Are you sure?')) return;
    if (!confirm('Last chance. This cannot be undone. Export a backup first if you want to keep your data.')) return;
    localStorage.removeItem(STORAGE_KEY);
    loadState();
    closeModal();
    render();
    showToast('Reset complete');
  });
}

/* ---------- iOS install hint ---------- */
function maybeShowIOSHint() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  if (!isIOS || isStandalone) return;
  try { if (localStorage.getItem(IOS_HINT_KEY)) return; } catch (e) { return; }
  const hint = document.getElementById('ios-install-hint');
  hint.hidden = false;
  hint.querySelector('.ios-hint-close').addEventListener('click', () => {
    hint.hidden = true;
    try { localStorage.setItem(IOS_HINT_KEY, '1'); } catch (e) {}
  });
}

/* ---------- Init ---------- */
function init() {
  loadState();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  document.getElementById('menu-btn').addEventListener('click', openMenu);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && timerState.status === 'running') {
      requestTimerWakeLock();
      updateTimerReadouts();
    }
  });
  render();
  try {
    if (isFreshInstall && !localStorage.getItem(INTRO_SEEN_KEY)) openIntroModal();
  } catch (e) {}
  maybeShowIOSHint();
}

document.addEventListener('DOMContentLoaded', init);
