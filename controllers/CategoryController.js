const { ScanCommand, PutCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamodb');

// LoaiPhuKien
exports.getAllLoaiPhuKien = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: 'LoaiPhuKien' }));
    res.json(Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createLoaiPhuKien = async (req, res) => {
  try {
    const id = 'LPK' + Date.now();
    await docClient.send(new PutCommand({
      TableName: 'LoaiPhuKien',
      Item: { id, tenLoai: req.body.tenLoai }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLoaiPhuKien = async (req, res) => {
  try {
    await docClient.send(new PutCommand({
      TableName: 'LoaiPhuKien',
      Item: { id: req.params.id, tenLoai: req.body.tenLoai }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLoaiPhuKien = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'LoaiPhuKien',
      Key: { id: req.params.id }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ThuongHieu
exports.getAllThuongHieu = async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: 'ThuongHieu' }));
    res.json(Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createThuongHieu = async (req, res) => {
  try {
    const id = 'TH' + Date.now();
    await docClient.send(new PutCommand({
      TableName: 'ThuongHieu',
      Item: { id, TenTH: req.body.TenTH, idPhanLoaiTH: parseInt(req.body.idPhanLoaiTH) }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateThuongHieu = async (req, res) => {
  try {
    await docClient.send(new PutCommand({
      TableName: 'ThuongHieu',
      Item: { id: req.params.id, TenTH: req.body.TenTH, idPhanLoaiTH: parseInt(req.body.idPhanLoaiTH) }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteThuongHieu = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'ThuongHieu',
      Key: { id: req.params.id }
    }));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
