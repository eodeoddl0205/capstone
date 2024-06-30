require('dotenv').config();
const Queue = require('bull');
const axios = require('axios');
const cron = require('node-cron');
const redisConfig = require('../config/redisConfig');
const mongodb = require('../config/mongoDB');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const path = require('path');

async function crawlSchool(targetSchoolName) {
    try {
        const apiUrl = 'https://www.career.go.kr/cnet/openapi/getOpenApi';
        const params = {
            apiKey: '711c60aacf3c22419bc9ff9673046c8d',
            svcType: 'api',
            svcCode: 'SCHOOL',
            contentType: 'xml',
            gubun: 'high_list',
            region: '100285',
            thisPage: '1',
            perPage: '184'
        };

        console.log('Requesting school list...');
        const response = await axios.get(apiUrl, { params });
        const xml = response.data;

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xml);

        const schoolList = result.dataSearch.content;
        let schoolLink = '';
        let schoolInfo;

        for (const school of schoolList) {
            if (school.schoolName[0].normalize().trim() === targetSchoolName.normalize().trim()) {
                schoolInfo = school;
                schoolLink = school.link[0];
                break;
            }
        }

        if (!schoolLink) {
            throw new Error(`Cannot find school with name: ${targetSchoolName}`);
        }

        console.log(`Found school: ${schoolInfo.schoolName[0]}`);
        console.log(`School link: ${schoolLink}`);
        
        const schoolResponse = await axios.get(schoolLink);
        const schoolHtml = schoolResponse.data;
        const $schoolPage = cheerio.load(schoolHtml);
        
        let logoLink = $schoolPage('#header .header_wrap h1 a img').attr('src');
        if (!logoLink) {
            throw new Error(`Cannot find logoLink on the page.`);
        }
        
        let introLink = $schoolPage('a[title="학교소개"]').attr('href') || $schoolPage('a[title="학교 소개"]').attr('href');
        if (!introLink) {
            throw new Error(`Cannot find "학교소개" or "학교 소개" link on the page.`);
        }
        
        introLink = new URL(introLink, schoolLink).href;
        console.log(`Found intro link: ${introLink}`);

        logoLink = `https://school.gyo6.net${logoLink}`;
        console.log(`Found logo link: ${logoLink}`);

        const introResponse = await axios.get(introLink);
        const introHtml = introResponse.data;
        const $introPage = cheerio.load(introHtml);

        // Locate the "학교상징" link within the "학교소개" section
        let deepLink = $introPage('a[title="학교상징"]').attr('href') ||
            $introPage('a[title="학교 상징"]').attr('href');

        if (!deepLink || deepLink.startsWith('javascript:')) {
            // Try to locate within nested menu
            $introPage('.dep').each((i, el) => {
                const $el = $introPage(el);
                const title = $el.find('> a').attr('title');
                if (title && (title.includes('학교상징') || title.includes('학교 상징'))) {
                    deepLink = $el.find('ul a[title="학교상징"], ul a[title="학교 상징"]').attr('href');
                    return false; // break the loop
                }
            });
        }

        if (!deepLink || deepLink.startsWith('javascript:')) {
            // Handle the case where the link is nested deeper or the title is different
            deepLink = $introPage('a[title="학교 상징"]').attr('href') ||
                       $introPage('a[title="학교상징"]').attr('href');
        }

        if (!deepLink || deepLink.startsWith('javascript:')) {
            throw new Error(`Cannot find "학교상징" link on the page.`);
        }

        deepLink = new URL(deepLink, introLink).href;
        console.log(`Found deep link: ${deepLink}`);

        const deeplResponse = await axios.get(deepLink);
        const deeplHtml = deeplResponse.data;
        const $deeplPage = cheerio.load(deeplHtml);

        const symbolDescription = {
            tree: $deeplPage('.symbolList > .wrap.list02 .info h4 span').text() ||
                $deeplPage('.symbolList > .wrap.list03 .info h4 span').text(),
            flower: $deeplPage('.symbolList > .wrap.list04 .info h4 span').text() ||
                $deeplPage('.symbolList > .wrap.list03 .info h4 span').text()
        };

        console.log('Symbol description:', symbolDescription);
        console.log('School info:', schoolInfo);
        console.log('Logo link:', logoLink);

        return { symbolInfo: symbolDescription, schoolInfo, logoLink };
    } catch (error) {
        console.error('Error crawling school symbol:', error);
        throw error;
    }
}

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const userId = await req.user.id;
        const uploadDir = path.join(__dirname, 'uploads');

        // 디렉토리 존재 여부 확인 및 생성
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        };

        cb(null, uploadDir);
    },
    filename: async function (req, file, cb) {
        const uniqueSuffix = Date.now() + "" + Math.round(Math.random() * 1E9);
        const userId = await req.user.id;
        cb(null, `${userId}-${uniqueSuffix}.jpg`);
    }
});

const upload = multer({ storage: storage });

const aiQueue = new Queue('aiQueue', {
    redis: {
        port: redisConfig.socket.port,
        host: redisConfig.socket.host,
        password: redisConfig.password,
    }
});

