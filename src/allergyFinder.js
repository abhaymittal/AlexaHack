module.exports.getAllergies = getAllergies;

const https = require('https');
function getAllergies(query, callback) {
  https.get('https://api.edamam.com/search?app_id=db157fce&app_key=4d0a7088ab759fa8f4f7f1b1503cb98a&from=0&to=1&q=' + encodeURIComponent(query), (res) => {
    var data = [
    ];
    res.on('data', function (chunk) {
      data.push(chunk);
    });
    res.on('end', function () {
      callback(process(data.join('')));
    });
  }).on('error', (e) => {
    console.error(e);
    callback(null);
  });
}
function getHealthLabels(jsonObj) {
  return jsonObj.hits[0].recipe.healthLabels;
}
function extractAllergies(healthLabels) {
  var allergies = {
    'gluten-free': 'Gluten',
    'dairy-free': 'Dairy',
    'egg-free': 'Eggs',
    'soy-free': 'Soy',
    'wheat-free': 'Wheat',
    'fish-free': 'Fish',
    'shellfish-free': 'Shellfish',
    'tree-nut-free': 'Tree Nuts',
    'peanut-free': 'Peanuts'
  };

  var res = [
  ];
  for (var typeOfAllergy in allergies) {
    var allergyFree = false;
    for (var index in healthLabels) {
      if (healthLabels[index].toLowerCase() == typeOfAllergy) {
        allergyFree = true;
        break;
      }
    }
    if (!allergyFree) {
      res.push(allergies[typeOfAllergy]);
    }
  }
  return res;
}
function process(jsonString) {
  try {
    var jsonObj = JSON.parse(jsonString);
    var healthLabels = getHealthLabels(jsonObj);
    return extractAllergies(healthLabels);
  } catch (e) {
    console.error(e);
    return null;
  }
}
function print(label, data) {
  console.log(label, data);
}

function showResponse(data) {
  console.log('Response:', data);
}

// getAllergies('chicken', showResponse);
