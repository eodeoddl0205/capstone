import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'react-responsive-modal/styles.css';
import logo from '../../assets/img/LogoText.svg'
import emailIcon from '../../assets/img/emailIcon.png';
import passwordIcon from '../../assets/img/passwordIcon.png';

interface LoginResponse {
  access_token: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const userData = {
        email: email,
        password: password,
      };

      await axios.post<LoginResponse>('https://34.27.8.184:8000/api/auth/login', userData, {
        withCredentials: true
      });

      setLoading(false);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        setError('존재하지 않는 이메일이에요. 다시 입력해주세요.');
      }
      else {
        setError('' + error);
      }
      setLoading(false);
    }
  };

  return (
    <div className='absolute x(center) y(50) vpack font-family(pretendard)'>
      <img src={logo} className='mr(10) w(100) mb(10)'></img>
      <form onSubmit={handleSubmit} className='vpack auto gap(20)'>
        <h1 className='blod font(24) c(#414141) dark:c(#ffffff)'>로그인</h1>
        <div className='vpack gap(20)'>
          <div className='hbox space-around gap(5) p(10) r(5) w(260) b(1) bc(#BBBBBB) bg(#fff)'>
            <img src={emailIcon} alt='emailIcon' width={15}></img>
            <input
              autoComplete="off"
              placeholder='이메일'
              className='b(0) focus:outline(0) w(200)'
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='hbox space-around gap(5) p(10) r(5) w(260) b(1) bc(#BBBBBB) bg(#fff)'>
            <img src={passwordIcon} alt='emailIcon' width={15}></img>
            <input
              placeholder='비밀번호'
              className='b(0) focus:outline(0) w(200)'
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Link to='/signup'><span className='mr(20) c(#646464) dark:c(#CBCBCB)'>회원가입</span></Link>
          <button type="submit" className='bg(#2464E0) c(#ffffff) p(5/10/5/10)) w(100) h(35) r(5)' disabled={loading}>
            {loading ? '로그인...' : '로그인'}
          </button>
        </div>
        {error && <div className='' style={{ color: 'red' }}>{error}</div>}
      </form>
      <div className='w(300) mt(15) mb(5) bt(1) bc(#d4d4d4) dark:bc(#5E5E5E)'></div>
      <div className='c(#939393) mb(50) dark:c(#B4B4B4)'>
        <Link to='/'><span className='vpack font(14)'>홈으로</span></Link>
      </div>
    </div>
  );
};

export default LoginForm;