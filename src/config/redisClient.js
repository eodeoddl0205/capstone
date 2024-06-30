const redis = require('redis');
const redisConfig = require('./redisConfig');

// 레디스 클라이언트 설정
const client = redis.createClient({
    password: redisConfig.password,
    socket: {
        host: redisConfig.socket.host,
        port: redisConfig.socket.port
    }
});

// 레디스 클라이언트 연결
client.connect().catch(err => {
    console.error('Redis 클라이언트 연결에 실패했습니다:', err);
});

// 데이터 설정 함수
async function setKeyValue(key, value, expireSeconds) {
    if (expireSeconds) {
        await client.set(key, value, { EX: expireSeconds });
    } else {
        await client.set(key, value);
    }
}

// 데이터 가져오기 함수
async function getValue(key) {
    const value = await client.get(key);
    return value;
}

// 데이터 지우기 함수
async function delKeyValue(key) {
    await client.del(key);
}

// 함수 내보내기
module.exports = { setKeyValue, getValue, delKeyValue };