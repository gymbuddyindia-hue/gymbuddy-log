/* GymBuddy Log — PB tracker PWA */

const BODY_PARTS = [
  { id: 'chest', label: 'Chest', color: '#B5F23D' },
  { id: 'back', label: 'Back', color: '#7DD3FC' },
  { id: 'shoulders', label: 'Shoulders', color: '#FCD34D' },
  { id: 'arms', label: 'Arms', color: '#F472B6' },
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
  { name: 'Barbell Curl', bodyPart: 'arms' },
  { name: 'Tricep Pushdown', bodyPart: 'arms' },
  { name: 'Hammer Curl', bodyPart: 'arms' },
  { name: 'Tricep Extension', bodyPart: 'arms' },
  { name: 'Preacher Curl', bodyPart: 'arms' },
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

const STORAGE_KEY = 'gymbuddy-log-v1';
const IOS_HINT_KEY = 'gymbuddy-ios-hint-shown';

/* ---------- Utilities ---------- */
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtFullDate = (iso) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const bp = (id) => BODY_PARTS.find(b => b.id === id) || BODY_PARTS[0];
const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
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

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
      // Migrate old set-based entries if present (from earlier prototype)
      state.entries = (state.entries || []).map(e => {
        if (Array.isArray(e.sets) && (e.weight === undefined)) {
          const top = e.sets.reduce((max, s) => (s.weight > max.weight ? s : max), e.sets[0]);
          return { id: e.id, exerciseId: e.exerciseId, date: e.date, weight: top.weight, reps: top.reps, photo: null, notes: e.notes || '', createdAt: e.createdAt };
        }
        return e;
      });
      return;
    }
  } catch (e) {}
  state = {
    exercises: SEED_EXERCISES.map(e => ({ id: uid(), ...e, createdAt: new Date().toISOString() })),
    entries: [],
  };
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    showToast('Storage full. Export and delete old entries.', 'error');
  }
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
  setTimeout(() => { if (root.contains(toast)) root.removeChild(toast); }, 2400);
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
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  camera: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  image: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  imageLg: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  target: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  chart: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  calendar: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  trophy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 13 20.24 13 22"/><path d="M14 14.66V17c0 .55-.47.98-.97 1.21C11.96 18.75 11 20.24 11 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  arrowUp: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
  arrowDown: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>',
  minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
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
  else if (currentView === 'progress') renderProgress(root);
  else if (currentView === 'history') renderHistory(root);
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
    <div class="section-title">Today</div>
    <div class="date-line">${fmtFullDate(today)}</div>
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
    html += todayEntries.map(entry => entryCardHTML(entry)).join('');
  }

  html += `<button id="log-btn" class="btn-primary">${ICONS.plus}<span>Log a Weight</span></button>`;
  root.innerHTML = html;

  document.getElementById('log-btn').addEventListener('click', openExercisePicker);
  attachEntryCardHandlers();
}

