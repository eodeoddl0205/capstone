const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');

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

crawlSchool('경북소프트웨어고등학교').then(result => {
    console.log('Crawl result:', result);
}).catch(error => {
    console.error('Crawl error:', error);
});
