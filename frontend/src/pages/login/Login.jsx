// src/pages/login/Login.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setUsername, setPassword, login } from '@/store/authSlice';
import InputField from '@/components/inputs/InputField';
import Header from '@/components/header/Header';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { username, password, isLoggedIn, status, role } = useSelector((state) => state.auth);
  
  // [Step1] username -> [Step2] password
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isLoggedIn) {
      if (role === 'student') {
        navigate('/student');
      } else if (role === 'teacher') {
        navigate('/teacher');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    }
  }, [isLoggedIn, role, navigate]);

  useEffect(() => {
    if (status === 'failed') {
      alert('아이디 또는 비밀번호를 다시 확인해주세요.');
      setStep(1);
      dispatch(setUsername(''));
      dispatch(setPassword(''));
    }
  }, [status, dispatch]);

  // next button
  const handleNext = () => {
    if (step === 1) {
      if (!username.trim()) {
        alert('아이디를 입력해주세요.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!password.trim()) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
      dispatch(login({ username, password }));
    }
  };

  return (

    <div className="login-container">

      <Header />
      
      {step === 1 ? (
        <InputField
          label="아이디를 입력해 주세요."
          placeholder="2xAI-ID"
          value={username}
          onChange={(e) => dispatch(setUsername(e.target.value))}
          onButtonClick={handleNext}
        />
      ) : (
        <InputField
          label="비밀번호를 입력해 주세요."
          placeholder="2xAI-PW"
          value={password}
          type="password"
          onChange={(e) => dispatch(setPassword(e.target.value))}
          onButtonClick={handleNext}
        />
      )}

      {status === 'loading' && <p>로그인 중...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>아이디 또는 비밀번호를 다시 확인해주세요.</p>}
    </div>
  );
};

export default Login;