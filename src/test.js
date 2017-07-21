var allergyFinder = require('./allergyFinder');
function print(data) {
  console.log('Response:', data);
}

allergyFinder.getAllergies('chicken', print);