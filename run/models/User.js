const { getDB } = require('../config/db');

const getUserByEmail = async (email) => {
  const db = getDB();
  const user = await db.collection('User').findOne({ email });
  return user;
};

const addUser = async (user) => {
  const db = getDB();
  await db.collection('User').insertOne(user);
};

const getCollection = async() => {
  const db = getDB();
  return db.collection('User');
};

module.exports = { getUserByEmail, addUser, getCollection };
