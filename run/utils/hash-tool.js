const readline = require('readline');
const { hashPassword, comparePassword } = require('./crypto-helper');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const showMenu = () => {
  console.log('\n=== Password Hash Tool ===');
  console.log('1. Hash password');
  console.log('2. Verify password');
  console.log('3. Exit');
};

const askOption = () => {
  rl.question('Choose option (1, 2, or 3): ', (option) => {
    if (option === '1') {
      rl.question('Enter password to hash: ', (password) => {
        const hashed = hashPassword(password);
        console.log('Hashed password:', hashed);
        askOption();
      });
    } else if (option === '2') {
      rl.question('Enter password: ', (password) => {
        rl.question('Enter stored hash: ', (stored) => {
          const isValid = comparePassword(password, stored);
          console.log('Password valid:', isValid);
          askOption();
        });
      });
    } else if (option === '3') {
      console.log('Goodbye!');
      rl.close();
    } else {
      console.log('Invalid option');
      askOption();
    }
  });
};

showMenu();
askOption();