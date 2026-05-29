// College Survival Kit - Pure Frontend Controller
// Author: Antigravity

// ============================================================================
// 1. GLOBAL STATE & LOCAL STORAGE UTILITIES
// ============================================================================

const STATE_KEYS = {
  theme: 'csk_theme',
  attendance: 'csk_attendance',
  gpa: 'csk_gpa',
  gpaScale: 'csk_gpa_scale',
  assignments: 'csk_assignments',
  viva: 'csk_viva_custom',
  expenses: 'csk_expenses',
  panic: 'csk_panic'
};

// Helper: Save to local storage
function saveState(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save failed: ", e);
  }
}

// Helper: Load from local storage
function loadState(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error("Storage load failed: ", e);
    return defaultVal;
  }
}

// Mock Data for Initial Load (so the app looks gorgeous right away)
const mockAttendance = [
  { id: '1', name: 'Computer Networks', attended: 16, total: 20, target: 75 },
  { id: '2', name: 'Artificial Intelligence', attended: 11, total: 15, target: 75 },
  { id: '3', name: 'Discrete Mathematics', attended: 7, total: 11, target: 75 },
  { id: '4', name: 'Compiler Design Lab', attended: 5, total: 5, target: 80 }
];

const mockGPA = [
  {
    id: 'sem-1',
    name: 'Semester 1',
    courses: [
      { name: 'Engineering Mathematics I', credits: 4, grade: 'A' },
      { name: 'Applied Physics', credits: 3, grade: 'B+' },
      { name: 'Introduction to Programming', credits: 4, grade: 'O' },
      { name: 'Engineering Chemistry', credits: 3, grade: 'A+' }
    ]
  },
  {
    id: 'sem-2',
    name: 'Semester 2',
    courses: [
      { name: 'Data Structures & Algorithms', credits: 4, grade: 'A+' },
      { name: 'Digital Logic Design', credits: 3, grade: 'B' },
      { name: 'Environmental Sciences', credits: 2, grade: 'A' },
      { name: 'Object Oriented Programming', credits: 4, grade: 'O' }
    ]
  }
];

const mockAssignments = [
  { id: 'a1', title: 'Socket Programming Lab', subject: 'Computer Networks', due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString().substring(0, 16), priority: 'high', completed: false },
  { id: 'a2', title: 'NLP Chatbot Assignment', subject: 'Artificial Intelligence', due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16), priority: 'medium', completed: false },
  { id: 'a3', title: 'Turing Machine Slides', subject: 'Theory of Computation', due: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16), priority: 'low', completed: true }
];

const mockExpenses = [
  { id: 'e1', name: 'Double Espresso (Exam fuel)', cost: 4.50, category: 'coffee', date: new Date().toLocaleDateString() },
  { id: 'e2', name: 'Cheese French Fries (Comfort food)', cost: 6.00, category: 'snacks', date: new Date().toLocaleDateString() },
  { id: 'e3', name: 'Double Patty Regret Burger', cost: 8.50, category: 'regret', date: new Date().toLocaleDateString() }
];

const mockPanic = {
  examDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  syllabusPercent: 35,
  chaptersRemaining: 8
};

// State caches
let appState = {
  attendance: loadState(STATE_KEYS.attendance, mockAttendance),
  gpa: loadState(STATE_KEYS.gpa, mockGPA),
  gpaScale: loadState(STATE_KEYS.gpaScale, '10'),
  assignments: loadState(STATE_KEYS.assignments, mockAssignments),
  vivaCustom: loadState(STATE_KEYS.viva, []),
  expenses: loadState(STATE_KEYS.expenses, mockExpenses),
  panic: loadState(STATE_KEYS.panic, mockPanic)
};

// ============================================================================
// 2. DAILY STUDENT SURVIVAL QUOTES
// ============================================================================

const STUDENT_QUOTES = [
  "Sleep is a myth. Caffeine is a food group.",
  "My HOD does not approve of this website. That's how you know it's good.",
  "A syllabus is just a list of things I won't have time to study before 4 AM.",
  "There are two types of students: those who finish early, and those who are reading this.",
  "May your Wi-Fi be fast, your coffee strong, and your examiner blind.",
  "Every deadline is just a recommendation if you are brave enough.",
  "You cannot fail if you never check your grades. Simple chemistry.",
  "I am in a committed relationship with my bed, but my alarm keeps trying to break us up.",
  "10% syllabus done. 90% hope. 100% chance of crying at 3:00 AM.",
  "I have 99 problems, and 98 of them are due by midnight tonight.",
  "I came, I saw, I had no idea what was on the exam.",
  "The slides say 'Easy to understand', the code says 'SyntaxError', my mind says 'Join the circus'."
];

function initQuoteSystem() {
  const quoteText = document.getElementById('quote-display');
  const quoteWidget = document.querySelector('.quote-widget');
  
  function rotateQuote() {
    const idx = Math.floor(Math.random() * STUDENT_QUOTES.length);
    quoteText.textContent = `"${STUDENT_QUOTES[idx]}"`;
  }
  
  rotateQuote();
  setInterval(rotateQuote, 12000); // rotate every 12s
  
  quoteWidget.addEventListener('click', rotateQuote);
}

// ============================================================================
// 3. THEME MANAGER & ROUTER (NAVIGATION)
// ============================================================================

function initThemeAndNavigation() {
  const body = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeBtnText = document.getElementById('theme-btn-text');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  // Load saved theme
  const savedTheme = localStorage.getItem(STATE_KEYS.theme) || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeUI(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem(STATE_KEYS.theme, newTheme);
    updateThemeUI(newTheme);
  });

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      themeBtnText.textContent = 'Light Mode';
      sunIcon.style.display = 'inline-block';
      moonIcon.style.display = 'none';
    } else {
      themeBtnText.textContent = 'Dark Mode';
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline-block';
    }
  }

  // Sidebar Router
  const navLinks = document.querySelectorAll('.menu-link');
  const panels = document.querySelectorAll('.panel');
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update active panel
      const targetPanel = link.getAttribute('data-panel');
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(`${targetPanel}-panel`).classList.add('active');

      // Close mobile sidebar
      sidebar.classList.remove('open');
      
      // Update Lucide icons inside dynamic templates just in case
      lucide.createIcons();
    });
  });

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar on click outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ============================================================================
// 4. FLOATING ELEMENTS BACKGROUND GENERATOR
// ============================================================================

function initFloatingElements() {
  const container = document.getElementById('floating-bg');
  const emojis = ['📚', '☕', '✏️', '📝', '💻', '📄'];
  const count = 18; // total floating items

  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'floating-item';
    item.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Randomize initial positions & animation durations
    item.style.left = `${Math.random() * 100}%`;
    item.style.top = `${Math.random() * 100}%`;
    item.style.fontSize = `${1.5 + Math.random() * 2}rem`;
    
    const duration = 15 + Math.random() * 20; // 15s to 35s
    const delay = -(Math.random() * duration); // starts animating immediately
    
    item.style.animationDuration = `${duration}s`;
    item.style.animationDelay = `${delay}s`;
    
    container.appendChild(item);
  }
}

// ============================================================================
// 5. ATTENDANCE CALCULATOR MODULE
// ============================================================================

