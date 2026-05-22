// QTS Resource Hub - Supabase Integration
// Programmed by Opatola Abdulhamid Gbolahan

// Supabase Configuration - REPLACE THESE WITH YOUR ACTUAL VALUES
const SUPABASE_URL = 'https://nzcjszulboxkgcamfsms.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_u8v3_2NtKVLZXXydWQGYag_YFzLt6dm';

// Initialize Supabase client (when ready)
let supabase = null;

function initSupabase() {
    if (SUPABASE_URL.includes('YOUR_')) {
        console.warn('Please configure your Supabase credentials in supabase.js');
        return false;
    }

    try {
        supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase connected successfully!');
        return true;
    } catch (error) {
        console.error('Supabase connection failed:', error);
        return false;
    }
}

// Auth Functions with Supabase
async function signUpWithSupabase(email, password, userData) {
    if (!supabase) return false;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: userData
        }
    });

    if (error) {
        showToast(error.message, 'error');
        return false;
    }

    // Create profile
    await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: userData.name,
        level: parseInt(userData.level)
    });

    return data;
}

async function signInWithSupabase(email, password) {
    if (!supabase) return false;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        showToast(error.message, 'error');
        return false;
    }

    return data;
}

async function signOutSupabase() {
    if (!supabase) return;
    await supabase.auth.signOut();
}

// Slide Management
async function uploadSlideToSupabase(file, courseCode, level, semester) {
    if (!supabase) {
        showToast('Supabase not configured', 'error');
        return false;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${level}l/${semester}/${fileName}`;

    // Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('slides')
        .upload(filePath, file);

    if (uploadError) {
        showToast('Upload failed: ' + uploadError.message, 'error');
        return false;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('slides')
        .getPublicUrl(filePath);

    // Save to database
    const { data, error } = await supabase.from('slides').insert({
        course_code: courseCode,
        course_level: parseInt(level),
        semester: semester,
        file_name: file.name,
        file_url: publicUrl
    });

    if (error) {
        showToast('Database error: ' + error.message, 'error');
        return false;
    }

    showToast('Slide uploaded successfully!', 'success');
    return true;
}

async function getSlidesFromSupabase(level, semester) {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('slides')
        .select('*')
        .eq('course_level', level)
        .eq('semester', semester);

    if (error) {
        console.error('Error fetching slides:', error);
        return [];
    }

    return data || [];
}

// Quiz Functions
async function getQuizzesFromSupabase(courseCode) {
    if (!supabase) return sampleQuizzes[courseCode] || [];

    const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_code', courseCode);

    if (error || !data || data.length === 0) {
        return sampleQuizzes[courseCode] || [];
    }

    return data.map(q => ({
        question: q.question,
        options: q.options,
        correct: q.correct_answer
    }));
}

async function saveQuizResultSupabase(result) {
    if (!supabase) return;

    const { error } = await supabase.from('quiz_results').insert({
        user_id: AppState.currentUser?.id,
        course_code: result.courseCode,
        score: result.score,
        total_questions: result.total,
        percentage: result.percentage
    });

    if (error) console.error('Error saving quiz result:', error);
}

// Announcement Functions
async function getAnnouncementsFromSupabase() {
    if (!supabase) return announcements;

    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data) return announcements;

    return data.map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        date: a.created_at.split('T')[0],
        important: a.is_important
    }));
}

async function addAnnouncementSupabase(title, content, isImportant = false) {
    if (!supabase) return false;

    const { error } = await supabase.from('announcements').insert({
        title,
        content,
        is_important: isImportant
    });

    if (error) {
        showToast('Error: ' + error.message, 'error');
        return false;
    }

    showToast('Announcement posted!', 'success');
    return true;
}

// Forum Functions
async function getForumTopicsFromSupabase() {
    if (!supabase) return forumTopics;

    const { data, error } = await supabase
        .from('forum_topics')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data) return forumTopics;

    return data.map(t => ({
        id: t.id,
        title: t.title,
        author: 'Student', // Would need to join with profiles
        course: t.course_code || 'General',
        replies: 0,
        views: 0,
        lastReply: t.created_at.split('T')[0]
    }));
}

async function addForumTopicSupabase(title, content, courseCode) {
    if (!supabase) return false;

    const { error } = await supabase.from('forum_topics').insert({
        title,
        content,
        course_code: courseCode,
        author_id: AppState.currentUser?.id
    });

    if (error) {
        showToast('Error: ' + error.message, 'error');
        return false;
    }

    showToast('Topic posted!', 'success');
    return true;
}

// Leaderboard Functions
async function getLeaderboardFromSupabase() {
    if (!supabase) {
        return JSON.parse(localStorage.getItem('qts_leaderboard') || '[]');
    }

    const { data, error } = await supabase
        .from('quiz_results')
        .select('user_id, score, total_questions');

    if (error || !data) return [];

    // Aggregate by user
    const userScores = {};
    data.forEach(r => {
        if (!userScores[r.user_id]) {
            userScores[r.user_id] = { totalScore: 0, totalQuestions: 0, quizzesTaken: 0 };
        }
        userScores[r.user_id].totalScore += r.score;
        userScores[r.user_id].totalQuestions += r.total_questions;
        userScores[r.user_id].quizzesTaken += 1;
    });

    return Object.entries(userScores).map(([userId, scores]) => ({
        userId,
        userName: 'Student ' + userId.substring(0, 6),
        ...scores
    })).sort((a, b) => (b.totalScore/b.totalQuestions) - (a.totalScore/a.totalQuestions));
}

// Export functions
window.initSupabase = initSupabase;
window.uploadSlideToSupabase = uploadSlideToSupabase;
window.getSlidesFromSupabase = getSlidesFromSupabase;
window.getQuizzesFromSupabase = getQuizzesFromSupabase;
window.saveQuizResultSupabase = saveQuizResultSupabase;
window.getAnnouncementsFromSupabase = getAnnouncementsFromSupabase;
window.addAnnouncementSupabase = addAnnouncementSupabase;
window.getForumTopicsFromSupabase = getForumTopicsFromSupabase;
window.addForumTopicSupabase = addForumTopicSupabase;
window.getLeaderboardFromSupabase = getLeaderboardFromSupabase;
window.signUpWithSupabase = signUpWithSupabase;
window.signInWithSupabase = signInWithSupabase;
window.signOutSupabase = signOutSupabase;