/* Render a single entry as a card. opts: { showDelete } */
function entryCardHTML(entry, opts = {}) {
  const ex = state.exercises.find(x => x.id === entry.exerciseId);
  if (!ex) return '';
  const b = bp(ex.bodyPart);

  // Compute previous PB at time of this entry (for delta display)
  const previousEntries = state.entries
    .filter(e => e.exerciseId === entry.exerciseId && e.createdAt < entry.createdAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const prev = previousEntries[0];
  let deltaHTML = '';
  if (prev) {
    const d = entry.weight - prev.weight;
    if (d > 0) {
      deltaHTML = `<div class="delta up">${ICONS.arrowUp}<span>+${d}kg vs last</span></div>`;
    } else if (d < 0) {
      deltaHTML = `<div class="delta down">${ICONS.arrowDown}<span>${d}kg vs last</span></div>`;
    } else {
      deltaHTML = `<div class="delta same">${ICONS.minus}<span>same weight</span></div>`;
    }
  } else {
    deltaHTML = `<div class="delta first"><span>first entry</span></div>`;
  }

  return `
    <div class="entry-card">
      ${opts.showDelete ? `<button class="delete-btn" data-delete-entry="${entry.id}" aria-label="Delete entry">${ICONS.trash}</button>` : ''}
      <div class="entry-card-top">
        <div style="flex:1;min-width:0">
          <div class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44">${b.label}</div>
          <div class="exercise-name">${escapeHtml(ex.name)}</div>
          ${deltaHTML}
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

  if (viewContext.formWeight === undefined) {
    viewContext.formWeight = recent?.weight ?? '';
    viewContext.formReps = recent?.reps ?? '';
    viewContext.formNotes = '';
    viewContext.formPhoto = null;
  }

  const renderForm = () => {
    root.innerHTML = `
      <button id="back-btn" class="btn-back">${ICONS.back}<span>Back</span></button>
      <div class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44;display:inline-block;margin-bottom:8px">${b.label}</div>
      <div class="form-title">${escapeHtml(exercise.name)}</div>
      ${recent ? `
        <div class="last-set-hint">
          Last entry: ${fmtDate(recent.date)} · ${recent.weight}kg × ${recent.reps} reps${allTimePB !== null && allTimePB !== recent.weight ? ` · PB ${allTimePB}kg` : ''}
        </div>
      ` : ''}

      <div class="weight-row">
        <div class="weight-field">
          <div class="list-label">Weight (kg)</div>
          <input type="number" inputmode="decimal" id="weight-input" class="num-input-big" placeholder="0" value="${viewContext.formWeight}" />
        </div>
        <div class="weight-field">
          <div class="list-label">Reps</div>
          <input type="number" inputmode="numeric" id="reps-input" class="num-input-big" placeholder="0" value="${viewContext.formReps}" />
        </div>
      </div>

      <div class="list-label" style="margin-top:20px">Attachment / Setup Photo (optional)</div>
      <div class="photo-help">For exercises with attachments you don't know the name of (cable handles, machine settings, etc.). The photo is saved with this entry as a visual note.</div>
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

      <div class="list-label" style="margin-top:20px">Notes (optional)</div>
      <textarea id="notes-input" class="textarea" rows="2" placeholder="setup notes, form cues, machine pin position…">${escapeHtml(viewContext.formNotes)}</textarea>

      <button id="save-btn" class="btn-primary">${ICONS.check}<span>Save Entry</span></button>
    `;

    document.getElementById('back-btn').addEventListener('click', () => {
      viewContext = {};
      render();
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
          const compressed = await compressPhoto(file);
          viewContext.formPhoto = compressed;
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
      const w = Number(viewContext.formWeight);
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
        photo: viewContext.formPhoto || null,
        notes: viewContext.formNotes || '',
        createdAt: new Date().toISOString(),
      };

      // Check if this is a new PB
      const prevPB = allTimePB;
      const isNewPB = prevPB === null || w > prevPB;

      state.entries = [entry, ...state.entries];
      saveState();
      viewContext = {};
      render();
      if (isNewPB && prevPB !== null) {
        showToast(`New PB! ${w}kg (was ${prevPB}kg) 🎉`);
      } else if (isNewPB) {
        showToast(`Logged ${exercise.name} · ${w}kg`);
      } else {
        showToast(`Logged ${exercise.name} · ${w}kg`);
      }
    });

    updateSaveBtn();
  };

  const updateSaveBtn = () => {
    const btn = document.getElementById('save-btn');
    if (!btn) return;
    const valid = viewContext.formWeight !== '' && viewContext.formReps !== '' && Number(viewContext.formWeight) > 0 && Number(viewContext.formReps) > 0;
    btn.disabled = !valid;
    btn.style.opacity = valid ? '1' : '0.4';
  };

  renderForm();
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
          return `
            <button class="exercise-row" data-pick-ex="${ex.id}">
              <div class="body-dot" style="background:${b.color}"></div>
              <span>${escapeHtml(ex.name)}</span>
              <span style="font-size:11px;color:#666">${b.label}</span>
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

  body.innerHTML = `
    <div class="search-wrap">
      ${ICONS.search}
      <input type="text" id="picker-search" class="search-input" placeholder="Search exercises…" />
    </div>
    <div class="chips-row" id="picker-chips">
      <button class="chip active" data-bp="">All</button>
      ${BODY_PARTS.map(b => `<button class="chip" data-bp="${b.id}">${b.label}</button>`).join('')}
    </div>
    <div class="exercise-list"></div>
    <button id="picker-add-new" class="btn-outline">${ICONS.plus}<span>Add New Exercise</span></button>
  `;

  document.getElementById('picker-search').addEventListener('input', (e) => {
    search = e.target.value;
    renderList();
  });

  const renderChips = () => {
    const chipsEl = document.getElementById('picker-chips');
    chipsEl.innerHTML = `
      <button class="chip ${bodyFilter === null ? 'active' : ''}" data-bp="">All</button>
      ${BODY_PARTS.map(b => `
        <button class="chip ${bodyFilter === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyFilter === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>
      `).join('')}
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

/* ---------- Exercise Adder (manual only) ---------- */
function openExerciseAdder(onAdded) {
  const modal = createModal('Add Exercise');
  const body = modal.body;

  let name = '';
  let bodyPart = 'chest';

  body.innerHTML = `
    <div class="list-label">Exercise Name</div>
    <input type="text" id="ex-name" class="text-input" placeholder="e.g. Lat Pulldown" value="" />
    <div class="list-label" style="margin-top:16px">Body Part</div>
    <div class="chips-row" id="adder-chips">
      ${BODY_PARTS.map(b => `<button class="chip ${bodyPart === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyPart === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    </div>
    <button id="add-ex-btn" class="btn-primary" disabled style="opacity:0.4">${ICONS.check}<span>Add Exercise</span></button>
  `;

  const nameInput = document.getElementById('ex-name');
  const addBtn = document.getElementById('add-ex-btn');
  nameInput.addEventListener('input', (e) => {
    name = e.target.value;
    addBtn.disabled = !name.trim();
    addBtn.style.opacity = name.trim() ? '1' : '0.4';
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
    const newEx = { id: uid(), name: trimmed, bodyPart, createdAt: new Date().toISOString() };
    state.exercises.push(newEx);
    saveState();
    showToast(`Added ${trimmed}`);
    closeModal();
    if (onAdded) onAdded(newEx);
    else render();
  });

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
        ${list.map(ex => `
          <div class="exercise-row-card">
            <span style="flex:1">${escapeHtml(ex.name)}</span>
            <span class="exercise-count">${counts[ex.id] ? `${counts[ex.id]} log${counts[ex.id] > 1 ? 's' : ''}` : 'new'}</span>
            <button class="icon-btn-plain" data-delete-ex="${ex.id}" aria-label="Delete">${ICONS.trash}</button>
          </div>
        `).join('')}
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
  };
  attachExHandlers();

  document.getElementById('add-ex-trigger').addEventListener('click', () => {
    openExerciseAdder(() => renderExercises(root));
  });
}

/* ---------- Progress View (PB-focused) ---------- */
function renderProgress(root) {
  if (viewContext.selectedProgressEx) {
    renderProgressDetail(root, viewContext.selectedProgressEx);
    return;
  }

  const bodyFilter = viewContext.progFilter || null;

  const byEx = {};
  for (const e of state.entries) {
    if (!byEx[e.exerciseId]) byEx[e.exerciseId] = [];
    byEx[e.exerciseId].push(e);
  }

  // Stats per body part: PB count and heaviest lift
  const bodyPartStats = {};
  for (const b of BODY_PARTS) bodyPartStats[b.id] = { exerciseCount: 0, heaviest: 0, heaviestExName: '' };
  for (const ex of state.exercises) {
    const entries = byEx[ex.id];
    if (!entries || entries.length === 0) continue;
    const pb = Math.max(...entries.map(e => e.weight));
    bodyPartStats[ex.bodyPart].exerciseCount += 1;
    if (pb > bodyPartStats[ex.bodyPart].heaviest) {
      bodyPartStats[ex.bodyPart].heaviest = pb;
      bodyPartStats[ex.bodyPart].heaviestExName = ex.name;
    }
  }

  const exercisesWithData = state.exercises
    .filter(ex => byEx[ex.id] && byEx[ex.id].length > 0)
    .filter(ex => !bodyFilter || ex.bodyPart === bodyFilter)
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

    ${totalTracked > 0 ? `
      <div class="overview-card">
        <div class="overview-title">PBs by Body Part</div>
        <div class="overview-sub">Heaviest lift in each muscle group</div>
        <div class="bp-grid">
          ${BODY_PARTS.map(b => {
            const s = bodyPartStats[b.id];
            return `
              <div class="bp-stat" style="border-color:${b.color}33">
                <div class="bp-stat-label" style="color:${b.color}">${b.label}</div>
                ${s.heaviest > 0 ? `
                  <div class="bp-stat-weight">${s.heaviest}<span class="stat-unit">kg</span></div>
                  <div class="bp-stat-ex">${escapeHtml(s.heaviestExName)}</div>
                  <div class="bp-stat-count">${s.exerciseCount} exercise${s.exerciseCount > 1 ? 's' : ''}</div>
                ` : `
                  <div class="bp-stat-empty">—</div>
                  <div class="bp-stat-count">not logged</div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}

    <div class="chips-row" style="margin-top:18px" id="prog-chips">
      <button class="chip ${bodyFilter === null ? 'active' : ''}" data-bp="">All</button>
      ${BODY_PARTS.map(b => `<button class="chip ${bodyFilter === b.id ? 'active' : ''}" data-bp="${b.id}" ${bodyFilter === b.id ? `style="background:${b.color}22;color:${b.color};border-color:${b.color}"` : ''}>${b.label}</button>`).join('')}
    </div>

    ${exercisesWithData.length === 0 ? `
      <div class="empty-state">
        ${ICONS.chart}
        <div class="empty-title">Nothing to show yet</div>
        <div class="empty-sub">Log some weights and your PBs will appear here</div>
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
          return `
            <button class="progress-row" data-prog-ex="${ex.id}">
              <div style="flex:1;min-width:0">
                <div class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44;display:inline-block;font-size:9px">${b.label}</div>
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

  // Chart data: top weight per entry (one point per logged entry)
  const chartData = entries.map(e => ({
    date: fmtDate(e.date),
    weight: e.weight,
  }));

  root.innerHTML = `
    <button id="prog-back" class="btn-back">${ICONS.back}<span>Back</span></button>
    <div class="body-part-chip" style="background:${b.color}22;color:${b.color};border-color:${b.color}44;display:inline-block;margin-bottom:8px">${b.label}</div>
    <div class="form-title">${escapeHtml(exercise.name)}</div>

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
      ${entries.slice().reverse().map(e => entryCardHTML(e, { showDelete: true })).join('')}
    </div>
  `;

  document.getElementById('prog-back').addEventListener('click', () => {
    viewContext.selectedProgressEx = null;
    renderProgress(root);
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
        ${byDate[date].map(e => entryCardHTML(e, { showDelete: true })).join('')}
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
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('[data-close-modal]').addEventListener('click', closeModal);
  return { overlay, body: overlay.querySelector('[data-modal-body]') };
}
function closeModal() {
  document.getElementById('modal-root').innerHTML = '';
}

/* ---------- Menu (export, import, reset) ---------- */
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
      <span style="color:#888">Photos take significant space. On iOS, export weekly. iOS may clear PWA storage if unused for ~7 weeks.</span>
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
  render();
  maybeShowIOSHint();
}

document.addEventListener('DOMContentLoaded', init);
