const sqlite3 = require('sqlite3').verbose();
const isTest = process.env.NODE_ENV === 'test';

const accountDB = new sqlite3.Database(isTest ? ':memory:' : 'accounts.db');
const exhibitionDB = new sqlite3.Database(isTest ? ':memory:' : 'artExhibitions.db');

module.exports = { accountDB, exhibitionDB };
