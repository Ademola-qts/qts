// QTS Resource Hub - Main JavaScript
// Programmed by Opatola Abdulhamid Gbolahan

// Initialize Supabase (placeholder - will be configured by user)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Global State
const AppState = {
    currentUser: JSON.parse(localStorage.getItem('qts_user')) || null,
    bookmarks: JSON.parse(localStorage.getItem('qts_bookmarks')) || [],
    assignments: JSON.parse(localStorage.getItem('qts_assignments')) || [],
    quizResults: JSON.parse(localStorage.getItem('qts_quiz_results')) || [],
    studyTimer: null,
    timerSeconds: 0,
    timerRunning: false
};

// Course Data Structure
const courseData = {
    100: {
        first: [
            { code: 'QTS 101', title: 'Introduction to Quantity Surveying', slides: [] },
            { code: 'QTS 103', title: 'Building Materials I', slides: [] },
            { code: 'MTH 101', title: 'Elementary Mathematics I', slides: [] },
            { code: 'PHY 101', title: 'General Physics I', slides: [] },
            { code: 'GST 111', title: 'Use of English I', slides: [] },
            { code: 'COS 101', title: 'Introduction to Computing', slides: [] },
            { code: 'QTS 105', title: 'Technical Drawing', slides: [] },
            { code: 'ACH 103', title: 'Introduction to Architecture', slides: [] },
            { code: 'QTS 107', title: 'Workshop Practice', slides: [] },
            { code: 'URP 101', title: 'Introduction to Urban Planning', slides: [] }
        ],
        second: [
            { code: 'QTS 102', title: 'Principles of Measurement', slides: [] },
            { code: 'QTS 104', title: 'Building Construction I', slides: [] },
            { code: 'PHY 102', title: 'General Physics II', slides: [] },
            { code: 'GST 112', title: 'Philosophy and Logic', slides: [] },
            { code: 'STA 121', title: 'Statistics for Sciences', slides: [] },
            { code: 'QTS 106', title: 'Building Materials II', slides: [] },
            { code: 'ACH 105', title: 'History of Architecture', slides: [] },
            { code: 'GES 107', title: 'Environmental Science', slides: [] },
            { code: 'GES 108', title: 'Entrepreneurship', slides: [] }
        ]
    },
    200: {
        first: [
            { code: 'QTS 201', title: 'Advanced Measurement I', slides: [] },
            { code: 'QTS 203', title: 'Building Technology I', slides: [] },
            { code: 'QTS 205', title: 'Construction Economics I', slides: [] },
            { code: 'MTH 102', title: 'Elementary Mathematics II', slides: [] },
            { code: 'GES 201', title: 'Nigerian Peoples and Culture', slides: [] },
            { code: 'URP 205', title: 'Rural Development Planning', slides: [] },
            { code: 'ECO 201', title: 'Principles of Economics', slides: [] },
            { code: 'QTS 207', title: 'Structural Mechanics', slides: [] }
        ],
        second: [
            { code: 'QTS 202', title: 'Advanced Measurement II', slides: [] },
            { code: 'QTS 204', title: 'Building Technology II', slides: [] },
            { code: 'GST 212', title: 'Nigerian Constitution', slides: [] },
            { code: 'STA 212', title: 'Probability and Statistics', slides: [] },
            { code: 'QTS 208', title: 'Construction Management I', slides: [] },
            { code: 'QTS 206', title: 'Construction Economics II', slides: [] },
            { code: 'ECO 202', title: 'Macroeconomics', slides: [] },
            { code: 'GES 103', title: 'Computer Programming', slides: [] }
        ]
    },
    300: {
        first: [
            { code: 'QTS 301', title: 'Professional Practice I', slides: [] },
            { code: 'QTS 303', title: 'Contract Administration', slides: [] },
            { code: 'QTS 305', title: 'Cost Planning and Control', slides: [] },
            { code: 'QTS 307', title: 'Building Services', slides: [] },
            { code: 'QTS 309', title: 'Project Management', slides: [] },
            { code: 'QTS 311', title: 'Advanced Construction Technology', slides: [] },
            { code: 'QTS 313', title: 'Research Methods', slides: [] }
        ],
        second: [
            // To be filled by admin
        ]
    },
    400: {
        first: [],
        second: []
    },
    500: {
        first: [],
        second: []
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAuth();
    initAnimations();
    initStudyTimer();
    initBookmarks();
    initAssignments();
    initGPA();
    initQuiz();
    initLeaderboard();
    initAnnouncements();
    initForum();
    initPrintFriendly();
});

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Auth System
function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    updateAuthUI();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login (replace with Supabase auth)
    const users = JSON.parse(localStorage.getItem('qts_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        AppState.currentUser = user;
        localStorage.setItem('qts_user', JSON.stringify(user));
        showToast('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showToast('Invalid credentials!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const level = document.getElementById('regLevel').value;

    const users = JSON.parse(localStorage.getItem('qts_users') || '[]');

    if (users.find(u => u.email === email)) {
        showToast('Email already registered!', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        level,
        avatar: name.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('qts_users', JSON.stringify(users));
    AppState.currentUser = newUser;
    localStorage.setItem('qts_user', JSON.stringify(newUser));

    showToast('Registration successful!', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('qts_user');
    showToast('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateAuthUI() {
    const authLinks = document.querySelectorAll('.auth-link');
    const userMenu = document.querySelector('.user-menu');
    const userName = document.querySelector('.user-name');
    const userAvatar = document.querySelector('.user-avatar');

    if (AppState.currentUser) {
        authLinks.forEach(link => link.style.display = 'none');
        if (userMenu) userMenu.style.display = 'flex';
        if (userName) userName.textContent = AppState.currentUser.name;
        if (userAvatar) userAvatar.textContent = AppState.currentUser.avatar;
    } else {
        authLinks.forEach(link => link.style.display = 'inline-flex');
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .level-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Study Timer
function initStudyTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');

    if (startBtn) {
        startBtn.addEventListener('click', startTimer);
    }
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseTimer);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }
}

function startTimer() {
    if (!AppState.timerRunning) {
        AppState.timerRunning = true;
        AppState.studyTimer = setInterval(() => {
            AppState.timerSeconds++;
            updateTimerDisplay();
        }, 1000);
        document.getElementById('startTimer').textContent = '⏸️ Pause';
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    AppState.timerRunning = false;
    clearInterval(AppState.studyTimer);
    document.getElementById('startTimer').textContent = '▶️ Resume';
}

function resetTimer() {
    AppState.timerRunning = false;
    clearInterval(AppState.studyTimer);
    AppState.timerSeconds = 0;
    updateTimerDisplay();
    document.getElementById('startTimer').textContent = '▶️ Start';
}

function updateTimerDisplay() {
    const hours = Math.floor(AppState.timerSeconds / 3600);
    const minutes = Math.floor((AppState.timerSeconds % 3600) / 60);
    const seconds = AppState.timerSeconds % 60;

    const display = document.getElementById('timerDisplay');
    if (display) {
        display.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Bookmarks
function initBookmarks() {
    renderBookmarks();
}

function toggleBookmark(courseCode) {
    const index = AppState.bookmarks.indexOf(courseCode);
    if (index > -1) {
        AppState.bookmarks.splice(index, 1);
        showToast('Removed from bookmarks', 'success');
    } else {
        AppState.bookmarks.push(courseCode);
        showToast('Added to bookmarks', 'success');
    }
    localStorage.setItem('qts_bookmarks', JSON.stringify(AppState.bookmarks));
    renderBookmarks();
    updateBookmarkButtons();
}

function renderBookmarks() {
    const container = document.getElementById('bookmarksList');
    if (!container) return;

    if (AppState.bookmarks.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">No bookmarks yet</p>';
        return;
    }

    container.innerHTML = AppState.bookmarks.map(code => `
        <div class="course-item">
            <span class="course-code">${code}</span>
            <button class="bookmark-btn active" onclick="toggleBookmark('${code}')">★</button>
        </div>
    `).join('');
}

function updateBookmarkButtons() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        const code = btn.dataset.course;
        if (code) {
            btn.classList.toggle('active', AppState.bookmarks.includes(code));
        }
    });
}

// Assignments
function initAssignments() {
    renderAssignments();

    const addForm = document.getElementById('addAssignmentForm');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('assignmentTitle').value;
            const course = document.getElementById('assignmentCourse').value;
            const dueDate = document.getElementById('assignmentDue').value;

            const assignment = {
                id: Date.now(),
                title,
                course,
                dueDate,
                completed: false,
                createdAt: new Date().toISOString()
            };

            AppState.assignments.push(assignment);
            localStorage.setItem('qts_assignments', JSON.stringify(AppState.assignments));
            renderAssignments();
            addForm.reset();
            showToast('Assignment added!', 'success');
        });
    }
}

function renderAssignments() {
    const container = document.getElementById('assignmentsList');
    if (!container) return;

    if (AppState.assignments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center">No assignments yet</p>';
        return;
    }

    container.innerHTML = AppState.assignments.map(assignment => `
        <div class="assignment-item ${assignment.completed ? 'completed' : ''}">
            <div class="assignment-checkbox ${assignment.completed ? 'checked' : ''}" onclick="toggleAssignment(${assignment.id})">
                ${assignment.completed ? '✓' : ''}
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600;">${assignment.title}</div>
                <div style="font-size: 0.85rem; color: var(--gray);">${assignment.course} • Due: ${new Date(assignment.dueDate).toLocaleDateString()}</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="deleteAssignment(${assignment.id})">🗑️</button>
        </div>
    `).join('');
}

function toggleAssignment(id) {
    const assignment = AppState.assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        localStorage.setItem('qts_assignments', JSON.stringify(AppState.assignments));
        renderAssignments();
        showToast(assignment.completed ? 'Assignment completed!' : 'Assignment reopened', 'success');
    }
}

function deleteAssignment(id) {
    AppState.assignments = AppState.assignments.filter(a => a.id !== id);
    localStorage.setItem('qts_assignments', JSON.stringify(AppState.assignments));
    renderAssignments();
    showToast('Assignment deleted', 'success');
}

// GPA Calculator
function initGPA() {
    const addRowBtn = document.getElementById('addGPARow');
    const calculateBtn = document.getElementById('calculateGPA');

    if (addRowBtn) {
        addRowBtn.addEventListener('click', addGPARow);
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateGPA);
    }

    // Add initial row
    if (document.getElementById('gpaBody')) {
        addGPARow();
    }
}