function initAttendanceModule() {
  const container = document.getElementById('subjects-container');
  const addBtn = document.getElementById('add-subject-btn');
  
  const inName = document.getElementById('subject-name');
  const inAttended = document.getElementById('subject-attended');
  const inTotal = document.getElementById('subject-total');
  const inTarget = document.getElementById('subject-target');

  function renderAttendance() {
    container.innerHTML = '';
    
    if (appState.attendance.length === 0) {
      container.innerHTML = `
        <div class="glass" style="padding: 20px; text-align: center; color: var(--text-muted);">
          No subjects added. Add your classes above to check bunker privileges!
        </div>
      `;
      updateDashboardStats();
      return;
    }

    appState.attendance.forEach(sub => {
      const attended = Number(sub.attended);
      const total = Number(sub.total);
      const target = Number(sub.target);
      
      let percent = 0;
      if (total > 0) {
        percent = Math.round((attended / total) * 100);
      } else if (attended > 0) {
        percent = 100;
      }

      let statusText = '';
      let statusClass = 'badge-medium';
      let adviceText = '';

      if (total === 0) {
        adviceText = "Attend your first class to unlock prediction analysis.";
        statusClass = 'badge-low';
        statusText = 'No Lectures';
      } else if (percent >= target) {
        statusClass = 'badge-success';
        statusText = 'SAFE';
        // Calculate bunkable classes
        // (A) / (T + x) >= P / 100
        // x <= (100A - P*T) / P
        const maxBunk = Math.floor((100 * attended - target * total) / target);
        if (maxBunk > 0) {
          adviceText = `🔥 You are safe! You can bunk the next <strong>${maxBunk}</strong> class${maxBunk > 1 ? 'es' : ''} consecutively.`;
        } else {
          adviceText = "You are on the limit! Bunking the next lecture will push you into warning zone.";
        }
      } else {
        statusClass = 'badge-high';
        statusText = 'DANGER';
        // Calculate classes to attend
        // (A + y) / (T + y) >= P / 100
        // y >= (P*T - 100A) / (100 - P)
        if (target === 100) {
          adviceText = "⚠️ You missed a class, 100% target is mathematically impossible now.";
        } else {
          const reqAttend = Math.ceil((target * total - 100 * attended) / (100 - target));
          adviceText = `⚠️ Attendance below limit! You MUST attend the next <strong>${reqAttend}</strong> class${reqAttend > 1 ? 'es' : ''} consecutively to reach ${target}%.`;
        }
      }

      const card = document.createElement('div');
      card.className = 'glass attendance-card glass-hover';
      card.innerHTML = `
        <div>
          <h3 style="font-size: 1.1rem; margin-bottom: 4px;">${sub.name}</h3>
          <span class="badge ${statusClass}">${statusText} (${percent}%)</span>
        </div>
        <div style="text-align: center;">
          <span class="form-label" style="margin-bottom: 2px;">Attended</span>
          <div class="flex-gap-10" style="justify-content: center; align-items: center;">
            <button class="btn btn-secondary btn-icon dec-att" data-id="${sub.id}" style="width:24px; height:24px; padding:0;">-</button>
            <strong style="min-width: 20px;">${attended}</strong>
            <button class="btn btn-secondary btn-icon inc-att" data-id="${sub.id}" style="width:24px; height:24px; padding:0;">+</button>
          </div>
        </div>
        <div style="text-align: center;">
          <span class="form-label" style="margin-bottom: 2px;">Total lectures</span>
          <div class="flex-gap-10" style="justify-content: center; align-items: center;">
            <button class="btn btn-secondary btn-icon dec-tot" data-id="${sub.id}" style="width:24px; height:24px; padding:0;">-</button>
            <strong style="min-width: 20px;">${total}</strong>
            <button class="btn btn-secondary btn-icon inc-tot" data-id="${sub.id}" style="width:24px; height:24px; padding:0;">+</button>
          </div>
        </div>
        <div class="flex-between" style="grid-column: span 1; gap: 10px;">
          <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 180px;">${adviceText}</p>
          <button class="btn btn-secondary btn-icon delete-sub" data-id="${sub.id}" style="border-color: rgba(239,68,68,0.2); color: var(--danger);"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      container.appendChild(card);
    });

    lucide.createIcons();
    updateDashboardStats();
  }

  // Add subject action
  addBtn.addEventListener('click', () => {
    const name = inName.value.trim();
    const att = Math.max(0, parseInt(inAttended.value) || 0);
    const tot = Math.max(att, parseInt(inTotal.value) || 0);
    const tar = Math.min(100, Math.max(1, parseInt(inTarget.value) || 75));

    if (!name) {
      alert("Please enter a subject name.");
      return;
    }

    const newSub = {
      id: Date.now().toString(),
      name,
      attended: att,
      total: tot,
      target: tar
    };

    appState.attendance.push(newSub);
    saveState(STATE_KEYS.attendance, appState.attendance);
    renderAttendance();

    // Reset fields
    inName.value = '';
    inAttended.value = '0';
    inTotal.value = '0';
    inTarget.value = '75';
  });

  // Delegation click handlers
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const idx = appState.attendance.findIndex(s => s.id === id);
    if (idx === -1) return;

    if (btn.classList.contains('inc-att')) {
      appState.attendance[idx].attended++;
      if (appState.attendance[idx].attended > appState.attendance[idx].total) {
        appState.attendance[idx].total = appState.attendance[idx].attended;
      }
    } else if (btn.classList.contains('dec-att')) {
      appState.attendance[idx].attended = Math.max(0, appState.attendance[idx].attended - 1);
    } else if (btn.classList.contains('inc-tot')) {
      appState.attendance[idx].total++;
    } else if (btn.classList.contains('dec-tot')) {
      appState.attendance[idx].total = Math.max(appState.attendance[idx].attended, appState.attendance[idx].total - 1);
    } else if (btn.classList.contains('delete-sub')) {
      appState.attendance.splice(idx, 1);
    }

    saveState(STATE_KEYS.attendance, appState.attendance);
    renderAttendance();
  });

  renderAttendance();
}

// ============================================================================
// 6. CGPA / SGPA CALCULATOR MODULE
// ============================================================================

const GRADE_POINTS_10 = { 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0 };
const GRADE_POINTS_4 = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0 };

function initGPAModule() {
  const semestersWrapper = document.getElementById('semesters-wrapper');
  const addSemBtn = document.getElementById('add-semester-btn');
  const scaleRadios = document.querySelectorAll('input[name="gpa-scale"]');

  // Load selected scale
  const savedScale = appState.gpaScale;
  scaleRadios.forEach(radio => {
    if (radio.value === savedScale) radio.checked = true;
  });

  scaleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      appState.gpaScale = e.target.value;
      saveState(STATE_KEYS.gpaScale, appState.gpaScale);
      recalculateCGPA();
      renderGPA();
    });
  });

  function renderGPA() {
    semestersWrapper.innerHTML = '';
    
    if (appState.gpa.length === 0) {
      semestersWrapper.innerHTML = `
        <div class="glass" style="padding: 20px; text-align: center; color: var(--text-muted); margin-bottom: 20px;">
          No semesters configured. Add a semester below to compute GPA logs.
        </div>
      `;
      return;
    }

    const currentScale = appState.gpaScale;
    const grades = currentScale === '10' ? Object.keys(GRADE_POINTS_10) : Object.keys(GRADE_POINTS_4);

    appState.gpa.forEach((sem, semIdx) => {
      const semCard = document.createElement('div');
      semCard.className = 'glass gpa-sem-container';
      semCard.style.padding = '20px';
      semCard.style.borderLeft = '4px solid var(--accent-secondary)';
      
      let rowsHTML = '';
      sem.courses.forEach((c, cIdx) => {
        let optionsHTML = '';
        grades.forEach(g => {
          optionsHTML += `<option value="${g}" ${c.grade === g ? 'selected' : ''}>${g}</option>`;
        });

        rowsHTML += `
          <div class="course-row" data-sem-idx="${semIdx}" data-course-idx="${cIdx}">
            <input type="text" class="form-input course-name-in" value="${c.name}" placeholder="Course Name">
            <input type="number" class="form-input course-credits-in" value="${c.credits}" min="1" placeholder="Credits">
            <select class="form-select course-grade-in">
              ${optionsHTML}
            </select>
            <button class="btn btn-secondary btn-icon delete-course-btn" style="color:var(--danger); border-color:rgba(239,68,68,0.15);"><i data-lucide="trash-2"></i></button>
          </div>
        `;
      });

      const sgpa = calculateSGPA(sem);

      semCard.innerHTML = `
        <div class="flex-between" style="margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
          <h3 style="font-size: 1.15rem; color: var(--text-primary);">${sem.name}</h3>
          <div class="flex-gap-10" style="align-items: center;">
            <span class="badge badge-success" style="font-size: 0.85rem;">SGPA: ${sgpa.toFixed(2)}</span>
            <button class="btn btn-secondary btn-icon delete-sem-btn" data-sem-idx="${semIdx}" title="Delete Semester"><i data-lucide="folder-x"></i></button>
          </div>
        </div>
        <div class="course-rows-container">
          ${rowsHTML}
        </div>
        <button class="btn btn-secondary add-course-btn" data-sem-idx="${semIdx}" style="margin-top: 10px; font-size: 0.8rem; padding: 6px 12px;">
          <i data-lucide="plus"></i> Add Course
        </button>
      `;

      semestersWrapper.appendChild(semCard);
    });

    lucide.createIcons();
    recalculateCGPA();
  }

  function calculateSGPA(sem) {
    const scale = appState.gpaScale;
    const gradePointsMap = scale === '10' ? GRADE_POINTS_10 : GRADE_POINTS_4;
    
    let totalCreds = 0;
    let earnedPoints = 0;

    sem.courses.forEach(c => {
      const credits = Number(c.credits) || 0;
      const pt = gradePointsMap[c.grade] !== undefined ? gradePointsMap[c.grade] : 0;
      totalCreds += credits;
      earnedPoints += credits * pt;
    });

    return totalCreds > 0 ? (earnedPoints / totalCreds) : 0.0;
  }

  function recalculateCGPA() {
    const scale = appState.gpaScale;
    const gradePointsMap = scale === '10' ? GRADE_POINTS_10 : GRADE_POINTS_4;

    let grandCredits = 0;
    let grandPoints = 0;

    appState.gpa.forEach(sem => {
      sem.courses.forEach(c => {
        const credits = Number(c.credits) || 0;
        const pt = gradePointsMap[c.grade] !== undefined ? gradePointsMap[c.grade] : 0;
        grandCredits += credits;
        grandPoints += credits * pt;
      });
    });

    const cgpa = grandCredits > 0 ? (grandPoints / grandCredits) : 0.0;
    
    document.getElementById('cgpa-value').textContent = cgpa.toFixed(2);
    document.getElementById('gpa-total-credits').textContent = grandCredits.toString();
    
    updateDashboardStats();
  }

  // Add Semester Event
  addSemBtn.addEventListener('click', () => {
    const semNum = appState.gpa.length + 1;
    appState.gpa.push({
      id: `sem-${Date.now()}`,
      name: `Semester ${semNum}`,
      courses: [{ name: 'New Course', credits: 3, grade: 'A' }]
    });
    saveState(STATE_KEYS.gpa, appState.gpa);
    renderGPA();
  });

  // Event Delegation for course modification and deletions
  semestersWrapper.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('add-course-btn')) {
      const semIdx = btn.getAttribute('data-sem-idx');
      appState.gpa[semIdx].courses.push({ name: '', credits: 3, grade: 'A' });
      saveState(STATE_KEYS.gpa, appState.gpa);
      renderGPA();
    } 
    else if (btn.classList.contains('delete-course-btn')) {
      const row = btn.closest('.course-row');
      const semIdx = row.getAttribute('data-sem-idx');
      const courseIdx = row.getAttribute('data-course-idx');
      appState.gpa[semIdx].courses.splice(courseIdx, 1);
      saveState(STATE_KEYS.gpa, appState.gpa);
      renderGPA();
    }
    else if (btn.classList.contains('delete-sem-btn')) {
      const semIdx = btn.getAttribute('data-sem-idx');
      if (confirm(`Delete ${appState.gpa[semIdx].name}? All course records will be lost.`)) {
        appState.gpa.splice(semIdx, 1);
        saveState(STATE_KEYS.gpa, appState.gpa);
        renderGPA();
      }
    }
  });

  // Track inputs to save edits dynamically
  semestersWrapper.addEventListener('input', (e) => {
    const input = e.target;
    const row = input.closest('.course-row');
    if (!row) return;

    const semIdx = row.getAttribute('data-sem-idx');
    const courseIdx = row.getAttribute('data-course-idx');

    if (input.classList.contains('course-name-in')) {
      appState.gpa[semIdx].courses[courseIdx].name = input.value;
    } else if (input.classList.contains('course-credits-in')) {
      appState.gpa[semIdx].courses[courseIdx].credits = Math.max(1, parseInt(input.value) || 1);
    }

    saveState(STATE_KEYS.gpa, appState.gpa);
    recalculateCGPA();
  });

  semestersWrapper.addEventListener('change', (e) => {
    const select = e.target;
    if (!select.classList.contains('course-grade-in')) return;
    const row = select.closest('.course-row');
    if (!row) return;

    const semIdx = row.getAttribute('data-sem-idx');
    const courseIdx = row.getAttribute('data-course-idx');
    appState.gpa[semIdx].courses[courseIdx].grade = select.value;
    
    saveState(STATE_KEYS.gpa, appState.gpa);
    recalculateCGPA();
    renderGPA();
  });

  renderGPA();
}

// ============================================================================
// 7. ASSIGNMENT TRACKER MODULE
// ============================================================================

function initAssignmentsModule() {
  const container = document.getElementById('assignments-container');
  const addBtn = document.getElementById('add-assign-btn');
  const inTitle = document.getElementById('assign-title');
  const inSubject = document.getElementById('assign-subject');
  const inDue = document.getElementById('assign-due');
  const inPriority = document.getElementById('assign-priority');

  // Filter Buttons
  const filterAll = document.getElementById('filter-all');
  const filterPending = document.getElementById('filter-pending');
  const filterDone = document.getElementById('filter-done');
  let currentFilter = 'all'; // 'all', 'pending', 'done'

  // Initialize due date value to today + 2 days
  const defaultDue = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  defaultDue.setMinutes(defaultDue.getMinutes() - defaultDue.getTimezoneOffset());
  inDue.value = defaultDue.toISOString().substring(0, 16);

  function getPriorityBadge(priority) {
    if (priority === 'high') return '<span class="badge badge-high">High Panic</span>';
    if (priority === 'medium') return '<span class="badge badge-medium">Medium</span>';
    return '<span class="badge badge-low">Relaxed</span>';
  }

  function renderAssignments() {
    container.innerHTML = '';
    
    let list = appState.assignments;
    if (currentFilter === 'pending') list = list.filter(a => !a.completed);
    if (currentFilter === 'done') list = list.filter(a => a.completed);

    if (list.length === 0) {
      container.innerHTML = `
        <div class="glass" style="padding: 20px; text-align: center; color: var(--text-muted);">
          No assignments found matching selection. Rest easy... for now.
        </div>
      `;
      updateDashboardStats();
      return;
    }

    // Sort: incomplete first, high priority first, then closest due date
    list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      const pMap = { high: 3, medium: 2, low: 1 };
      const priorityA = pMap[a.priority] || 1;
      const priorityB = pMap[b.priority] || 1;
      if (priorityA !== priorityB) return priorityB - priorityA;

      return new Date(a.due) - new Date(b.due);
    });

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = `glass assignment-item glass-hover ${item.completed ? 'completed-task' : ''}`;
      if (item.completed) card.style.opacity = '0.6';

      card.innerHTML = `
        <div class="flex-gap-20" style="align-items: center; flex-grow: 1;">
          <input type="checkbox" class="assign-check" data-id="${item.id}" ${item.completed ? 'checked' : ''} style="transform: scale(1.4); cursor: pointer; accent-color: var(--accent-primary);">
          <div>
            <h4 style="font-size: 1.05rem; text-decoration: ${item.completed ? 'line-through' : 'none'};">${item.title}</h4>
            <div class="flex-gap-10" style="margin-top: 4px; align-items: center; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; color: var(--text-secondary);"><i data-lucide="book" style="width:12px;height:12px;display:inline;"></i> ${item.subject}</span>
              ${getPriorityBadge(item.priority)}
            </div>
          </div>
        </div>
        <div class="flex-between" style="gap: 16px; width: 100%; max-width: 320px; justify-content: flex-end;">
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 500;">Due: ${new Date(item.due).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</div>
            <div class="countdown-timer" data-due="${item.due}" data-completed="${item.completed}" style="font-size: 0.85rem; font-weight: 700; color: var(--accent-pink); margin-top: 2px;">
              Calculating...
            </div>
          </div>
          <button class="btn btn-secondary btn-icon delete-assign" data-id="${item.id}" style="color:var(--danger); border-color:rgba(239,68,68,0.15);"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      container.appendChild(card);
    });

    lucide.createIcons();
    updateDashboardStats();
  }

  // Countdown timer loop
  function updateCountdowns() {
    const timers = document.querySelectorAll('.countdown-timer');
    timers.forEach(t => {
      const completed = t.getAttribute('data-completed') === 'true';
      if (completed) {
        t.textContent = 'Completed';
        t.style.color = 'var(--success)';
        return;
      }

      const dueTime = new Date(t.getAttribute('data-due')).getTime();
      const now = Date.now();
      const diff = dueTime - now;

      if (diff <= 0) {
        t.textContent = 'OVERDUE!';
        t.style.color = 'var(--danger)';
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const secs = Math.floor((diff % (60 * 1000)) / 1000);

      let text = '';
      if (days > 0) text += `${days}d `;
      text += `${hours}h ${mins}m ${secs}s left`;
      
      t.textContent = text;
      
      // Color coded panic
      if (days === 0 && hours < 6) {
        t.style.color = 'var(--danger)';
        t.classList.add('pulse-glow');
      } else if (days === 0) {
        t.style.color = 'var(--warning)';
      } else {
        t.style.color = 'var(--accent-secondary)';
      }
    });
  }

  // Setup loop
  setInterval(updateCountdowns, 1000);

  // Add Assignment Action
  addBtn.addEventListener('click', () => {
    const title = inTitle.value.trim();
    const subject = inSubject.value.trim() || 'General';
    const due = inDue.value;
    const priority = inPriority.value;

    if (!title || !due) {
      alert("Please specify at least a title and due date.");
      return;
    }

    const newAssign = {
      id: Date.now().toString(),
      title,
      subject,
      due,
      priority,
      completed: false
    };

    appState.assignments.push(newAssign);
    saveState(STATE_KEYS.assignments, appState.assignments);
    renderAssignments();

    // Reset inputs
    inTitle.value = '';
    inSubject.value = '';
    const defDue = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    defDue.setMinutes(defDue.getMinutes() - defDue.getTimezoneOffset());
    inDue.value = defDue.toISOString().substring(0, 16);
  });

  // Action delegations
  container.addEventListener('change', (e) => {
    if (!e.target.classList.contains('assign-check')) return;
    const id = e.target.getAttribute('data-id');
    const idx = appState.assignments.findIndex(a => a.id === id);
    if (idx === -1) return;

    appState.assignments[idx].completed = e.target.checked;
    saveState(STATE_KEYS.assignments, appState.assignments);
    renderAssignments();
  });

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-assign');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const idx = appState.assignments.findIndex(a => a.id === id);
    if (idx === -1) return;

    appState.assignments.splice(idx, 1);
    saveState(STATE_KEYS.assignments, appState.assignments);
    renderAssignments();
  });

  // Filter bindings
  filterAll.addEventListener('click', () => {
    currentFilter = 'all';
    [filterAll, filterPending, filterDone].forEach(b => b.classList.remove('active'));
    filterAll.classList.add('active');
    renderAssignments();
  });

  filterPending.addEventListener('click', () => {
    currentFilter = 'pending';
    [filterAll, filterPending, filterDone].forEach(b => b.classList.remove('active'));
    filterPending.classList.add('active');
    renderAssignments();
  });

  filterDone.addEventListener('click', () => {
    currentFilter = 'done';
    [filterAll, filterPending, filterDone].forEach(b => b.classList.remove('active'));
    filterDone.classList.add('active');
    renderAssignments();
  });

  renderAssignments();
}

