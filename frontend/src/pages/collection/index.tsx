import { useState, useEffect } from 'react';
import { fetchSchoolData } from '../../api';
import SchoolComponent from '../../components/school/school';
import Header from '../../components/header/header';
import { Link } from 'react-router-dom';
import './collection.css'

interface SchoolInfo {
    schoolLink: string;
    name: string;
    adres: string;
    gubun: string;
    tree: string;
    flower: string;
    logoLink: string;
}

interface School {
    schoolInfo: SchoolInfo;
}

const ITEMS_PER_PAGE = 10; // Number of schools per page

export default function Collection() {
    const [schools, setSchools] = useState<School[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await fetchSchoolData();
            if (data) {
                const fetchedSchools = data.data[0].schools;
                setSchools(fetchedSchools);
                setTotalPages(Math.ceil(fetchedSchools.length / ITEMS_PER_PAGE));
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handlePageChange = (pageNumber: any) => {
        setCurrentPage(pageNumber);
    };

    const schoolsToShow = schools.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div>
            <Header />
            <div className='mt(70)'></div>
            <ul className="ulBox">
                {schoolsToShow.map((school, index) => (
                    <li key={index} className='w(100%) pack p(30)'>
                        <Link to={`${school.schoolInfo.schoolLink}`}>
                            <SchoolComponent
                                schoolName={school.schoolInfo.name}
                                address={school.schoolInfo.adres}
                                schoolType={school.schoolInfo.gubun}
                                tree={school.schoolInfo.tree}
                                flower={school.schoolInfo.flower}
                                logoLink={school.schoolInfo.logoLink}
                                collection={false}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className='mt(50) vpack gap(50)'>
                {loading &&
                    <>
                        <div className='loader mt(120)'></div>
                        <div className='c(#f00) dark:c(#fff)'>※로딩이 계속된다면 오류입니다. 홈으로 돌아가주세요.</div>
                    </>
                }
            </div>
        </div>
    );
}
