const { ScanCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');

exports.getAllKieuDang = async (req, res) => {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: 'KieuDang' }));
    res.json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createKieuDang = async (req, res) => {
  try {
    const id = 'KD' + Date.now();
    await docClient.send(new PutCommand({
      TableName: 'KieuDang',
      Item: { id, ...req.body }
    }));
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateKieuDang = async (req, res) => {
  try {
    await docClient.send(new UpdateCommand({
      TableName: 'KieuDang',
      Key: { id: req.params.id },
      UpdateExpression: 'set tenKieuDang = :t',
      ExpressionAttributeValues: { ':t': req.body.tenKieuDang }
    }));
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteKieuDang = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'KieuDang',
      Key: { id: req.params.id }
    }));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
