// Script để test trong browser console
// Copy và paste vào console của browser khi đang ở trang edit product

async function testAPIs() {
    const prefix = window.location.pathname.startsWith('/admin') ? '/admin' : '/employee';
    const endpoints = [
        '/category/thuong-hieu',
        '/kieu-dang', 
        '/mau-xe',
        '/nguyen-lieu'
    ];
    
    console.log('Testing APIs with prefix:', prefix);
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${prefix + endpoint}...`);
            const response = await fetch(prefix + endpoint, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log(`Status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`Success - Items count: ${data.length}`);
                console.log('Sample data:', data.slice(0, 2));
            } else {
                const errorText = await response.text();
                console.error(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error(`Network error for ${endpoint}:`, error);
        }
        console.log('---');
    }
}

// Chạy test
testAPIs();