import Header from '../../components/header/header'
import BannerImage from '../../components/BannerImage'
import profil1 from '../../assets/img/profil1.png';
import profil2 from '../../assets/img/profil2.png';
import profil3 from '../../assets/img/profil3.png';
import profil4 from '../../assets/img/profil4.png';

export default function config() {
    return (
        <>
            <Header></Header>
            <div className='mt(100) vpack gap(60)'>
                <div className='vpack dark:c(#fff)'>
                    <h1 className='font-size(20)'>안녕하세요!</h1>
                    <h1 className='font-size(20)'>팀, <span className='font-size(28) c(#2464E0) bold'>코딩에 죽는 핫도그</span></h1>
                    <h1 className='font-size(20)'>입니다</h1>
                </div>
                <div className='vpack gap(30) p(15)'>
                    <div className='bold dark:c(#fff) font-size(18)'>소개글</div>
                    <div className='vpack bg(#fff) b(1) bc(#c3c3c3) r(10) w(90%~100%) p(20) gap(10)'>
                        <div>
                            저희 프로젝트는 학교 로고만을 보고 무슨 학교인지 모르는 불편함을 해결하기 위해 개발됐습니다.
                        </div>
                        <div>
                            AI를 통해 학교 로고를 살펴보며 새로운 학교를 배워가는 시간을 가져보세요!
                        </div>
                    </div>
                </div>
                <div className='vpack gap(30) p(15)'>
                    <div className='bold dark:c(#fff) font-size(18)'>유의사항</div>
                    <div className='vpack gap(10) w(90%~100%) bg(#fff) p(20) r(10) b(1) bc(#c3c3c3)'>
                        <div>1. 모든 기능에는 필수적으로 로그인 정보가 사용됩니다.</div>
                        <div>2. ???으로 뜨는 것은 크롤링으로 조회할 수 없는 정보이기 때문입니다.</div>
                        <div>3. 처음 시도하는 프로젝트인 만큼 버그와 오류가 다수 발견될 수 있습니다.</div>
                    </div>
                </div>
                <div className='vpack gap(30) w(300~90%) p(15)'>
                    <div className='bold dark:c(#fff) font-size(18)'>가이드</div>
                    <div className="pack b(1) bc(#c3c3c3) r(10) bg(#fff) w(300~90%) @w(~769):b(0)">
                        <div className='w(300~90%)'>
                            <BannerImage />
                        </div>
                    </div>
                </div>
                <div className='vpack gap(30) w(100%) mb(70) dark:c(#fff)'>
                    <div className='bold dark:c(#fff) font-size(18)'>팀원소개</div>
                    <div className='vpack @w(~769):vpack'>
                        <div className='vpack gap(40) mb(70)'>
                            <div className='bold font-size(18)'>웹 개발</div>
                            <div className='vpack gap(40)'>
                                <div className='vpack gap(10)'>
                                    <div className='r(50%) w(130) h(130) bg(#000)'>
                                        <img src={profil4} alt='profil4'></img>
                                    </div>
                                    <div className='vpack'>
                                        <div className='bold'>김한결</div>
                                        <div>팀장, 백엔드, 프론트</div>
                                        <div className='mt(10) b(1) p(5/10/5/10) r(5)'>모두 수고했어~!</div>
                                    </div>
                                </div>
                                <div className='vpack gap(10)'>
                                    <div className='r(50%) w(130) h(130) bg(#000)'>
                                        <img src={profil1} alt='profil1'></img>
                                    </div>
                                    <div className='vpack'>
                                        <div className='bold'>김민석</div>
                                        <div>백엔드 보조</div>
                                        <div className='mt(10) b(1) p(5/10/5/10) r(5) vpack'>과연 이걸 할 수 있을까? <div>라고 생각했는데 다들 수고했어.</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='vpack gap(40)'>
                            <div className='bold font-size(18)'>AI 개발</div>
                            <div className='vpack gap(40)'>
                                <div className='vpack gap(10)'>
                                    <div className='r(50%) w(130) h(130) bg(#000)'>
                                        <img src={profil3} alt='profil3'></img>
                                    </div>
                                    <div className='vpack'>
                                        <div className='bold'>이승보</div>
                                        <div>AI 개발</div>
                                        <div className='mt(10) b(1) p(5/10/5/10) r(5)'>재밌고, 재밌었어요.</div>
                                    </div>
                                </div>
                                <div className='vpack gap(10)'>
                                    <div className='r(50%) w(130) h(130) bg(#000)'>
                                        <img src={profil2} alt='profil2'></img>
                                    </div>
                                    <div className='vpack'>
                                        <div className='bold'>남성호</div>
                                        <div>AI 개발 보조</div>
                                        <div className='mt(10) b(1) p(5/10/5/10) r(5) vpack'>처음이어서 자신에게 아쉬웠었지만<div>좋은 경험이었습니다</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}   