// ============================================================================
// 8. FOCUS TIMER (POMODORO) & OFFLINE WEB AUDIO SYNTHESIZER
// ============================================================================

function initFocusTimerModule() {
  const clock = document.getElementById('timer-clock');
  const phaseText = document.getElementById('timer-phase-text');
  
  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  const resetBtn = document.getElementById('timer-reset-btn');
  const applySettingsBtn = document.getElementById('apply-timer-settings');
  
  const inFocus = document.getElementById('timer-focus-min');
  const inShort = document.getElementById('timer-short-min');
  const inLong = document.getElementById('timer-long-min');

  const progressRing = document.getElementById('timer-progress');
  const volumeSlider = document.getElementById('ambient-volume');
  const volumeIndicator = document.getElementById('volume-indicator');

  const focusExitBtn = document.getElementById('focus-exit-btn');

  // Pomodoro state variables
  let timerInterval = null;
  let currentPhase = 'focus'; // 'focus', 'shortBreak', 'longBreak'
  let totalDuration = 25 * 60; // in seconds
  let timeLeft = totalDuration; 
  let isTimerRunning = false;
  let focusTimeAccumulated = 0; // tracks minutes focused in session

  // Setup radial progress variables
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  progressRing.style.strokeDasharray = circumference;

  function updateClockDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    clock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    // Set circle offset
    const fraction = timeLeft / totalDuration;
    const offset = circumference * (1 - fraction);
    progressRing.style.strokeDashoffset = offset;
  }

  function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // Enter Fullscreen Focus mode (adds body class to dim dashboard)
    document.body.classList.add('focus-active');
    
    timerInterval = setInterval(() => {
      timeLeft--;
      
      if (currentPhase === 'focus' && timeLeft % 60 === 0) {
        focusTimeAccumulated++;
        updateDashboardStats();
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        playAlarmSynth();
        alertPhaseSwitch();
      }
      updateClockDisplay();
    }, 1000);
  }

  function pauseTimer() {
    if (!isTimerRunning) return;
    clearInterval(timerInterval);
    isTimerRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    document.body.classList.remove('focus-active');

    // Reset durations based on inputs
    applyConfigurations();
  }

  function applyConfigurations() {
    const focusMin = parseInt(inFocus.value) || 25;
    const shortMin = parseInt(inShort.value) || 5;
    const longMin = parseInt(inLong.value) || 15;

    if (currentPhase === 'focus') {
      totalDuration = focusMin * 60;
      phaseText.textContent = 'Focus Period';
      progressRing.style.stroke = 'var(--accent-primary)';
    } else if (currentPhase === 'shortBreak') {
      totalDuration = shortMin * 60;
      phaseText.textContent = 'Short Break';
      progressRing.style.stroke = 'var(--success)';
    } else {
      totalDuration = longMin * 60;
      phaseText.textContent = 'Long Break';
      progressRing.style.stroke = 'var(--accent-secondary)';
    }
    
    timeLeft = totalDuration;
    updateClockDisplay();
  }

  function alertPhaseSwitch() {
    if (currentPhase === 'focus') {
      currentPhase = 'shortBreak';
      alert("Focus session complete! Time for a short break.");
    } else {
      currentPhase = 'focus';
      alert("Break complete! Time to crush those studies.");
    }
    applyConfigurations();
    startTimer();
  }

  // Synthesize Alarm beep when timer reaches zero
  function playAlarmSynth() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('AudioContext blocked or uninitialized: ', e);
    }
  }

  // Audio Synth System for ambient focus loops (Rain, Drone, White/Brown Noise)
  let activeAudioCtx = null;
  let activeSynthNode = null;
  let activeSoundName = null;

  const soundButtons = document.querySelectorAll('.sound-btn');
  soundButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const soundType = btn.getAttribute('data-sound');
      toggleAmbientSound(soundType, btn);
    });
  });

  volumeSlider.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    volumeIndicator.textContent = `${Math.round(vol * 100)}%`;
    if (activeSynthNode && activeSynthNode.gainNode) {
      activeSynthNode.gainNode.gain.setValueAtTime(vol, activeAudioCtx.currentTime);
    }
  });

  function toggleAmbientSound(sound, button) {
    // If clicking currently active sound, shut it off
    if (activeSoundName === sound) {
      stopAmbientSound();
      return;
    }

    // Stop current sound if any is running
    stopAmbientSound();

    // Start new sound
    try {
      if (!activeAudioCtx) {
        activeAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Resume context if suspended (browser security)
      if (activeAudioCtx.state === 'suspended') {
        activeAudioCtx.resume();
      }

      button.classList.add('active');
      activeSoundName = sound;
      activeSynthNode = playSynthesizer(sound);
    } catch (err) {
      console.error("Synthesizer failed to startup: ", err);
    }
  }

  function stopAmbientSound() {
    soundButtons.forEach(b => b.classList.remove('active'));
    if (activeSynthNode) {
      try {
        if (activeSynthNode.source) activeSynthNode.source.stop();
        if (activeSynthNode.osc1) activeSynthNode.osc1.stop();
        if (activeSynthNode.osc2) activeSynthNode.osc2.stop();
      } catch (e) {}
      activeSynthNode = null;
    }
    activeSoundName = null;
  }

  function playSynthesizer(type) {
    const ctx = activeAudioCtx;
    const gainNode = ctx.createGain();
    const volume = parseFloat(volumeSlider.value);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);

    // 1. WHITE NOISE
    if (type === 'white') {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();
      return { source, gainNode };
    }

    // 2. BROWN NOISE (Deep bass waves)
    if (type === 'brown') {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain adjustment
      }
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();
      return { source, gainNode };
    }

    // 3. RAIN HUM (Brown noise run through lowpass & modulated by slow oscillator)
    if (type === 'rain') {
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.025 * white)) / 1.025;
        lastOut = output[i];
        output[i] *= 4.0;
      }
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      // Filter to cut high frequencies (muddy rain sound)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      return { source, gainNode };
    }

    // 4. DEEP DRONE (Twin oscillator detuned sines)
    if (type === 'synth') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscFilter = ctx.createBiquadFilter();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(75, ctx.currentTime); // Eb1
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(75.5, ctx.currentTime); // Detune by 0.5Hz for pulse effect

      oscFilter.type = 'lowpass';
      oscFilter.frequency.setValueAtTime(120, ctx.currentTime);
      oscFilter.Q.setValueAtTime(3, ctx.currentTime);

      osc1.connect(oscFilter);
      osc2.connect(oscFilter);
      oscFilter.connect(gainNode);

      osc1.start();
      osc2.start();

      return { osc1, osc2, gainNode };
    }

    return null;
  }

  // Bind Buttons
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  applySettingsBtn.addEventListener('click', () => {
    applyConfigurations();
    alert("Timer durations updated!");
  });
  
  focusExitBtn.addEventListener('click', () => {
    document.body.classList.remove('focus-active');
  });

  // Expose total focus minutes for stats
  window.getFocusMinutes = () => focusTimeAccumulated;

  applyConfigurations();
}