function addGPARow() {
    const tbody = document.getElementById('gpaBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="form-input course-name" placeholder="Course Code"></td>
        <td><input type="number" class="form-input course-unit" placeholder="Units" min="1" max="6" value="3"></td>
        <td>
            <select class="form-input course-grade">
                <option value="5">A (70-100)</option>
                <option value="4">B (60-69)</option>
                <option value="3">C (50-59)</option>
                <option value="2">D (45-49)</option>
                <option value="1">E (40-44)</option>
                <option value="0">F (0-39)</option>
            </select>
        </td>
        <td><button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove()">Remove</button></td>
    `;
    tbody.appendChild(row);
}

function calculateGPA() {
    const rows = document.querySelectorAll('#gpaBody tr');
    let totalPoints = 0;
    let totalUnits = 0;

    rows.forEach(row => {
        const unit = parseFloat(row.querySelector('.course-unit').value) || 0;
        const grade = parseFloat(row.querySelector('.course-grade').value) || 0;
        totalPoints += unit * grade;
        totalUnits += unit;
    });

    const gpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';

    const resultDiv = document.getElementById('gpaResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="gpa-result">
                <span class="gpa-value">${gpa}</span>
                <div>Total Units: ${totalUnits} | Total Points: ${totalPoints}</div>
                <div style="margin-top: 0.5rem; font-size: 1rem;">
                    ${gpa >= 4.5 ? '🏆 First Class' : gpa >= 3.5 ? '🥈 Second Class Upper' : gpa >= 2.5 ? '🥉 Second Class Lower' : gpa >= 1.5 ? '📚 Third Class' : '⚠️ Probation'}
                </div>
            </div>
        `;
    }
}

