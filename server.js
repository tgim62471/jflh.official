const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 데이터 저장 경로
const dataFile = path.join(__dirname, 'data.json');

// 초기 데이터
const initialData = {
  schedule: [], // 학사일정
  meal: [], // 급식
  minutes: [], // 학생회 회의록
  suggestions: [] // 건의사항
};

// 데이터 파일이 없으면 생성
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

// 데이터 읽기
function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch {
    return initialData;
  }
}

// 데이터 쓰기
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// ===== 학사일정 API =====
app.get('/api/schedule', (req, res) => {
  const data = readData();
  res.json(data.schedule);
});

app.post('/api/schedule', (req, res) => {
  const data = readData();
  const newSchedule = {
    id: Date.now(),
    date: req.body.date,
    title: req.body.title,
    description: req.body.description || ''
  };
  data.schedule.push(newSchedule);
  writeData(data);
  res.json(newSchedule);
});

app.delete('/api/schedule/:id', (req, res) => {
  const data = readData();
  data.schedule = data.schedule.filter(s => s.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// ===== 급식 API =====
app.get('/api/meal', (req, res) => {
  const data = readData();
  res.json(data.meal);
});

app.post('/api/meal', (req, res) => {
  const data = readData();
  const newMeal = {
    id: Date.now(),
    date: req.body.date,
    menu: req.body.menu
  };
  data.meal.push(newMeal);
  writeData(data);
  res.json(newMeal);
});

app.delete('/api/meal/:id', (req, res) => {
  const data = readData();
  data.meal = data.meal.filter(m => m.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// ===== 학생회 회의록 API =====
app.get('/api/minutes', (req, res) => {
  const data = readData();
  res.json(data.minutes);
});

app.post('/api/minutes', (req, res) => {
  const data = readData();
  const newMinutes = {
    id: Date.now(),
    date: req.body.date,
    title: req.body.title,
    content: req.body.content
  };
  data.minutes.push(newMinutes);
  writeData(data);
  res.json(newMinutes);
});

app.delete('/api/minutes/:id', (req, res) => {
  const data = readData();
  data.minutes = data.minutes.filter(m => m.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// ===== 건의사항 API =====
app.get('/api/suggestions', (req, res) => {
  const data = readData();
  res.json(data.suggestions);
});

app.post('/api/suggestions', (req, res) => {
  const data = readData();
  const newSuggestion = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    name: req.body.name || '익명',
    content: req.body.content
  };
  data.suggestions.push(newSuggestion);
  writeData(data);
  res.json(newSuggestion);
});

app.delete('/api/suggestions/:id', (req, res) => {
  const data = readData();
  data.suggestions = data.suggestions.filter(s => s.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ success: true });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 학교 통합 플랫폼이 http://localhost:${PORT} 에서 실행 중입니다!`);
});
