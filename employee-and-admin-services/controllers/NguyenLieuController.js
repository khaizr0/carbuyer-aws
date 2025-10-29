const { docClient } = require('../config/dynamodb');
const { ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const getAll = async (req, res) => {
    const data = await docClient.send(new ScanCommand({ TableName: 'NguyenLieuXe' }));
    res.json(data.Items);
};

const create = async (req, res) => {
    const id = 'NL' + Date.now();
    await docClient.send(new PutCommand({ TableName: 'NguyenLieuXe', Item: { id, ...req.body } }));
    res.json({ success: true });
};

const update = async (req, res) => {
    const { id } = req.params;
    await docClient.send(new PutCommand({ TableName: 'NguyenLieuXe', Item: { id, ...req.body } }));
    res.json({ success: true });
};

const deleteItem = async (req, res) => {
    await docClient.send(new DeleteCommand({ TableName: 'NguyenLieuXe', Key: { id: req.params.id } }));
    res.json({ success: true });
};

module.exports = { getAll, create, update, deleteItem };
