// Script test API endpoints
const fetch = require('node-fetch');

const baseUrl = 'http://carbuyer-alb-360273454.ap-southeast-1.elb.amazonaws.com';

async function testAPI() {
    const endpoints = [
        '/employee/category/thuong-hieu',
        '/employee/kieu-dang',
        '/employee/mau-xe', 
        '/employee/nguyen-lieu'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint}...`);
            const response = await fetch(baseUrl + endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`Status: ${response.status}`);
            const text = await response.text();
            console.log(`Response: ${text.substring(0, 200)}...`);
            console.log('---');
        } catch (error) {
            console.error(`Error testing ${endpoint}:`, error.message);
        }
    }
}

testAPI();