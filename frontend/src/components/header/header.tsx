import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "../customModal";
import 'react-responsive-modal/styles.css';
import './header.css'
import { checkLoggingStatus, logout as apiLogout } from "../../api";
import SkeletonScreen from "./HeaderSkeleton";
import logo from '../../assets/img/SkoolLenLogo.svg';
import darkLogo from '../../assets/img/SkoolLenLogoDark.svg';
import menuBtn from '../../assets/img/menuBtn.svg';
import darkMenuBtn from '../../assets/img/menuBtnDark.svg';

export default function header() {
    const navigate = useNavigate();
    const mobileRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [modalButton, setModalButton] = useState({
        check: {
            text: '',
            view: true
        },
        close: {
            text: '',
            view: true,
            reload: false,
        }
    });
    const onOpenModal = () => setOpen(true);
    const gotoLogin = () => navigate("/LogIn");

    const [isLogging, setLogging] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('User');

    useEffect(() => {
        setIsLoading(true);

        checkLoggingStatus()
            .then(response => {
                if (response) {
                    setLogging(false);
                    setUsername(response.data.username);
                };
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setModalTitle('로그인');
                    setModalContent('정상적인 연결을 위해 로그인 해주세요.');
                    setModalButton({  
                        check: {
                            text: '확인',
                            view: true
                        },
                        close: {
                            text: '닫기',
                            view: true,
                            reload: false,
                        }
                    });
                    onOpenModal();
                }
                if (error) setLogging(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const logout = async () => {
        try {
            await apiLogout();
            setModalTitle('로그아웃');
            setModalContent('성공적으로 로그아웃했습니다.');
            setModalButton({
                check: {
                    text: '',
                    view: false
                },
                close: {
                    text: '닫기',
                    view: true,
                    reload: true,
                }
            });
            onOpenModal();
        } catch (error) {
            setModalTitle('로그아웃');
            setModalContent('로그아웃을 하는데 오류가 발생했습니다. 잠시 뒤 다시 시도해주세요.');
            setModalButton({
                check: {
                    text: '',
                    view: false
                },
                close: {
                    text: '닫기',
                    view: true,
                    reload: false,
                }
            });
            onOpenModal();
        }
    };

    function toggleMenu() {
        setIsOpen(true);
        const menu = document.getElementById('menu') as HTMLElement;
        if (isOpen && menu) {
            menu.style.animation = 'fadeOutDown 255ms ease-out';

            const onAnimationEnd = () => {
                menu.removeEventListener('animationend', onAnimationEnd);
                setIsOpen(false);
                menu.style.opacity = '0';
            };

            menu.addEventListener('animationend', onAnimationEnd);
        }
    };

    return (
        <div>
            <div>
                <CustomModal
                    title={modalTitle}
                    content={modalContent}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onCofirm={() => gotoLogin()}
                    modalbutton={modalButton}
                />
            </div>
            {
                isLoading ? (
                    <SkeletonScreen />
                ) : (
                    <header className="fixed(0,0) pack w(100%) font-family(pretendard) bg(#fff) space-between bb(1) c(#1D1D1F) bc(#D4D4D4) p(10/20/10/20) dark:c(#E2E2E2)+bg(#3C3C3C)+b(0)">
                        <div>
                            <Link to={'/'}><img className="w(160) h(40) dark:none" src={logo} alt="logo" /></Link>
                            <Link to={'/'}><img className="w(160) h(40) none dark:block" src={darkLogo} alt="logo" /></Link>
                        </div>
                        <nav>
                            <ul className="hbox gap(60) @w(~769):none 500">
                                <div><Link to='/collection'>도감</Link></div>
                                <div><Link to='/introduction'>소개</Link></div>
                                <div><Link to='/inquiry'>문의</Link></div>
                            </ul>
                        </nav>
                        <div>
                            <button onClick={toggleMenu}>
                                <img className="w(32) h(32) dark:none" src={menuBtn} alt="" />
                                <img className="w(32) h(32) none dark:block" src={darkMenuBtn} alt="" />
                            </button>
                            {
                                isOpen && (
                                    <>
                                        <div ref={mobileRef} onClick={toggleMenu} className="fixed(0,0) w(100%) h(100vh) bg(#000000.7) none @w(~769):block"></div>
                                        <div id="menu" className="
                                                    absolute right(20) bg(#fff) w(200) h(100px) r(5) bc(#d4d4d4) b(1)
                                                    @w(~769):w(50%)+h(100vh)+right(0)+top(0)+r(0)+bc(#d4d4d4)+b(0)+bl(1)+scroll-y
                                                    dark:c(#E2E2E2)+bg(#282828)+bc(#282828)">
                                            <div className="500 m(10) @w(~769):font(16)">
                                                <div className="hbox space-between pb(10) bb(1) bc(#d4d4d4) gap(10) mb(10px)
                                                                dark:bc(#fffff)">
                                                    {isLogging ?
                                                        <>
                                                            <div className="username hbox">Undefined</div>
                                                        </>
                                                        :
                                                        <>
                                                            <div className="username hbox">{username}</div>
                                                        </>}
                                                </div>
                                                {isLogging &&
                                                    <div className="hbox gap(10) m(15/0/15/0) font(15)">
                                                        <div><Link to={'/login'} className="p(5/10/5/10) b(1) r(45)">로그인</Link></div>
                                                        <div><Link to={'/signup'} className="p(5/10/5/10) r(45) bg(#2464E0) c(#ffffff) dark:bg(#2A4AC9)">회원가입</Link></div>
                                                    </div>
                                                }
                                                <div className="@w(769~):none font(18)">
                                                    <div><Link to='/collection'>도감</Link></div>
                                                    <div><Link to='/introduction'>소개</Link></div>
                                                    <div><Link to='/inquiry'>문의</Link></div>
                                                </div>
                                                {!isLogging &&
                                                    <div className="vpack mt(15) font(16) bt(1) bc(#d4d4d4) @w(769~):b(0)+mt(0)">
                                                        <button onClick={logout} className="mt(5) c(#C7C7C7)">로그아웃</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </header>
                )
            }
        </div >
    );
}