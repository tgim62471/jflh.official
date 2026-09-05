// API 기본 URL
const API_URL = '';

// 현재 달력 표시 월
let currentCalendarDate = new Date();

// 탭 전환 기능
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('admin-btn')) return;
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        loadTab(tabId);
    });
});

// 탭 로드 함수
function loadTab(tabId) {
    if (tabId === 'schedule') {
        loadSchedule();
        renderCalendar();
    }
    else if (tabId === 'meal') loadMeal();
    else if (tabId === 'minutes') loadMinutes();
    else if (tabId === 'suggestions') loadSuggestions();
}

// 초기 로드
loadSchedule();
renderCalendar();

// ===== 달력 기능 =====
function renderCalendar() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // 월 제목 업데이트
    document.getElementById('currentMonth').textContent = `${year}년 ${month + 1}월`;
    
    // 달력 그리기
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let calendarHTML = '<div class="calendar-grid">';
    
    // 요일 헤더
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    dayNames.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // 빈 칸
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-empty"></div>';
    }
    
    // 날짜
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        calendarHTML += `<div class="calendar-date" onclick="selectDate('${dateStr}')">${day}</div>`;
    }
    
    calendarHTML += '</div>';
    document.getElementById('calendar').innerHTML = calendarHTML;
    
    // 일정이 있는 날짜 강조
    highlightScheduleDates();
}

function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
}

function selectDate(dateStr) {
    // 선택된 날짜의 일정만 표시
    loadSchedule();
}

function highlightScheduleDates() {
    fetch(`${API_URL}/api/schedule`)
        .then(res => res.json())
        .then(data => {
            const year = currentCalendarDate.getFullYear();
            const month = currentCalendarDate.getMonth();
            
            document.querySelectorAll('.calendar-date').forEach(dateEl => {
                const day = parseInt(dateEl.textContent);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                if (data.some(s => s.date === dateStr)) {
                    dateEl.classList.add('has-schedule');
                }
            });
        });
}

// ===== 학사일정 =====
async function loadSchedule() {
    try {
        const response = await fetch(`${API_URL}/api/schedule`);
        const data = await response.json();
        const container = document.getElementById('scheduleList');
        
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        // 현재 달의 일정만 필터링
        const monthSchedules = data.filter(s => {
            const sDate = new Date(s.date);
            return sDate.getFullYear() === year && sDate.getMonth() === month;
        });
        
        if (monthSchedules.length === 0) {
            container.innerHTML = '<p class="loading">이번달 일정이 없습니다.</p>';
            return;
        }
        
        // 날짜 기준으로 정렬
        monthSchedules.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        container.innerHTML = monthSchedules.map(schedule => `
            <div class="list-item">
                <div class="item-date">📅 ${formatDate(schedule.date)}</div>
                <div class="item-title">${schedule.title}</div>
                ${schedule.description ? `<div class="item-content">${schedule.description}</div>` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('학사일정 로드 오류:', error);
        document.getElementById('scheduleList').innerHTML = '<p class="loading">오류가 발생했습니다.</p>';
    }
}

// ===== 급식 =====
async function loadMeal() {
    try {
        const response = await fetch(`${API_URL}/api/meal`);
        const data = await response.json();
        const container = document.getElementById('mealList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">등록된 급식이 없습니다. (NEIS에서 자동으로 업데이트됩니다)</p>';
            return;
        }
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = data.map(meal => `
            <div class="list-item">
                <div class="item-date">🍽️ ${formatDate(meal.date)}</div>
                <div class="item-content">${meal.menu}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('급식 로드 오류:', error);
        document.getElementById('mealList').innerHTML = '<p class="loading">오류가 발생했습니다.</p>';
    }
}

// ===== 회의록 =====
async function loadMinutes() {
    try {
        const response = await fetch(`${API_URL}/api/minutes`);
        const data = await response.json();
        const container = document.getElementById('minutesList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">등록된 회의록이 없습니다.</p>';
            return;
        }
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = data.map(minutes => `
            <div class="list-item">
                <div class="item-date">📝 ${formatDate(minutes.date)}</div>
                <div class="item-title">${minutes.title}</div>
                <div class="item-content">${minutes.content}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('회의록 로드 오류:', error);
        document.getElementById('minutesList').innerHTML = '<p class="loading">오류가 발생했습니다.</p>';
    }
}

// ===== 건의사항 =====
async function loadSuggestions() {
    try {
        const response = await fetch(`${API_URL}/api/suggestions`);
        const data = await response.json();
        const container = document.getElementById('suggestionsList');
        
        if (data.length === 0) {
            container.innerHTML = '<p class="loading">아직 건의사항이 없습니다.</p>';
            return;
        }
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = data.map(suggestion => `
            <div class="list-item suggestion-item">
                <div class="item-date">💬 ${formatDate(suggestion.date)} | ${suggestion.name}</div>
                <div class="item-content">${suggestion.content}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('건의사항 로드 오류:', error);
        document.getElementById('suggestionsList').innerHTML = '<p class="loading">오류가 발생했습니다.</p>';
    }
}

// 건의사항 추가
async function addSuggestion() {
    const name = document.getElementById('suggestionName').value;
    const content = document.getElementById('suggestionContent').value;
    
    if (!content.trim()) {
        alert('건의사항을 입력해주세요!');
        return;
    }
    
    try {
        await fetch(`${API_URL}/api/suggestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, content })
        });
        
        document.getElementById('suggestionName').value = '';
        document.getElementById('suggestionContent').value = '';
        alert('건의사항이 제출되었습니다! 감사합니다.');
        loadSuggestions();
    } catch (error) {
        console.error('건의사항 제출 오류:', error);
        alert('제출 중 오류가 발생했습니다.');
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
