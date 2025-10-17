require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { client, docClient } = require('../config/dynamodb');
const fs = require('fs');
const path = require('path');

const tableSchemas = {
    User: {
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [{
            IndexName: 'EmailIndex',
            KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }
};

const defaultSchema = {
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
};

async function createTable(tableName) {
    const schema = tableSchemas[tableName] || defaultSchema;
    try {
        await client.send(new CreateTableCommand({ TableName: tableName, ...schema }));
        console.log(`  ✓ Created table: ${tableName}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.log(`  ℹ Table ${tableName} already exists`);
        } else {
            console.error(`  ✗ Error creating ${tableName}:`, error.message);
        }
    }
}

async function restoreData(backupFile) {
    let filePath;
    if (path.isAbsolute(backupFile)) {
        filePath = backupFile;
    } else if (backupFile.startsWith('RAB_Data/')) {
        filePath = path.join(process.cwd(), backupFile);
    } else {
        filePath = path.join(__dirname, backupFile);
    }
    
    if (!fs.existsSync(filePath)) {
        console.error(`✗ Backup file not found: ${filePath}`);
        process.exit(1);
    }
    
    console.log(`Reading backup from: ${filePath}\n`);
    const backup = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log('\nCreating tables...');
    for (const tableName of Object.keys(backup)) {
        await createTable(tableName);
    }
    
    console.log('\nWaiting for tables to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    for (const [tableName, items] of Object.entries(backup)) {
        console.log(`\nRestoring ${tableName}...`);
        
        for (const item of items) {
            try {
                await docClient.send(new PutCommand({ TableName: tableName, Item: item }));
                console.log(`  ✓ Restored: ${item.id}`);
            } catch (error) {
                console.error(`  ✗ Error restoring ${item.id}:`, error.message);
            }
        }
        
        console.log(`✓ Completed ${tableName}: ${items.length} items`);
    }
    
    console.log('\n✓ Restore completed!');
}

const backupFile = process.argv[2] || 'backup-latest.json';
restoreData(backupFile);
