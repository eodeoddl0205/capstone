import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import logo from '../../assets/img/LogoText.svg';
import emailIcon from '../../assets/img/emailIcon.png';
import passwordIcon from '../../assets/img/passwordIcon.png';

const LoginForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cheack, setCheack] = useState<string>('');
  const [cheackTime, setCheackTime] = useState<number>(0);
  const [cheackLoding, setCheackLoding] = useState<boolean>(false);

  useEffect(() => {
    if (cheackTime === 0) {
      return;
    }
    const timerId = setInterval(() => {
      setCheackTime(cheackTime - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [cheackTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await axios.post<Response>('https://34.27.8.184:8000/api/auth/emailcodesend', {email});

      setLoading(false);
      setCheackTime(60*5);
      onOpenModal();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        setError('겹치는 이메일이 있어요. 다른 이메일로 설정해주세요');
      }
      else {
        setError('' + error);
      }
      setLoading(false);
    }
  };

  const CheackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheackLoding(true);
    try {
      await axios.post<Response>('https://34.27.8.184:8000/api/auth/emailcheack', {email: email, code: cheack});
      setCheackLoding(false);
      onCloseModal();

      const userData = {
        email: email,
        password: password,
      };

      await axios.post<Response>('https://34.27.8.184:8000/api/auth/signup', userData);
      navigate('/login');
    } catch(error) {
      onCloseModal();
      setError('' + error);
      setCheackLoding(false);
    }
  };

  const reCheack: React.MouseEventHandler<HTMLButtonElement> = async () => {
    setCheackTime(60*5);
    await axios.post<Response>('https://34.27.8.184:8000/api/auth/emailcodesend', {email});
  };

  return (
    <>
      <Modal
        center open={open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        showCloseIcon={false}
        styles={{
          modal: {
            borderRadius: '5px',
          }
        }}>
        <div className='vpack hobox font-family(prendard) gap(10)'>
          <p className='black bold font(16)'>{email}</p>
          <form onSubmit={CheackSubmit}>
            <div className='vpack gap(5)'>
              <div className='pack gap(10)'>
                <p>인증번호</p>
                <input
                  className='w(100) text(center)'
                  type='text'
                  id='check'
                  value={cheack} onChange={(e) => setCheack(e.target.value)}
                  placeholder='6자리'
                  required
                />
              </div>
              <div className='pack c(#d82525) font(16) h(3) ml(70)'>{formatTime(cheackTime)}</div>
            </div>
            <div className='pack gap(30) mt(15)'>
              <button className='pack r(45) font(14) c(#2464E0)' onClick={reCheack} type='button'>다시인증</button>
              <button type="submit" className='pack p(3/20/3/20) r(45) bg(#2464E0) c(#fff) font(14) transition(.255s) hover:bg(#3d7bee)'>{cheackLoding ? '확인중' : '확인'}</button>
            </div>
          </form>
        </div>
      </Modal>
      <div className='absolute x(center) y(50) vpack font-family(pretendard)'>
        <img src={logo} className='mr(10) w(100) mb(10)'></img>
        <form onSubmit={handleSubmit} className='vpack auto gap(20)'>
          <h1 className='blod font(24) c(#414141) dark:c(#ffffff)'>회원가입</h1>
          <div className='vpack gap(20)'>
            <div className='hbox space-around gap(5) p(10) r(5) w(260) b(1) bc(#BBBBBB) bg(#fff)'>
              <img src={emailIcon} alt='emailIcon' width={15}></img>
              <input
                autoComplete="off"
                placeholder='이메일'
                type="email"
                id="email"
                className='b(0) focus:outline(0) w(200)'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='hbox space-around gap(5) p(10) r(5) w(260) b(1) bc(#BBBBBB) bg(#fff)'>
              <img src={passwordIcon} alt="passwordIcon" width={15} />
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
            <button type="submit" className='bg(#2464E0) c(#ffffff) p(5/10/5/10) r(5) w(110) h(35)' disabled={loading}>
              {loading ? '회원가입...' : '회원가입'}
            </button>
          </div>
          {error && <div className='s' style={{ color: 'red' }}>{error}</div>}
        </form>
        <div className='w(230) mt(15) mb(5) bt(1) bc(#d4d4d4) dark:bc(#5E5E5E)'></div>
        <div className='c(#939393) mb(50) dark:c(#B4B4B4)'>
          <Link to='/'><span className='vpack font(14)'>홈으로</span></Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;