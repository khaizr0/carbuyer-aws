const { QueryCommand, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { getDB } = require('../config/db');

const getUserByEmail = async (email) => {
  const docClient = getDB();
  const command = new ScanCommand({
    TableName: 'User',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email }
  });
  const result = await docClient.send(command);
  return result.Items?.[0];
};

const addUser = async (user) => {
  const docClient = getDB();
  await docClient.send(new PutCommand({ TableName: 'User', Item: user }));
};

const getCollection = () => {
  return {
    async findOne(query) {
      const docClient = getDB();
      if (query.email) {
        return await getUserByEmail(query.email);
      }
      if (query.id) {
        const command = new QueryCommand({
          TableName: 'User',
          KeyConditionExpression: 'id = :id',
          ExpressionAttributeValues: { ':id': query.id }
        });
        const result = await docClient.send(command);
        return result.Items?.[0];
      }
      if (query.$or) {
        for (const condition of query.$or) {
          if (condition.email) {
            const user = await getUserByEmail(condition.email);
            if (user) return user;
          }
          if (condition.cccd) {
            const command = new ScanCommand({
              TableName: 'User',
              FilterExpression: 'cccd = :cccd',
              ExpressionAttributeValues: { ':cccd': condition.cccd }
            });
            const result = await docClient.send(command);
            if (result.Items?.[0]) return result.Items[0];
          }
        }
      }
      return null;
    },
    async insertOne(user) {
      await addUser(user);
      return { insertedId: user.id };
    },
    async updateOne(filter, update) {
      const docClient = getDB();
      const user = await this.findOne(filter);
      if (!user) return { modifiedCount: 0 };
      const updatedUser = { ...user, ...update.$set };
      await docClient.send(new PutCommand({ TableName: 'User', Item: updatedUser }));
      return { modifiedCount: 1 };
    },
    async deleteOne(filter) {
      const docClient = getDB();
      const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
      await docClient.send(new DeleteCommand({ TableName: 'User', Key: { id: filter.id } }));
      return { deletedCount: 1 };
    },
    async find(query) {
      const docClient = getDB();
      let filterExpression = [];
      let expressionAttributeValues = {};
      
      if (query.hoTen) {
        filterExpression.push('contains(hoTen, :hoTen)');
        expressionAttributeValues[':hoTen'] = query.hoTen.$regex?.source || query.hoTen;
      }
      if (query.PhanLoai !== undefined) {
        filterExpression.push('PhanLoai = :phanLoai');
        expressionAttributeValues[':phanLoai'] = query.PhanLoai;
      }
      
      const command = new ScanCommand({
        TableName: 'User',
        ...(filterExpression.length > 0 && {
          FilterExpression: filterExpression.join(' AND '),
          ExpressionAttributeValues: expressionAttributeValues
        })
      });
      const result = await docClient.send(command);
      return {
        toArray: async () => result.Items || []
      };
    }
  };
};

module.exports = { getUserByEmail, addUser, getCollection };
