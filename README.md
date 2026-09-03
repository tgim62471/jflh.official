학교 통합 플랫폼
===================

학사일정, 급식, 학생회 회의록, 건의사항을 한 곳에서 관리할 수 있는 학교 통합 플랫폼입니다.

## 🎯 기능

### 학생용 (index.html)
- 📅 **학사일정** - 달력 형식의 학교 일정 확인
- 🍽️ **급식** - 학교 급식 메뉴 확인
- 📝 **회의록** - 학생회 회의록 열람
- 💬 **건의사항** - 학교에 건의사항 제출

### 관리자용 (admin.html)
- 📅 학사일정 추가/수정/삭제
- 🍽️ 급식 메뉴 추가/수정/삭제
- 📝 회의록 추가/수정/삭제
- 💬 학생 건의사항 확인/삭제

## 🚀 설치 및 실행

### 필수 요소
- Node.js (v14 이상)

### 설치 방법

1. **저장소 클론**
```bash
git clone https://github.com/tgim62471/jflh.official.git
cd jflh.official
```

2. **의존성 설치**
```bash
npm install
```

3. **서버 실행**
```bash
npm start
```

4. **브라우저 접속**
```
http://localhost:3000
```

## 📱 배포 (Replit 사용)

### Replit에 배포하는 방법

1. **Replit 방문** - https://replit.com

2. **저장소 import**
   - "+ Create" 클릭
   - "Import from GitHub" 선택
   - `https://github.com/tgim62471/jflh.official` 입력

3. **자동으로 실행됨**
   - Replit이 자동으로 `npm install` 실행
   - "Run" 버튼 클릭하면 서버 시작

4. **링크 공유**
   - Replit이 제공하는 웹사이트 링크 복사
   - 단톡방에 공유
   - 모든 학생이 접속 가능!

## 📋 파일 구조

```
jflh.official/
├── server.js              # Node.js 서버 (메인)
├── package.json          # 프로젝트 설정
├── data.json             # 데이터 저장 파일
└── public/
    ├── index.html        # 학생용 메인 페이지
    ├── admin.html        # 관리자 페이지
    ├── style.css         # 학생용 스타일
    ├── admin-style.css   # 관리자용 스타일
    ├── script.js         # 학생용 기능
    └── admin-script.js   # 관리자용 기능
```

## 🔧 사용 방법

### 학생이 할 수 있는 것
1. 학사일정 확인
2. 급식 확인
3. 회의록 읽기
4. 건의사항 제출 (이름 선택사항, 익명 가능)

### 관리자가 할 수 있는 것
1. 메인 페이지에서 "🔧 관리자" 버튼 클릭
2. 각 섹션에서 정보 추가/수정/삭제
   - 학사일정 관리
   - 급식 메뉴 관리
   - 회의록 관리
   - 학생 건의사항 확인

## 💾 데이터 저장

모든 데이터는 `data.json` 파일에 저장됩니다:
- 학사일정
- 급식
- 회의록
- 건의사항

Replit에서 실행하면 자동으로 저장되며, 영구 저장소를 사용할 수 있습니다.

## 🎨 커스터마이징

### 색상 변경
`public/style.css`와 `public/admin-style.css`에서:
```css
/* 주 색상 변경 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 학교명 변경
`public/index.html` 및 `public/admin.html`에서:
```html
<h1>📚 학교명 통합 플랫폼</h1>
```

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.

## 📝 라이선스

MIT License

---

**행운을 빕니다! 좋은 플랫폼이 만들어지길 바랍니다! 🎉**
