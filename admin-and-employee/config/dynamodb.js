require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Config cho AWS DynamoDB thực hoặc DynamoDB Local
const dynamoConfig = {
  region: process.env.AWS_REGION
};

// Nếu có DYNAMODB_ENDPOINT (local) thì thêm endpoint và fake credentials
if (process.env.DYNAMODB_ENDPOINT) {
  dynamoConfig.endpoint = process.env.DYNAMODB_ENDPOINT;
  dynamoConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeAccessKeyId',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretAccessKey'
  };
}
// Nếu không có endpoint (AWS thực), sử dụng IAM role hoặc credentials từ env
else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  dynamoConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

const client = new DynamoDBClient(dynamoConfig);

const docClient = DynamoDBDocumentClient.from(client);

module.exports = { client, docClient };
