import { useEffect, useState, useRef } from "react";
import { aiResult, SchoolInfoCrawl, pushCollection } from "../../api";
import SchoolComponent from '../../components/school/school';
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "../../components/customModal";
import skoolLenLogo from '../../assets/img/SkoolLenLogo.svg';

export default function Wating() {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalContent, setModalContent] = useState<string>('');
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

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const requestCountRef = useRef(0);

    const [schoolView, setSchoolView] = useState(false);

    const [school, setSchool] = useState('');
    const [adres, setAdres] = useState('');
    const [schoolGubun, setSchoolGubun] = useState('');
    const [tree, setTree] = useState('');
    const [flower, setFlower] = useState('');
    const [logoLink, setLogoLink] = useState('');
    const [schoolLink, setSchoolLink] = useState('');

    async function pushCollectionBtn() {
        const schoolInfo = {
            name: school,
            adres: adres,
            gubun: schoolGubun,
            tree: tree,
            schoolLink: schoolLink,
            flower: flower,
            logoLink: logoLink
        };
        try {
            const response = await pushCollection(schoolInfo);
            setModalTitle('도감');
            setModalContent(response.data.message);
            setModalButton({
                check: {
                    text: '확인',
                    view: true
                },
                close: {
                    text: '닫기',
                    view: false,
                    reload: false,
                }
            });
            setOpen(true);
        } catch (err) {
            console.error('Failed to push collection:', err);
        }
    }

    async function getCrawl(schoolName: string) {
        try {
            const crawlResponse = await SchoolInfoCrawl(schoolName);
            console.log("Crawl Response:", crawlResponse);

            setSchool(crawlResponse.data.schoolInfo.schoolName[0]);
            setAdres(crawlResponse.data.schoolInfo.adres[0]);
            setSchoolGubun(crawlResponse.data.schoolInfo.schoolGubun[0]); // 여기서 schoolGubun 사용
            setSchoolLink(crawlResponse.data.schoolInfo.link[0]);
            setTree(crawlResponse.data.symbolInfo.tree);
            setFlower(crawlResponse.data.symbolInfo.flower);
            setLogoLink(crawlResponse.data.logoLink);

            // 각 상태를 설정한 후에 로그 출력
            console.log("School Name:", crawlResponse.data.schoolInfo.schoolName[0]);
            console.log("Address:", crawlResponse.data.schoolInfo.adres[0]);
            console.log("School Type:", crawlResponse.data.schoolInfo.schoolGubun[0]);
            console.log("School Link:", crawlResponse.data.schoolInfo.link[0]);
            console.log("Tree:", crawlResponse.data.symbolInfo.tree);
            console.log("Flower:", crawlResponse.data.symbolInfo.flower);
            console.log("Logo Link:", crawlResponse.data.logoLink);
        } catch (err: unknown) {
            if (err instanceof Error && 'response' in err) {
                const errorResponse = (err as { response?: { status?: number } }).response;
                if (errorResponse?.status === 500) {
                    setSchool(schoolName);
                    setAdres('???');
                    setSchoolGubun('???');
                    setSchoolLink('/');
                    setTree('???');
                    setFlower('???');
                    setLogoLink(skoolLenLogo);
                } else {
                    console.error('오류가 발생했습니다:', err);
                }
            } else {
                console.error('오류가 발생했습니다:', err);
            }
        }
        setIsLoading(false);
        setSchoolView(true);
    };

    useEffect(() => {
        setIsLoading(true);
        const intervalId = setInterval(async () => {
            if (requestCountRef.current >= 10) {
                setError('오류가 발생했습니다. 다시 시도해주세요!');
                clearInterval(intervalId);
                setIsLoading(false);
                return;
            }
            try {
                const response = await aiResult();
                clearInterval(intervalId);
                getCrawl(response.data[0].result.result);
            } catch (err) {
                requestCountRef.current += 1;
                console.log(requestCountRef.current);
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div>
                <CustomModal
                    title={modalTitle}
                    content={modalContent}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onCofirm={() => navigate('/')}
                    modalbutton={modalButton}
                />
            </div>
            <div className="absolute(center) vpack">
                {isLoading && <div className="loader"></div>}
                {isLoading && <div className="dark:c(#fff)">로딩중...</div>}
                {schoolView && <>
                    <SchoolComponent
                        schoolName={school}
                        address={adres}
                        schoolType={schoolGubun}
                        tree={tree}
                        flower={flower}
                        logoLink={logoLink}
                        collection={false}
                    />
                    <div className="pack gap(30) mb(20)">
                        <Link to='/' className="p(5/35/5/35) b(1) r(45) dark:bc(#ff)+c(#fff)">취소</Link>
                        <button onClick={pushCollectionBtn} className="p(5/10/5/10) c(#fff) r(45) bg(#2464E0)">도감에 추가</button>
                    </div>
                </>}
                {error &&
                    <>
                        <p className="c(#f00)">※{error}</p>
                        <Link to={'/'} className="mt(20) bb(1) dark:c(#fff)+bc(#fff)">홈으로</Link>
                    </>
                }
            </div>
        </>
    );
}
