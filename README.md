<!--<h1 align="center">📖 AI-based Learning System</h1>-->

<div align="center">
  <img src="https://drive.google.com/uc?id=1TUhCCU4DN61Bu4cDXiWBKWxAxs4CuMuP" width=20%>
  <h3><b><i>eXplainable & eXchangeable AI</i></b></h3>
  <h4>🌐 This is the <code>Korean</code> version of the README. | <a href="README.en.md">English version</a></h4>
</div>

## 📌 Summary

<pre><code><b>생성형 AI</b>를 활용한 <b>영어 학습 플랫폼</b> — <b>학생·교사·관리자 모드</b> 지원</code></pre>

<br>

## 💡 Key Features

> ✅ **AI-Generated Learning Content**  
>  - Students receive personalized reading materials dynamically generated based on keywords and individual reading levels.

> ✅ **Level-aware Learning**  
>  - Student reading levels are automatically inferred and can be manually adjusted by teachers for personalized guidance.

> ✅ **Interactive Learning Activities**  
>  - Students can highlight text, submit feedback, and answer questions — all of which are tracked to analyze learning patterns.

> ✅ **Learning Dashboard**  
>  - Both teachers and students can monitor learning progress. Teachers can adjust student levels and assign keywords for targeted content generation.

> ✅ **Role-based Access Control**  
>  - Role-specific API access for students, teachers, and admins is enforced using JWT (JSON Web Token) authentication.

> ✅ **NTIS National Research Project** (ID: 2340039404)  
>  - _“Developing a Teacher Supporting AI System and Evaluating Its Effectiveness Focusing on 2xAI (eXplainable & eXchangeable) Functionality”_  

<br>

## ⚙️ Tech Stack

- **Frontend**: `React + Vite`, `Axios`
- **Backend**: `Node.js`, `Express.js`
- **Database**: `MongoDB`

- **Deployment & Infra**:

  - **AWS**: `EC2`, `S3` + `CloudFront`, `Route 53`,`ACM` (AWS Certificate Manager), `SSM` (Systems Manager)

  - `PM2` (Node.js Process Manager), `Certbot`, `GitHub Actions`

<br>

## 🗂️ Database

- MongoDB Atlas / MongoDB v8.0.22 / Mongoose ODM
- **독립적**으로 관리되는 데이터 사이의 **관계**는 `ObjectId` 기반의 **`reference`** 사용
- 함께 조회되는 데이터는 **`embedded` document** 활용하여 **조회 성능 최적화**

| Collection | Description |
| ---------- | ----------- |
| `users` | 사용자 정보 |
| `classes` | 소속 학반 정보 |
| `keywords` | 학습 자료 생성 위해 입력한 키워드 |
| `texts` | AI가 생성한 학습 자료 |
| `records` | 문제 풀이 기록 |
| `feedbacks` | 학습 자료에 대한 만족도 |
| `highlights` | 하이라이트 데이터 |
| `errorlogs` | AI 서버 오류 추적 및 분석을 위한 로그 |

<br>

## 📑 Conventions

### Commit Types

| Emoji | Type     | Description                                       |
| ----- | -------- | ------------------------------------------------- |
| ✨   | feat     | 새로운 기능 구현 |
| 🐛   | fix      | 버그 수정 |
| 🔥   | hotfix   | 배포/운영 환경 긴급 수정 |
| 🔧   | refactor | 코드 리팩터링 |
| 🎨   | style    | [FE] 디자인, 테마, 화면 표시 방식 등 UI 관련 변경 |
| 🧹   | chore    | 설정, 빌드, 의존성, 환경 관련 작업 |
| 🧪   | test     | 테스트 관련 작업 |
| 📑   | docs     | 프로젝트 문서 작업 |

<br>

## 📂 Project Structure
```
.
├── 🗂️ backend
│   ├── data/
│   ├── package.json
│   ├── package-lock.json
│   └── src
│        ├── app.js
│        ├── ▶️server.js
│        ├── db/
│        ├── middleware/
│        ├── models/
│        ├── services/
│        ├── controllers/
│        ├── routes/
│        └── swagger.js
├── 🗂️ frontend
│   ├── index.html
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   ├── src
│   │   ├── ▶️main.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── 🔧config.js
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── data/
│   └── 🔧vite.config.js
├── 🗂️ test
│   ├── __init__.py
│   ├── ▶️main.py
│   ├── data/
│   └── requirements.txt
├── package.json
├── package-lock.json
└── 📑README.md
```

<br>

## ▶️ How to Run

```
git clone https://github.com/kmin1231/2xai.git
cd 2xai
```
```
cd backend
npm install

cd ../frontend
npm install
cd ..
```
```
# Run separately
npm run back      # port 3200
npm run front     # port 6173
```
```
# Run concurrently
npm run dev
```