// Quiz System
const sampleQuizzes = {
    'QTS 101': [
        {
            question: 'What is the primary role of a Quantity Surveyor?',
            options: ['Design buildings', 'Manage costs and contracts', 'Build structures', 'Inspect quality'],
            correct: 1
        },
        {
            question: 'Which document contains detailed measurements for construction work?',
            options: ['Blueprint', 'Bill of Quantities', 'Contract Agreement', 'Site Plan'],
            correct: 1
        },
        {
            question: 'What does BIM stand for in construction?',
            options: ['Building Information Modeling', 'Basic Infrastructure Management', 'Built-in Materials', 'Budget Investment Method'],
            correct: 0
        }
    ],
    'QTS 103': [
        {
            question: 'Which of these is a natural building material?',
            options: ['Steel', 'Concrete', 'Timber', 'Glass'],
            correct: 2
        },
        {
            question: 'What is the main component of Portland cement?',
            options: ['Limestone', 'Sand', 'Clay', 'Gypsum'],
            correct: 0
        }
    ]
};

function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get('course') || 'QTS 101';

    loadQuiz(courseCode);
}

function loadQuiz(courseCode) {
    const quiz = sampleQuizzes[courseCode] || sampleQuizzes['QTS 101'];
    const container = document.getElementById('quizContainer');

    if (!container) return;

    container.innerHTML = `
        <div class="quiz-header" style="margin-bottom: 2rem;">
            <h2>${courseCode} Quiz</h2>
            <p style="color: var(--gray);">Test your knowledge with ${quiz.length} questions</p>
        </div>
        <form id="quizForm">
            ${quiz.map((q, i) => `
                <div class="quiz-question">
                    <h4>Question ${i + 1}: ${q.question}</h4>
                    <div class="quiz-options">
                        ${q.options.map((opt, j) => `
                            <label class="quiz-option" onclick="selectOption(this, ${i}, ${j})">
                                <input type="radio" name="q${i}" value="${j}" style="display: none;">
                                <span style="font-weight: 700; color: var(--primary);">${String.fromCharCode(65 + j)}.</span>
                                ${opt}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Submit Quiz</button>
        </form>
        <div id="quizResult" style="margin-top: 2rem;"></div>
    `;

    document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitQuiz(quiz, courseCode);
    });
}

