'use strict';
var Alexa = require('alexa-sdk');
var DynamoDB=require("./dynamoDB");
var allergyFinder = require('./allergyFinder');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.  
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefin;

var SKILL_NAME = "Allergen Check";
var HELP_MESSAGE = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";



//=========================================================================================================================================
//Editing anything below this line might break your skill.  
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('AllergenCheckIntent');
    },
    'AllergenCheckIntent': function () {

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};



// ===================================================


function findAllergies(groupName,recipe,callback) {
    var allergyList;
    allergyFinder.getAllergies(recipe,function(data) {
	allergyList=data;
	DynamoDB.getPeopleInGroup(groupName, function(err,data) {
	    callback(getPeopleInGroupCallback(err,data,allergyList));
	});
    });
}
function getPeopleInGroupCallback(err,data,allergyList) {
    if(err) {
	console.error("FAILED"+err);
	return;
    }
    var peopleWithAllergies=[];
    data.Items.forEach(function (person) {
	var flag=false;
	allergens=person.Allergens.values;
	for(var i=0;i<allergens.length;i++) {
	    var allergen=allergens[i];
	    for(var j=0;j<allergyList.length;j++) {
		allergy=allergyList[j];
		if(allergen==allergy) {
		    peopleWithAllergies.push(person.Name);
		    flag=true;
		    break;
		}
	    }
	    if (flag)
		break;			
	}
    });

    return peopleWithAllergies;
}