// ============================================================================
// 9. FUN ZONE MODULES (EXCUSES, TEAM MAKER)
// ============================================================================

const EXCUSE_VAULT = {
  assignment: [
    "My compiler became self-aware, rejected my code structure, and output a termination notice.",
    "My project partner went into a spiritual retreat in the forest and took the Git credentials with them.",
    "My local database was corrupted by a solar flare that targeted only my house.",
    "I was simulating quantum entanglement and accidentally teleported the assignment draft into the future.",
    "My keyboard was hijacked by a stray cat who walked on the backspace key for six hours.",
    "My IDE suggested so many auto-completes that it wrote a completely different project that got published in Nature.",
    "I spent 12 hours looking for a missing semicolon only to realize I was working on a TXT file."
  ],
  bunk: [
    "I got caught in a time loop in the parking lot and by the time I broke free, class had ended three days ago.",
    "The gravitational forces of my bed reached critical escape velocity, making physical departure impossible.",
    "My alarm clock joined a union and went on strike without notifying me.",
    "I accidentally walked into a parallel dimension where the lecture was scheduled on Mars instead.",
    "My GPS insisted that the lecture hall was inside a local bakery, so I spent the hour eating doughnuts.",
    "I was reviewing notes so intensely that I reached a state of Nirvana and forgot my schedule."
  ],
  group: [
    "I did write the code, but it is currently locked in an encrypted file because I forgot my password in a dream.",
    "I assumed my telepathic project updates were reaching you. I'll recalibrate my brainwaves.",
    "My role was 'Moral Support' and I was cheering you guys on from the bottom of my heart, which is exhausted.",
    "The internet in my room is so slow that my commits are moving at the speed of continental drift.",
    "I was kidnapped by the library cataloging robot and spent the weekend sorting books.",
    "I have been researching slide formatting templates to ensure our 2-slide project looks like Apple designed it."
  ],
  exam: [
    "I studied the wrong syllabus completely. I am now an expert in 17th-century French poetry instead of Data Structures.",
    "The exam paper looked so beautiful that I didn't want to ruin it with my answers.",
    "I had a severe allergic reaction to the exam room's lighting which made my hand write garbage.",
    "My brain was busy executing a garbage collection cycle and deleted all lecture data during question 1.",
    "I spent the night praying to the server gods to crash the university portal. They did not answer.",
    "I reached the exam hall but my brain was still in power-saving mode. I woke up at Q6."
  ]
};