aiQueue.process(async (job, done) => {
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(job.data.imagePath));

        const response = await axios.post('http://34.64.159.240:5000/ai', form, {
            headers: {
                ...form.getHeaders(),
            },
        });

        done(null, response.data);
    } catch (error) {
        console.error(`Error: ${error}`);
        done(error);
    }
});

aiQueue.on('completed', async (job, result) => {
    try {
        const rows = await mongodb.findDocuments('aiResult', { userId: job.data.userId })
        if (rows.length > 0) {
            await mongodb.updateDocument('aiResult', { userId: job.data.userId }, { result: result });
        } else {
            await mongodb.insertDocument("aiResult", { userId: job.data.userId, result: result });
        }
    } catch (error) {
        console.error('MongoDB에 결과를 저장하는 동안 오류가 발생했습니다:', error);
    }
});

cron.schedule('0,30 * * * *', async () => {
    try {
        await aiQueue.clean(30 * 60 * 1000, 'completed');
        console.log('AI 큐의 완료된 작업을 정리했습니다.');
        await aiQueue.clean(30 * 60 * 1000, 'failed');
        console.log('AI 큐의 실패한 작업을 정리했습니다.');
    } catch (err) {
        console.error('AI 큐 작업 정리 중 오류 발생:', err);
    }
});

exports.enqueueAIRequest = [upload.single('image'), async (req, res) => {
    const userId = await req.user.id;
    const imagePath = await req.file.path;


    const waitingCount = await aiQueue.getWaitingCount();

    if (waitingCount > 10) {
        return res.status(429).send("현재 처리 대기열이 가득 찼습니다. 나중에 다시 시도해 주세요.");
    }

    await aiQueue.add(
        {
            userId: userId,
            imagePath: imagePath,
        },
        {
            removeOnComplete: true,
            removeOnFail: true,
        },
    );

    res.send("AI request enqueued");
}];

exports.getResult = async (req, res) => {
    const userId = req.user.id;
    try {
        const results = await mongodb.findDocuments("aiResult", { userId: userId });
        await mongodb.deleteDocument("aiResult", { userId: userId });
        res.json(results);
    } catch (error) {
        console.error('MongoDB에서 문서를 찾는 동안 오류가 발생했습니다:', error);
        res.status(500).send('서버 오류가 발생했습니다.');
    }
};

exports.infoCrawl = async (req, res) => {
    const userId = req.user.id;
    const { schoolName } = req.body;
    try {
        const { symbolInfo, schoolInfo, logoLink } = await crawlSchool(schoolName);
        if (!symbolInfo || !schoolInfo) {
            return res.status(404).json({ error: 'School information not found' });
        }
        res.json({ symbolInfo, schoolInfo, logoLink });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error crawling school information' });
    }
};

exports.pushCollection = async (req, res) => {
    try {
        const userId = req.user.id;
        const { schoolInfo } = req.body;

        // 사용자의 기존 학교 정보 조회
        const userSchools = await mongodb.findDocuments('schools', { userId });

        let message = '';

        if (userSchools.length === 0) {
            // 사용자의 학교 정보가 없으면 새로 추가
            await mongodb.insertDocument('schools', {
                userId,
                schools: [{ schoolInfo }]
            });
            message = '학교 정보가 성공적으로 추가되었습니다.';
        } else {
            // 사용자의 학교 정보가 있으면 기존 정보에 추가 또는 업데이트
            const userSchool = userSchools[0]; // 사용자 정보가 하나만 있다고 가정
            let schoolExists = false;

            userSchool.schools.forEach((school, index) => {
                if (school.schoolInfo.name === schoolInfo.name) {
                    // 같은 학교 정보가 있으면 업데이트
                    userSchool.schools[index] = { schoolInfo };
                    schoolExists = true;
                }
            });

            if (!schoolExists) {
                // 같은 학교 정보가 없으면 추가
                userSchool.schools.push({ schoolInfo });
                message = '새 학교 정보가 성공적으로 추가되었습니다.';
            } else {
                message = '기존 학교 정보가 성공적으로 업데이트되었습니다.';
            }

            await mongodb.updateDocument(
                'schools',
                { userId },
                { schools: userSchool.schools }  // $set 연산자 없이 업데이트
            );
        }

        res.status(200).json({ message });
    } catch (error) {
        console.error('도감에 학교 정보를 추가하는 중 오류가 발생했습니다:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

exports.getCollection = async (req, res) => {
    const userId = req.user.id;
    try {
        const userCollection = await mongodb.findDocuments('schools', { userId: userId });
        res.json(userCollection);
    } catch (error) {
        console.error('도감 정보를 불러오는 중 오류가 발생했습니다:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
};

exports.pushInquiry = async (req, res) => {
    const { c, m } = req.body
    try {
        await mongodb.insertDocument('inquiry', {
            c: c,
            m: m
        });
    } catch (error) {
        console.error('문의를 올리는 중 오류가 발생했습니다:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}