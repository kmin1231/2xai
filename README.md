<!--<h1 align="center">📖 AI-based Learning System</h1>-->

<div align="center">
  <img src="https://drive.google.com/uc?id=17cF6W6qgLjNlBEVly65aOoydrraCu1j9" width=20%>
  <h3><b><i>eXplainable & eXchangeable AI</i></b></h3>
</div>

## 📌 Summary

<pre><code><b>AI-powered Web Platform for Generating and Managing Learning Content</b></code></pre>

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

> ✅ **NTIS National Research Project** (ID: 2340003348)  
>  - _“Developing a Teacher Supporting AI System and Evaluating Its Effectiveness Focusing on 2xAI (eXplainable & eXchangeable) Functionality”_  

<br>

## ⚙️ Tech Stack

- **Frontend**: `React + Vite`, `Axios`
- **Backend**: `Node.js`, `Express.js`
- **Database**: `MongoDB`

- **Deployment & Infra**:

  - **AWS**: `EC2`, `S3` + `CloudFront`, `Route 53`, `ACM` (AWS Certificate Manager), `SSM` (Systems Manager), `AWS CLI`

  - `PM2` (Node.js Process Manager), `Certbot`, `GitHub Actions`

<br>

## 🧩 Project Architecture


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
