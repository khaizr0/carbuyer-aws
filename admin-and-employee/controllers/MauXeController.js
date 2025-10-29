const { ScanCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');

exports.getAllMauXe = async (req, res) => {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: 'MauXe' }));
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMauXe = async (req, res) => {
  try {
    const id = 'MX' + Date.now();
    await docClient.send(new PutCommand({
      TableName: 'MauXe',
      Item: { id, ...req.body }
    }));
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMauXe = async (req, res) => {
  try {
    await docClient.send(new UpdateCommand({
      TableName: 'MauXe',
      Key: { id: req.params.id },
      UpdateExpression: 'set tenMau = :t',
      ExpressionAttributeValues: { ':t': req.body.tenMau }
    }));
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMauXe = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'MauXe',
      Key: { id: req.params.id }
    }));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