const SHUFFLE_ROLES = [
  "The Overachiever (wrote 95% of the codebase, has three ulcers)",
  "The Ghost (never responds to texts, shows up on slides day, does presentation)",
  "The Canva Specialist (makes the slides look gorgeous, doesn't know what we built)",
  "The Slide Reader (literally reads the slides word-for-word during presentation)",
  "The Moral Support (says 'looks good!' to every text, does absolutely nothing else)",
  "The Slide Formatter (spent 5 hours changing font from Arial to Inter)",
  "The Coordinator (books the study rooms, sends reminders, does no actual work)"
];

function initFunZoneModule() {
  const dashExcuse = document.getElementById('dash-excuse-display');
  const dashGenExcuseBtn = document.getElementById('dash-gen-excuse-btn');
  const dashCopyExcuseBtn = document.getElementById('dash-copy-excuse-btn');

  const funExcuse = document.getElementById('fun-excuse-box');
  const funGenBtn = document.getElementById('fun-gen-btn');
  const funCopyBtn = document.getElementById('fun-copy-btn');
  const excuseTypeSelect = document.getElementById('excuse-type');

  // Dashboard excuse generator
  function generateDashExcuse() {
    const keys = Object.keys(EXCUSE_VAULT);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const list = EXCUSE_VAULT[randomKey];
    const excuse = list[Math.floor(Math.random() * list.length)];
    dashExcuse.textContent = `"${excuse}"`;
  }
  
  if (dashGenExcuseBtn) {
    dashGenExcuseBtn.addEventListener('click', generateDashExcuse);
    dashCopyExcuseBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(dashExcuse.textContent.replace(/"/g, ''));
      alert("Excuse copied to clipboard!");
    });
  }

  // Fun Zone panel excuse generator
  funGenBtn.addEventListener('click', () => {
    const category = excuseTypeSelect.value;
    const list = EXCUSE_VAULT[category];
    const excuse = list[Math.floor(Math.random() * list.length)];
    funExcuse.textContent = `"${excuse}"`;
  });

  funCopyBtn.addEventListener('click', () => {
    if (funExcuse.textContent.includes("Select a category")) return;
    navigator.clipboard.writeText(funExcuse.textContent.replace(/"/g, ''));
    alert("Excuse copied!");
  });

  // Group Project Builder
  const namesInput = document.getElementById('group-names');
  const countInput = document.getElementById('group-count');
  const formTeamsBtn = document.getElementById('form-teams-btn');
  const teamsOutput = document.getElementById('teams-output-container');

  formTeamsBtn.addEventListener('click', () => {
    const rawNames = namesInput.value.trim();
    const teamCount = Math.max(1, parseInt(countInput.value) || 2);

    if (!rawNames) {
      alert("Please input student names first.");
      return;
    }

    // Split names by comma or newlines
    const names = rawNames.split(/[,\n]/)
                          .map(n => n.trim())
                          .filter(n => n.length > 0);

    if (names.length < teamCount) {
      alert("Not enough students to form the requested number of teams!");
      return;
    }

    // Shuffle names array
    const shuffledNames = [...names].sort(() => Math.random() - 0.5);
    
    // Distribute into teams
    const teams = Array.from({ length: teamCount }, () => []);
    shuffledNames.forEach((name, idx) => {
      teams[idx % teamCount].push(name);
    });

    // Render teams cards
    teamsOutput.innerHTML = '';
    teams.forEach((team, teamIdx) => {
      const card = document.createElement('div');
      card.className = 'glass group-card';
      card.style.borderTop = '3px solid var(--accent-pink)';
      
      let membersHTML = '';
      team.forEach(member => {
        // Assign random hilarious role
        const role = SHUFFLE_ROLES[Math.floor(Math.random() * SHUFFLE_ROLES.length)];
        membersHTML += `
          <div style="margin-bottom: 8px;">
            <strong>${member}</strong>
            <div class="group-member-role">${role}</div>
          </div>
        `;
      });

      card.innerHTML = `
        <h4 style="color:var(--text-primary); margin-bottom: 12px; font-size:1rem;"><i data-lucide="shield-alert" style="width:14px;height:14px;display:inline;"></i> Team Alpha-${teamIdx + 1}</h4>
        <div>${membersHTML}</div>
      `;
      teamsOutput.appendChild(card);
    });

    lucide.createIcons();
  });
}

// ============================================================================
// 10. EXAM PANIC MODE MODULE
// ============================================================================

function initPanicModeModule() {
  const dateIn = document.getElementById('panic-exam-date');
  const syllabusIn = document.getElementById('panic-syllabus');
  const syllabusIndicator = document.getElementById('syllabus-indicator');
  const chaptersIn = document.getElementById('panic-chapters');
  const assessBtn = document.getElementById('panic-calc-btn');

  const resultCard = document.getElementById('panic-result-card');
  const ratingBadge = document.getElementById('panic-rating-badge');
  const daysLeftEl = document.getElementById('panic-days-left');
  const paceEl = document.getElementById('panic-study-pace');
  const survivalEl = document.getElementById('panic-survival-rate');
  const motivationEl = document.getElementById('panic-motivation-box');

  // Pre-fill inputs
  dateIn.value = appState.panic.examDate;
  syllabusIn.value = appState.panic.syllabusPercent;
  syllabusIndicator.textContent = `${appState.panic.syllabusPercent}%`;
  chaptersIn.value = appState.panic.chaptersRemaining;

  syllabusIn.addEventListener('input', (e) => {
    syllabusIndicator.textContent = `${e.target.value}%`;
    appState.panic.syllabusPercent = parseInt(e.target.value);
    saveState(STATE_KEYS.panic, appState.panic);
  });

  dateIn.addEventListener('change', () => {
    appState.panic.examDate = dateIn.value;
    saveState(STATE_KEYS.panic, appState.panic);
  });

  chaptersIn.addEventListener('change', () => {
    appState.panic.chaptersRemaining = parseInt(chaptersIn.value) || 5;
    saveState(STATE_KEYS.panic, appState.panic);
  });

  assessBtn.addEventListener('click', runPanicAnalysis);

  const PANIC_MOTIVATIONS = {
    chilled: [
      "Are you sure you're actually registered for this course? Your lack of stress is suspicious.",
      "Doing well! You have earned the right to watch YouTube videos guilt-free for the next 4 hours.",
      "Syllabus almost complete? Please stop flexing on other students, it is bad for group morale."
    ],
    sweat: [
      "Reasonable pace. If you study diligently starting now, you will pass with a decent grade. No pressure.",
      "A steady jog. Don't start binge-watching Netflix and you should make it out alive.",
      "The caffeine-to-study ratio needs a slight adjustment. Prepare for standard level stress."
    ],
    hyper: [
      "Warning: Syllabus completion is dangerously low. Time to double your coffee dose.",
      "You need to finish multiple chapters a day. Goodbye sleep, hello existential dread.",
      "It is theoretically possible to finish the topics, assuming you have photographic memory and zero social life."
    ],
    codeRed: [
      "CODE RED: Pack your bags, book a ticket to the Himalayas. Only a miracle can save you now.",
      "You have 8 chapters remaining and very few hours. The academic gods are weeping for you.",
      "Just write the HOD's email address on the answer sheet, maybe they'll pass you out of sheer pity.",
      "It's not about passing anymore, it's about survival. Start memorizing stackoverflow snippets."
    ]
  };

  function runPanicAnalysis() {
    const examDateStr = dateIn.value;
    const chapters = Math.max(0, parseInt(chaptersIn.value) || 0);
    const syllabus = parseInt(syllabusIn.value) || 0;

    if (!examDateStr) {
      alert("Please specify your next exam date!");
      return;
    }

    const examTime = new Date(examDateStr + "T00:00:00").getTime();
    const nowTime = new Date().setHours(0, 0, 0, 0); // start of today
    const diffTime = examTime - nowTime;

    const daysLeft = Math.ceil(diffTime / (24 * 60 * 60 * 1000));

    daysLeftEl.textContent = daysLeft > 0 ? `${daysLeft} days` : (daysLeft === 0 ? 'TODAY!' : 'PASSED');

    // Daily study targets
    let pace = 0;
    if (daysLeft > 0) {
      pace = (chapters / daysLeft).toFixed(1);
    } else {
      pace = chapters;
    }
    paceEl.textContent = daysLeft > 0 ? `${pace} topics/day` : `${chapters} topics total`;

    // Survival rate calculations
    let survival = 100;
    if (daysLeft > 0) {
      survival = Math.round(syllabus + (daysLeft * 8) - (chapters * 6));
    } else {
      survival = syllabus;
    }
    survival = Math.max(1, Math.min(99, survival)); // Never say 100% or 0% to keep things exciting!
    survivalEl.textContent = `${survival}%`;

    // Determine Panic Rating Badge
    ratingBadge.className = 'panic-badge';
    let motivList = [];
    if (syllabus >= 85) {
      ratingBadge.textContent = 'CHILLED VIBE';
      ratingBadge.classList.add('panic-chilled');
      motivList = PANIC_MOTIVATIONS.chilled;
    } else if (syllabus >= 60 && daysLeft >= 6) {
      ratingBadge.textContent = 'SWEATING';
      ratingBadge.classList.add('panic-sweat');
      motivList = PANIC_MOTIVATIONS.sweat;
    } else if (daysLeft >= 3 && syllabus >= 25) {
      ratingBadge.textContent = 'HYPERVENTILATING';
      ratingBadge.classList.add('panic-hyper');
      motivList = PANIC_MOTIVATIONS.hyper;
    } else {
      ratingBadge.textContent = 'CODE RED 💀';
      ratingBadge.classList.add('panic-danger');
      motivList = PANIC_MOTIVATIONS.codeRed;
    }

    // Set funny message
    motivationEl.innerHTML = `"${motivList[Math.floor(Math.random() * motivList.length)]}"`;
    
    // Save state
    appState.panic = { examDate: examDateStr, syllabusPercent: syllabus, chaptersRemaining: chapters };
    saveState(STATE_KEYS.panic, appState.panic);

    // Show card
    resultCard.style.display = 'block';
    updateDashboardStats();
  }

  // Auto trigger analysis on start if date present
  if (dateIn.value) {
    runPanicAnalysis();
  }
}

// ============================================================================
// 11. EXTRAS: DAMAGE METER, TEACHER MOOD PREDICTOR, CANTEEN EXPENSES
// ============================================================================

function initExtrasAndDashboard() {
  
  // A. Teacher Mood Predictor
  const predictBtn = document.getElementById('predict-mood-btn');
  const teacherSelect = document.getElementById('teacher-select');
  const timeSelect = document.getElementById('time-select');
  const moodResult = document.getElementById('mood-result');

  const MOOD_PREDICTIONS = {
    strict: {
      morning: "⚠️ Danger Level 95%: Slept 3 hours. Will fail you for a misplaced decimal. Do NOT ask for extensions.",
      lunch: "🍗 Starving: Highly unpredictable. Approach only if you have physical copies of assignments ready.",
      afternoon: "😴 Sleepy: Reading slides rapidly. If you nod along, they might accept late submissions."
    },
    chill: {
      morning: "☕ Morning Coffee Mode: Highly receptive. Good time to ask 'Will this be in the exam?'",
      lunch: "🍔 Eating snacks: Will say 'just email it to me later' to whatever you ask.",
      afternoon: "🎸 Ready to go home: 100% attendance given. Late submissions accepted with a smile."
    },
    hod: {
      morning: "💀 Final Boss Mode: Reviewing attendance sheets. Stay hidden. Lock eye contact only if GPA > 9.0.",
      lunch: "💼 Signing official warnings. Keep distance. Do NOT mention project group drama.",
      afternoon: "🎓 Meeting faculty: Extremely irritable. Will lecture you about career prospects for 40 minutes."
    },
    intern: {
      morning: "🥺 Anxious: Trying to look professional. Ask complicated questions to make them feel important.",
      lunch: "📱 Reading Reddit posts on desk. Will agree to anything to make you go away.",
      afternoon: "🧪 Grading lab files: Tired and confused. Will give 9/10 if the index page is colorful."
    }
  };

  predictBtn.addEventListener('click', () => {
    const teacher = teacherSelect.value;
    const time = timeSelect.value;
    const outcome = MOOD_PREDICTIONS[teacher][time];
    moodResult.innerHTML = `<strong>Outcome:</strong> ${outcome}`;
  });

  // B. Canteen Expense Tracker
  const expenseName = document.getElementById('expense-name');
  const expenseCost = document.getElementById('expense-cost');
  const expenseCat = document.getElementById('expense-cat');
  const addExpenseBtn = document.getElementById('add-expense-btn');
  const expenseLog = document.getElementById('expense-log');
  const totalSpendBadge = document.getElementById('total-spend');

  function renderExpenses() {
    expenseLog.innerHTML = '';
    let total = 0;

    if (appState.expenses.length === 0) {
      expenseLog.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No canteen logs today. Safe wallet!</div>`;
      totalSpendBadge.textContent = 'Total: $0.00';
      return;
    }

    appState.expenses.forEach((item, idx) => {
      const cost = Number(item.cost) || 0;
      total += cost;

      const row = document.createElement('div');
      row.className = 'glass expense-item';
      row.style.padding = '8px 12px';
      row.style.borderRadius = '8px';
      row.innerHTML = `
        <span style="font-size: 0.9rem;">${getCategoryEmoji(item.category)}</span>
        <div>
          <div style="font-size: 0.85rem; font-weight: 600;">${item.name}</div>
          <div style="font-size: 0.7rem; color: var(--text-muted);">${item.date}</div>
        </div>
        <strong style="color: var(--accent-pink); font-size: 0.85rem;">$${cost.toFixed(2)}</strong>
        <button class="btn btn-secondary btn-icon delete-exp" data-idx="${idx}" style="width:20px; height:20px; padding:0; border:none; color:var(--danger);"><i data-lucide="x"></i></button>
      `;
      expenseLog.appendChild(row);
    });

    totalSpendBadge.textContent = `Total: $${total.toFixed(2)}`;
    lucide.createIcons();
  }

  function getCategoryEmoji(cat) {
    if (cat === 'coffee') return '☕';
    if (cat === 'snacks') return '🍟';
    if (cat === 'lunch') return '🍛';
    return '💸';
  }

  addExpenseBtn.addEventListener('click', () => {
    const name = expenseName.value.trim();
    const cost = parseFloat(expenseCost.value) || 0;
    const cat = expenseCat.value;

    if (!name || cost <= 0) {
      alert("Please input an item name and positive cost.");
      return;
    }

    appState.expenses.unshift({
      id: Date.now().toString(),
      name,
      cost,
      category: cat,
      date: new Date().toLocaleDateString()
    });

    saveState(STATE_KEYS.expenses, appState.expenses);
    renderExpenses();
    updateDashboardStats();

    expenseName.value = '';
    expenseCost.value = '';
  });

  expenseLog.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-exp');
    if (!btn) return;
    const idx = btn.getAttribute('data-idx');
    appState.expenses.splice(idx, 1);
    saveState(STATE_KEYS.expenses, appState.expenses);
    renderExpenses();
    updateDashboardStats();
  });

  renderExpenses();
}

// ============================================================================
// 12. VIVA QUESTIONS VAULT MODULE
// ============================================================================

const STATIC_VIVA_VAULT = [
  {
    question: "What is polymorphism in OOP?",
    smart: "Polymorphism is the ability of an object to take on many forms. The most common use of polymorphism in OOP occurs when a parent class reference is used to refer to a child class object, resolved at runtime (dynamic polymorphism).",
    funny: "It is agreeing with the interviewer that the same code can act differently in production because of 'cosmic waves' rather than bad logic.",
    category: "cs"
  },
  {
    question: "What is a deadlock in Operating Systems?",
    smart: "A deadlock is a state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process in the set, creating a circular wait cycle.",
    funny: "It's when you and your group project partner are waiting for each other to start writing code, resulting in zero progress until the deadline passes.",
    category: "cs"
  },
  {
    question: "State Euler's Formula.",
    smart: "Euler's formula states that for any real number x, e^(ix) = cos(x) + i sin(x). It establishes the fundamental relationship between trigonometric functions and complex exponential functions.",
    funny: "It's a mathematical spell used to convert imaginary grades into real tears during calculus examinations.",
    category: "math"
  },
  {
    question: "What is Schrodinger's Cat?",
    smart: "A thought experiment in quantum mechanics where a cat in a sealed box is simultaneously alive and dead until observed, demonstrating the Copenhagen interpretation of quantum superposition.",
    funny: "It's like your assignment grade: until you open the grading portal, you have simultaneously failed and passed the course.",
    category: "physics"
  },
  {
    question: "Explain the difference between TCP and UDP.",
    smart: "TCP is a connection-oriented protocol that guarantees delivery of data packets in order. UDP is a connectionless protocol that sends packets without verifying arrival, prioritizing speed over reliability.",
    funny: "TCP is your professor waiting for you to nod after every sentence. UDP is your professor throwing slides at you during a 50-minute lecture and running out of the room.",
    category: "cs"
  },
  {
    question: "What is the Fourier Transform?",
    smart: "A mathematical transform that decomposes a function or signal into its constituent frequencies, transforming it from the time domain to the frequency domain.",
    funny: "It's what the lecturer does to clean, simple concepts to make them completely unrecognizable in exam papers.",
    category: "math"
  },
  {
    question: "Tell me about yourself (HR Interview).",
    smart: "Highlight your academic background, relevant project skills, internships, and interest in applying your technical knowledge to solve engineering problems in the team.",
    funny: "I'm a caffeine-driven developer who is highly skilled in copy-pasting code blocks from stackoverflow and panic-grading at 4 AM.",
    category: "general"
  }
];

function initVivaModule() {
  const container = document.getElementById('viva-container');
  const searchIn = document.getElementById('viva-search');
  const filterCat = document.getElementById('viva-filter-cat');
  
  // Custom creator fields
  const customQ = document.getElementById('custom-viva-q');
  const customSmart = document.getElementById('custom-viva-smart');
  const customFunny = document.getElementById('custom-viva-funny');
  const customCat = document.getElementById('custom-viva-cat');
  const saveCustomBtn = document.getElementById('save-custom-viva-btn');

  function renderViva() {
    container.innerHTML = '';
    const query = searchIn.value.toLowerCase().trim();
    const catFilter = filterCat.value;

    // Combine static and custom questions
    const fullVault = [...STATIC_VIVA_VAULT, ...appState.vivaCustom.map(q => ({...q, isCustom: true}))];
    
    // Filter questions
    const filtered = fullVault.filter(item => {
      const matchQuery = item.question.toLowerCase().includes(query) || 
                         item.smart.toLowerCase().includes(query) || 
                         item.funny.toLowerCase().includes(query);
      
      const matchCat = catFilter === 'all' || 
                       (catFilter === 'custom' && item.isCustom) ||
                       item.category === catFilter;

      return matchQuery && matchCat;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="glass" style="padding: 20px; text-align: center; color: var(--text-muted);">No questions match your query. Prepare your own answers!</div>`;
      return;
    }

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'glass viva-card glass-hover';
      card.innerHTML = `
        <div class="viva-question">
          <span>${item.question} <span style="font-size:0.7rem; color:var(--text-muted);">(${item.category.toUpperCase()})</span></span>
          <i data-lucide="chevron-down" class="viva-chevron" style="transition: transform var(--transition-normal);"></i>
        </div>
        <div class="viva-answer-box">
          <div class="answer-smart">
            <strong>Smart / Academic Answer:</strong><br>${item.smart}
          </div>
          <div class="answer-funny">
            <strong>Actual Reality (Comical):</strong><br>${item.funny}
          </div>
          ${item.isCustom ? `<button class="btn btn-secondary btn-icon delete-custom-q" data-idx="${index}" style="margin-top: 8px; font-size: 0.75rem; color: var(--danger); border-color: rgba(239,68,68,0.15); height:24px; width:24px;"><i data-lucide="trash-2"></i></button>` : ''}
        </div>
      `;

      card.addEventListener('click', (e) => {
        // Don't expand when clicking delete custom button
        if (e.target.closest('.delete-custom-q')) return;
        
        const chevron = card.querySelector('.viva-chevron');
        const isActive = card.classList.contains('active');
        
        // Collapse all others
        document.querySelectorAll('.viva-card').forEach(c => {
          c.classList.remove('active');
          const chev = c.querySelector('.viva-chevron');
          if (chev) chev.style.transform = 'rotate(0deg)';
        });

        if (!isActive) {
          card.classList.add('active');
          chevron.style.transform = 'rotate(180deg)';
        }
      });

      container.appendChild(card);
    });

    lucide.createIcons();
  }

  // Search input events
  searchIn.addEventListener('input', renderViva);
  filterCat.addEventListener('change', renderViva);

  // Custom question add
  saveCustomBtn.addEventListener('click', () => {
    const q = customQ.value.trim();
    const s = customSmart.value.trim();
    const f = customFunny.value.trim();
    const c = customCat.value;

    if (!q || !s || !f) {
      alert("Please fill in all question fields.");
      return;
    }

    appState.vivaCustom.push({ question: q, smart: s, funny: f, category: c });
    saveState(STATE_KEYS.viva, appState.vivaCustom);
    renderViva();

    // Reset inputs
    customQ.value = '';
    customSmart.value = '';
    customFunny.value = '';
  });

  // Custom question deletion handler
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-custom-q');
    if (!btn) return;
    
    // Custom index mapping
    const fullVault = [...STATIC_VIVA_VAULT, ...appState.vivaCustom.map(q => ({...q, isCustom: true}))];
    const index = parseInt(btn.getAttribute('data-idx'));
    const item = fullVault[index];
    
    // Find index in actual custom array
    const customIdx = appState.vivaCustom.findIndex(q => q.question === item.question);
    if (customIdx !== -1) {
      appState.vivaCustom.splice(customIdx, 1);
      saveState(STATE_KEYS.viva, appState.vivaCustom);
      renderViva();
    }
  });

  renderViva();
}