function selectOption(element, questionIndex, optionIndex) {
    const questionDiv = element.closest('.quiz-question');
    questionDiv.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    element.querySelector('input').checked = true;
}

function submitQuiz(quiz, courseCode) {
    let score = 0;
    const form = document.getElementById('quizForm');
    const formData = new FormData(form);

    quiz.forEach((q, i) => {
        const selected = formData.get(`q${i}`);
        const questionDiv = form.querySelectorAll('.quiz-question')[i];
        const options = questionDiv.querySelectorAll('.quiz-option');

        options.forEach((opt, j) => {
            opt.style.pointerEvents = 'none';
            if (j === q.correct) {
                opt.classList.add('correct');
            } else if (parseInt(selected) === j && j !== q.correct) {
                opt.classList.add('wrong');
            }
        });

        if (parseInt(selected) === q.correct) {
            score++;
        }
    });

    const percentage = Math.round((score / quiz.length) * 100);
    const resultDiv = document.getElementById('quizResult');

    resultDiv.innerHTML = `
        <div class="card" style="text-align: center; border: 3px solid ${percentage >= 70 ? 'var(--accent)' : percentage >= 50 ? 'var(--warning)' : 'var(--danger)'};">
            <h3 style="font-size: 2rem; margin-bottom: 1rem;">Quiz Results</h3>
            <div style="font-size: 4rem; font-weight: 800; color: ${percentage >= 70 ? 'var(--accent)' : percentage >= 50 ? 'var(--warning)' : 'var(--danger)'};">
                ${score}/${quiz.length}
            </div>
            <div style="font-size: 1.5rem; margin: 1rem 0;">${percentage}%</div>
            <div style="font-size: 1.1rem; color: var(--gray);">
                ${percentage >= 70 ? '🎉 Excellent work!' : percentage >= 50 ? '👍 Good effort!' : '💪 Keep practicing!'}
            </div>
        </div>
    `;

    // Save result
    const result = {
        courseCode,
        score,
        total: quiz.length,
        percentage,
        date: new Date().toISOString(),
        userId: AppState.currentUser?.id
    };

    AppState.quizResults.push(result);
    localStorage.setItem('qts_quiz_results', JSON.stringify(AppState.quizResults));

    // Update leaderboard
    updateLeaderboard(score, quiz.length);
}

