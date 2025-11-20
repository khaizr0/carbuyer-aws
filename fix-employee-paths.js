const fs = require('fs');
const path = require('path');

const viewsDir = './employee-and-admin-service/views/employee';
const files = fs.readdirSync(viewsDir);

files.forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(viewsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all /Public/ paths with /employee/Public/
    content = content.replace(/href="\/Public\//g, 'href="/employee/Public/');
    content = content.replace(/src="\/Public\//g, 'src="/employee/Public/');
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('All employee HTML files updated!');