// ============================================================================
// 13. MASTER OVERVIEW STATS & PROGRESS METERS (DAMAGE METER)
// ============================================================================

function updateDashboardStats() {
  // A. Quick Stats Panels
  // Attendance avg
  const attBadge = document.getElementById('dash-attendance-badge');
  let totalAttended = 0;
  let totalLectures = 0;
  appState.attendance.forEach(s => {
    totalAttended += Number(s.attended) || 0;
    totalLectures += Number(s.total) || 0;
  });
  let attAvg = 0;
  if (totalLectures > 0) {
    attAvg = Math.round((totalAttended / totalLectures) * 100);
    attBadge.textContent = `${attAvg}%`;
    attBadge.className = `badge ${attAvg >= 75 ? 'badge-success' : 'badge-high'}`;
  } else {
    attBadge.textContent = '-- %';
    attBadge.className = 'badge badge-medium';
  }

  // GPA
  const cgpaBadge = document.getElementById('dash-cgpa-badge');
  const scale = appState.gpaScale;
  const gradePointsMap = scale === '10' ? GRADE_POINTS_10 : GRADE_POINTS_4;
  let grandCredits = 0;
  let grandPoints = 0;
  appState.gpa.forEach(sem => {
    sem.courses.forEach(c => {
      const credits = Number(c.credits) || 0;
      const pt = gradePointsMap[c.grade] !== undefined ? gradePointsMap[c.grade] : 0;
      grandCredits += credits;
      grandPoints += credits * pt;
    });
  });
  const cgpa = grandCredits > 0 ? (grandPoints / grandCredits) : 0.0;
  cgpaBadge.textContent = grandCredits > 0 ? cgpa.toFixed(2) : '--';
  if (grandCredits > 0) {
    const isDangerous = scale === '10' ? cgpa < 6.5 : cgpa < 2.5;
    cgpaBadge.className = `badge ${isDangerous ? 'badge-high' : 'badge-success'}`;
  } else {
    cgpaBadge.className = 'badge badge-medium';
  }

  // Pending Assignments Count
  const assignBadge = document.getElementById('dash-assignments-badge');
  const pendingCount = appState.assignments.filter(a => !a.completed).length;
  assignBadge.textContent = `${pendingCount} Task${pendingCount !== 1 ? 's' : ''}`;
  assignBadge.className = `badge ${pendingCount > 0 ? 'badge-high' : 'badge-success'}`;

  // Pomodoro Focus Minutes
  const timerBadge = document.getElementById('dash-timer-badge');
  const focusMins = window.getFocusMinutes ? window.getFocusMinutes() : 0;
  timerBadge.textContent = `${focusMins} min${focusMins !== 1 ? 's' : ''}`;

  // B. Semester Damage Meter Logic
  // Computes how in trouble the student is (0% to 100%)
  let damageScore = 0;

  // 1. Attendance damage: below target raises damage rapidly
  if (totalLectures > 0) {
    if (attAvg < 75) {
      damageScore += (75 - attAvg) * 2; // e.g. 50% attendance = 25 below target = +50 damage
    }
  } else {
    damageScore += 10; // penalty for not tracking attendance
  }

  // 2. Overdue/Pending assignment damage
  appState.assignments.forEach(a => {
    if (!a.completed) {
      const dueTime = new Date(a.due).getTime();
      const now = Date.now();
      if (dueTime < now) {
        damageScore += 25; // overdue is critical
      } else {
        const days = (dueTime - now) / (24 * 60 * 60 * 1000);
        if (days <= 1) {
          damageScore += a.priority === 'high' ? 20 : 12; // immediate deadlines
        } else if (days <= 3) {
          damageScore += a.priority === 'high' ? 10 : 5;
        }
      }
    }
  });

  // 3. Exam proximity panic damage
  if (appState.panic.examDate) {
    const examTime = new Date(appState.panic.examDate + "T00:00:00").getTime();
    const nowTime = new Date().setHours(0,0,0,0);
    const daysLeft = Math.ceil((examTime - nowTime) / (24 * 60 * 60 * 1000));
    const syllabus = appState.panic.syllabusPercent;

    if (daysLeft >= 0 && daysLeft <= 7) {
      const remainingSyllabus = 100 - syllabus;
      // Proximity penalty multiplied by missing syllabus
      const proximityWeight = (8 - daysLeft) / 8; // 1.0 if today, 0.125 if 7 days away
      damageScore += Math.round(remainingSyllabus * 0.4 * proximityWeight);
    }
  }

  // Cap damage at 100
  damageScore = Math.max(0, Math.min(100, damageScore));

  // Render Damage Circle progress ring
  const circleProgress = document.getElementById('damage-fill');
  const damageText = document.getElementById('damage-text');
  const damageStatus = document.getElementById('damage-status');
  
  damageText.textContent = `${damageScore}%`;
  
  const rad = 70;
  const circ = 2 * Math.PI * rad;
  const offset = circ * (1 - damageScore / 100);
  
  circleProgress.style.strokeDasharray = circ;
  circleProgress.style.strokeDashoffset = offset;

  // Color stroke & text rating based on damage levels
  if (damageScore <= 25) {
    circleProgress.style.stroke = 'var(--success)';
    damageStatus.textContent = 'Chill Vibe 😴';
    damageStatus.style.color = 'var(--success)';
  } else if (damageScore <= 50) {
    circleProgress.style.stroke = 'var(--accent-secondary)';
    damageStatus.textContent = 'Sweating Slightly 🧐';
    damageStatus.style.color = 'var(--accent-secondary)';
  } else if (damageScore <= 75) {
    circleProgress.style.stroke = 'var(--warning)';
    damageStatus.textContent = 'Severe Anxiety 😰';
    damageStatus.style.color = 'var(--warning)';
  } else {
    circleProgress.style.stroke = 'var(--danger)';
    damageStatus.textContent = 'HOD wants your location 💀';
    damageStatus.style.color = 'var(--danger)';
  }
}

