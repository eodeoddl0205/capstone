import axios from "axios";

export const checkLoggingStatus = async () => {
    try {
        const response = await axios.get('https://34.27.8.184:8000/api/auth/testLoggingin', {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await axios.post('https://34.27.8.184:8000/api/auth/logout', {}, {
            withCredentials: true
        });
    } catch (error) {
        throw error;
    }
};

export const aiQueue = async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    try {
        const response = await axios.post('https://34.27.8.184:8000/api/camera/aiQueue', formData, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const aiResult = async () => {
    try {
        const response = await axios.post('https://34.27.8.184:8000/api/camera/aiResult', {}, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const SchoolInfoCrawl = async (schoolName: string) => {
    console.log(schoolName);
    try {
        const response = await axios.post('https://34.27.8.184:8000/api/camera/InfoCrawl', { schoolName }, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const pushCollection = async (schoolInfo: any) => {
    try {
        const response = await axios.post('https://34.27.8.184:8000/api/camera/pushCollection', { schoolInfo }, {
            withCredentials: true
        });
        console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchSchoolData = async () => {
    try {
        const response = await axios.post('https://34.27.8.184:8000/api/camera/getCollection', {}, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error('학교 정보 불러오기 중 오류가 발생했습니다:', error);
    }
};

export const pushInquiry = async (c:string, m:string) => {
    try {
        const response = await axios.post('https://34.27.8.184:8000/api/camera/pushInquiry', {c,m}, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        console.error('학교 정보 불러오기 중 오류가 발생했습니다:', error);
    }
};