const { MongoClient } = require('mongodb');

const url = 'mongodb://root:fjqm1425*@34.64.172.33';
const client = new MongoClient(url, {});

let db;

async function connectDB(dbName = 'mydatabase') {
    try {
        if (!db) {
            await client.connect();
            db = client.db(dbName);
            console.log("MongoDB에 성공적으로 연결되었습니다.");
        }
    } catch (error) {
        console.error("MongoDB 연결 에러:", error);
        throw error;
    }
    return db;
}

async function insertDocument(collectionName, document, dbName = 'mydatabase') {
    try {
        const db = await connectDB(dbName);
        const result = await db.collection(collectionName).insertOne(document);
        return result;
    } catch (error) {
        console.error("문서 삽입 에러:", error);
    }
}

async function findDocuments(collectionName, query = {}, dbName = 'mydatabase') {
    try {
        const db = await connectDB(dbName);
        const documents = await db.collection(collectionName).find(query).toArray();
        return documents;
    } catch (error) {
        console.error("문서 검색 에러:", error);
    }
}

async function findOneDocument(collectionName, query = {}, dbName = 'mydatabase') {
    try {
        const db = await connectDB(dbName);
        const document = await db.collection(collectionName).findOne(query);
        return document;
    } catch (error) {
        console.error("문서 검색 에러:", error);
    }
}

async function updateDocument(collectionName, query, update, dbName = 'mydatabase') {
    try {
        const db = await connectDB(dbName);
        const result = await db.collection(collectionName).updateOne(query, { $set: update });
        return result;
    } catch (error) {
        console.error("문서 업데이트 에러:", error);
    }
}

async function deleteDocument(collectionName, query, dbName = 'mydatabase') {
    try {
        const db = await connectDB(dbName);
        const result = await db.collection(collectionName).deleteOne(query);
        return result;
    } catch (error) {
        console.error("문서 삭제 에러:", error);
    }
}

module.exports = { insertDocument, findDocuments, updateDocument, deleteDocument, findOneDocument };