// Global search bar router
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) return;

    // Check matches for navigation routing
    // e.g. typing 'timer' brings us to timer, 'viva' to viva, etc.
    const panelKeywords = {
      attendance: ['attend', 'bunk', 'class', 'sleep'],
      gpa: ['cgpa', 'sgpa', 'gpa', 'score', 'credit', 'grades'],
      assignments: ['task', 'assignment', 'deadline', 'due', 'todo'],
      timer: ['focus', 'timer', 'study', 'pomodoro', 'music', 'sound'],
      viva: ['viva', 'question', 'exam', 'interview'],
      fun: ['excuse', 'group', 'team', 'random', 'joke'],
      panic: ['panic', 'exam', 'syllabus', 'crisis']
    };

    for (const [panelId, keywords] of Object.entries(panelKeywords)) {
      if (keywords.some(k => val.includes(k))) {
        // Route to this panel
        const navLink = document.querySelector(`.menu-link[data-panel="${panelId}"]`);
        if (navLink) {
          navLink.click();
          
          // Pre-fill filter fields if relevant
          if (panelId === 'viva') {
            const vivaSearch = document.getElementById('viva-search');
            vivaSearch.value = val;
            vivaSearch.dispatchEvent(new Event('input'));
          } else if (panelId === 'assignments') {
            // highlight search or do local highlights
          }
          
          // Clear global search after routing to make space
          searchInput.value = '';
          break;
        }
      }
    }
  });
}

// ============================================================================
// 14. INITIALIZE ALL MODULES
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
  // Core Systems
  initThemeAndNavigation();
  initFloatingElements();
  initQuoteSystem();
  initGlobalSearch();

  // Panels
  initAttendanceModule();
  initGPAModule();
  initAssignmentsModule();
  initFocusTimerModule();
  initFunZoneModule();
  initPanicModeModule();
  initExtrasAndDashboard();

  // Initial dashboard load
  updateDashboardStats();
  
  // Create any final icons
  lucide.createIcons();
});