// Leaderboard
function initLeaderboard() {
    renderLeaderboard();
}

function updateLeaderboard(score, total) {
    const leaderboard = JSON.parse(localStorage.getItem('qts_leaderboard') || '[]');
    const userId = AppState.currentUser?.id || 'anonymous';
    const userName = AppState.currentUser?.name || 'Anonymous';

    const existingEntry = leaderboard.find(entry => entry.userId === userId);
    if (existingEntry) {
        existingEntry.totalScore += score;
        existingEntry.totalQuestions += total;
        existingEntry.quizzesTaken += 1;
        existingEntry.lastActive = new Date().toISOString();
    } else {
        leaderboard.push({
            userId,
            userName,
            totalScore: score,
            totalQuestions: total,
            quizzesTaken: 1,
            lastActive: new Date().toISOString()
        });
    }

    localStorage.setItem('qts_leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();
}

function renderLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;

    const leaderboard = JSON.parse(localStorage.getItem('qts_leaderboard') || '[]');

    if (leaderboard.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--gray);">No quiz attempts yet. Be the first!</p>';
        return;
    }

    // Sort by accuracy (totalScore / totalQuestions)
    leaderboard.sort((a, b) => (b.totalScore / b.totalQuestions) - (a.totalScore / a.totalQuestions));

    container.innerHTML = leaderboard.slice(0, 10).map((entry, index) => {
        const accuracy = Math.round((entry.totalScore / entry.totalQuestions) * 100);
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';

        return `
            <div class="leaderboard-item">
                <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                <div style="flex: 1;">
                    <div style="font-weight: 700;">${entry.userName}</div>
                    <div style="font-size: 0.85rem; color: var(--gray);">${entry.quizzesTaken} quizzes taken</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 800; color: var(--primary);">${accuracy}%</div>
                    <div style="font-size: 0.85rem; color: var(--gray);">${entry.totalScore}/${entry.totalQuestions}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Announcements
const announcements = [
    {
        id: 1,
        title: 'Welcome to QTS Resource Hub!',
        content: 'This platform is designed to help all Quantity Surveying students access course materials easily. Start exploring your level resources!',
        date: '2026-05-22',
        important: true
    },
    {
        id: 2,
        title: 'New Slides Uploaded - QTS 101',
        content: 'Week 1-4 lecture slides for QTS 101 have been uploaded. Check the 100L First Semester section.',
        date: '2026-05-22',
        important: false
    },
    {
        id: 3,
        title: 'Quiz Feature Now Available',
        content: 'Test your knowledge with our new quiz feature. Quizzes are available for QTS 101 and QTS 103. More coming soon!',
        date: '2026-05-22',
        important: true
    }
];

function initAnnouncements() {
    renderAnnouncements();
}

function renderAnnouncements() {
    const container = document.getElementById('announcementsList');
    if (!container) return;

    container.innerHTML = announcements.map(ann => `
        <div class="announcement-card ${ann.important ? 'border-l-4 border-yellow-500' : ''}">
            <div class="announcement-date">📅 ${new Date(ann.date).toLocaleDateString()} ${ann.important ? '• 🔴 Important' : ''}</div>
            <div class="announcement-title">${ann.title}</div>
            <div style="color: var(--gray);">${ann.content}</div>
        </div>
    `).join('');
}

// Forum
const forumTopics = [
    {
        id: 1,
        title: 'Best way to understand Bill of Quantities preparation?',
        author: 'QTS Student',
        replies: 5,
        views: 45,
        lastReply: '2026-05-21',
        course: 'QTS 101'
    },
    {
        id: 2,
        title: 'Study group for MTH 101 - Calculus help needed',
        author: 'Math Lover',
        replies: 12,
        views: 89,
        lastReply: '2026-05-20',
        course: 'MTH 101'
    }
];

function initForum() {
    renderForum();

    const newTopicForm = document.getElementById('newTopicForm');
    if (newTopicForm) {
        newTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('topicTitle').value;
            const course = document.getElementById('topicCourse').value;
            const content = document.getElementById('topicContent').value;

            forumTopics.unshift({
                id: Date.now(),
                title,
                author: AppState.currentUser?.name || 'Anonymous',
                replies: 0,
                views: 0,
                lastReply: new Date().toISOString().split('T')[0],
                course
            });

            renderForum();
            newTopicForm.reset();
            showToast('Topic posted successfully!', 'success');
        });
    }
}

function renderForum() {
    const container = document.getElementById('forumList');
    if (!container) return;

    container.innerHTML = forumTopics.map(topic => `
        <div class="forum-topic">
            <h4 style="color: var(--primary); margin-bottom: 0.5rem;">${topic.title}</h4>
            <div style="color: var(--gray); font-size: 0.9rem;">${topic.course}</div>
            <div class="forum-meta">
                <span>👤 ${topic.author}</span>
                <span>💬 ${topic.replies} replies</span>
                <span>👁️ ${topic.views} views</span>
                <span>🕐 ${topic.lastReply}</span>
            </div>
        </div>
    `).join('');
}

// Print Friendly
function initPrintFriendly() {
    const printBtn = document.getElementById('printCourses');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span style="font-size: 1.25rem;">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease-out reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Course Level Rendering
function renderLevelCourses(level, semester) {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    const courses = courseData[level]?.[semester] || [];

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📚</div>
                <h3 style="color: var(--gray); margin-bottom: 1rem;">No courses uploaded yet</h3>
                <p style="color: var(--gray);">Courses for ${level}L ${semester} semester will be added soon.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="card" style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem;">${course.code}</h4>
                    <p style="color: var(--gray); margin-bottom: 1rem;">${course.title}</p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${course.slides.length > 0 ? course.slides.map(slide => `
                            <a href="${slide.url}" class="btn btn-secondary btn-sm" download>
                                📄 ${slide.name}
                            </a>
                        `).join('') : '<span style="color: var(--gray); font-size: 0.9rem;">No slides uploaded yet</span>'}
                    </div>
                </div>
                <button class="bookmark-btn ${AppState.bookmarks.includes(course.code) ? 'active' : ''}" 
                        data-course="${course.code}" 
                        onclick="toggleBookmark('${course.code}')">
                    ★
                </button>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                <a href="quiz.html?course=${course.code}" class="btn btn-primary btn-sm">📝 Take Quiz</a>
                <a href="forum.html?course=${course.code}" class="btn btn-secondary btn-sm">💬 Discussion</a>
            </div>
        </div>
    `).join('');
}

// Admin: Upload Slide (for your use)
function uploadSlide(level, semester, courseCode, fileName, fileUrl) {
    if (!courseData[level]) courseData[level] = {};
    if (!courseData[level][semester]) courseData[level][semester] = [];

    const course = courseData[level][semester].find(c => c.code === courseCode);
    if (course) {
        course.slides.push({ name: fileName, url: fileUrl, uploadedAt: new Date().toISOString() });
        showToast(`Slide uploaded for ${courseCode}`, 'success');
    }
}

// Export for global access
window.AppState = AppState;
window.toggleBookmark = toggleBookmark;
window.toggleAssignment = toggleAssignment;
window.deleteAssignment = deleteAssignment;
window.addGPARow = addGPARow;
window.calculateGPA = calculateGPA;
window.logout = logout;
window.selectOption = selectOption;
window.renderLevelCourses = renderLevelCourses;
window.uploadSlide = uploadSlide;
