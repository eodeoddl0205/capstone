// InquiryPage.jsx
import Header from '../../components/header/header'
import { useState } from 'react'
import './index.css'
import { pushInquiry } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function InquiryPage() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    const handleCategoryChange = (e : any) => {
        setCategory(e.target.value);
    }

    const handleMessageChange = (e : any) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e : any) => {
        e.preventDefault();
        pushInquiry(category, message)
        navigate('/');
    }

    return (
        <>
            <Header />
            <div className='vpack p(20)'>
                <div className="notice">
                    ※문의는 프로젝트 결과의 참고용으로만 사용합니다.
                </div>
                <div className='w(300)'>
                    <form onSubmit={handleSubmit} className="inquiry-form">
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                카테고리
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={handleCategoryChange}
                                className="form-select"
                            >
                                <option value="">카테고리 선택</option>
                                <option value="feedback">피드백</option>
                                <option value="bug">버그 신고</option>
                                <option value="school">학교 정보 누락 | 오류</option>
                                <option value="other">기타</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message" className="form-label">
                                문의 내용
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={handleMessageChange}
                                rows={10}
                                className="form-textarea"
                                placeholder="문의 내용을 입력해주세요."
                            />
                        </div>
                        <div className='vpack'>
                            <button type="submit" className="form-submit-button">
                                문의하기
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
