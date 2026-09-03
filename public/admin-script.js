// API 기본 URL
const API_URL = '';

// 탭 전환 기능
document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        loadAdminTab(tabId);
    });
});

// 초기 로드
loadAdminTab('schedule');

// 탭 로드 함수
function loadAdminTab(tabId) {
    if (tabId === 'schedule') loadAdminSchedule();
    else if (tabId === 'meal') loadAdminMeal();
    else if (tabId === 'minutes') loadAdminMinutes();
    else if (tabId === 'suggestions') loadAdminSuggestions();
}

// ===== 학사일정 관리 =====
async function loadAdminSchedule() {
    try {
        const response = await fetch(`${API_URL}/api/schedule`);
        const data = await response.json();
        const container = document.getElementById('adminScheduleList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">등록된 일정이 없습니다.</p>';
            return;
        }
        
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        container.innerHTML = data.map(schedule => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-date">📅 ${formatDate(schedule.date)}</div>
                    <div class="admin-item-title">${schedule.title}</div>
                    ${schedule.description ? `<div class="admin-item-text">${schedule.description}</div>` : ''}
                </div>
                <button class="btn-delete" onclick="deleteSchedule(${schedule.id})">삭제</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('학사일정 로드 오류:', error);
    }
}

async function adminAddSchedule() {
    const date = document.getElementById('scheduleDate').value;
    const title = document.getElementById('scheduleTitle').value;
    const description = document.getElementById('scheduleDesc').value;
    
    if (!date || !title) {
        alert('날짜와 행사명을 입력해주세요!');
        return;
    }
    
    try {
        await fetch(`${API_URL}/api/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, title, description })
        });
        
        document.getElementById('scheduleDate').value = '';
        document.getElementById('scheduleTitle').value = '';
        document.getElementById('scheduleDesc').value = '';
        loadAdminSchedule();
        alert('일정이 추가되었습니다!');
    } catch (error) {
        console.error('일정 추가 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

async function deleteSchedule(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await fetch(`${API_URL}/api/schedule/${id}`, { method: 'DELETE' });
        loadAdminSchedule();
    } catch (error) {
        console.error('일정 삭제 오류:', error);
    }
}

// ===== 급식 관리 =====
async function loadAdminMeal() {
    try {
        const response = await fetch(`${API_URL}/api/meal`);
        const data = await response.json();
        const container = document.getElementById('adminMealList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">등록된 급식이 없습니다.</p>';
            return;
        }
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = data.map(meal => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-date">🍽️ ${formatDate(meal.date)}</div>
                    <div class="admin-item-text">${meal.menu}</div>
                </div>
                <button class="btn-delete" onclick="deleteMeal(${meal.id})">삭제</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('급식 로드 오류:', error);
    }
}

async function adminAddMeal() {
    const date = document.getElementById('mealDate').value;
    const menu = document.getElementById('mealMenu').value;
    
    if (!date || !menu) {
        alert('날짜와 메뉴를 입력해주세요!');
        return;
    }
    
    try {
        await fetch(`${API_URL}/api/meal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, menu })
        });
        
        document.getElementById('mealDate').value = '';
        document.getElementById('mealMenu').value = '';
        loadAdminMeal();
        alert('급식이 추가되었습니다!');
    } catch (error) {
        console.error('급식 추가 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

async function deleteMeal(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await fetch(`${API_URL}/api/meal/${id}`, { method: 'DELETE' });
        loadAdminMeal();
    } catch (error) {
        console.error('급식 삭제 오류:', error);
    }
}

// ===== 회의록 관리 =====
async function loadAdminMinutes() {
    try {
        const response = await fetch(`${API_URL}/api/minutes`);
        const data = await response.json();
        const container = document.getElementById('adminMinutesList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">등록된 회의록이 없습니다.</p>';
            return;
        }
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = data.map(minutes => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-date">📝 ${formatDate(minutes.date)}</div>
                    <div class="admin-item-title">${minutes.title}</div>
                    <div class="admin-item-text">${minutes.content}</div>
                </div>
                <button class="btn-delete" onclick="deleteMinutes(${minutes.id})">삭제</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('회의록 로드 오류:', error);
    }
}

async function adminAddMinutes() {
    const date = document.getElementById('minutesDate').value;
    const title = document.getElementById('minutesTitle').value;
    const content = document.getElementById('minutesContent').value;
    
    if (!date || !title || !content) {
        alert('모든 항목을 입력해주세요!');
        return;
    }
    
    try {
        await fetch(`${API_URL}/api/minutes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, title, content })
        });
        
        document.getElementById('minutesDate').value = '';
        document.getElementById('minutesTitle').value = '';
        document.getElementById('minutesContent').value = '';
        loadAdminMinutes();
        alert('회의록이 추가되었습니다!');
    } catch (error) {
        console.error('회의록 추가 오류:', error);
        alert('오류가 발생했습니다.');
    }
}

async function deleteMinutes(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await fetch(`${API_URL}/api/minutes/${id}`, { method: 'DELETE' });
        loadAdminMinutes();
    } catch (error) {
        console.error('회의록 삭제 오류:', error);
    }
}

// ===== 건의사항 관리 =====
async function loadAdminSuggestions() {
    try {
        const response = await fetch(`${API_URL}/api/suggestions`);
        const data = await response.json();
        const container = document.getElementById('adminSuggestionsList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">아직 건의사항이 없습니다.</p>';
            return;
        }
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = data.map(suggestion => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-date">💬 ${formatDate(suggestion.date)} | ${suggestion.name}</div>
                    <div class="admin-item-text">${suggestion.content}</div>
                </div>
                <button class="btn-delete" onclick="deleteSuggestion(${suggestion.id})">삭제</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('건의사항 로드 오류:', error);
    }
}

async function deleteSuggestion(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await fetch(`${API_URL}/api/suggestions/${id}`, { method: 'DELETE' });
        loadAdminSuggestions();
    } catch (error) {
        console.error('건의사항 삭제 오류:', error);
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
}
