var AWS=require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  endpoint: "dynamodb.us-east-1.amazonaws.com"
});

var table="AllergeniusPersonTable";




function getItem(primaryKey,callback) {
    var params= {
	TableName: table,
	Key:{
	    "Name":primaryKey
	}
    };
    var docClient= new AWS.DynamoDB.DocumentClient();

    docClient.get(params,callback);
}
    
function writeItem(item,callback) {
    var docClient=new AWS.DynamoDB.DocumentClient();
    var params={
	TableName: table,
	Item: {
	    "Name":item.Name,
	    "Groups":docClient.createSet(item.Groups),
	    "Allergens":docClient.createSet(item.Allergens)
	}
    }



    docClient.put(params,callback);
}

function getPeopleInGroup(groupName,callback) {
    var params={
	TableName: table,
	FilterExpression: "contains(Groups,:group)",
	ExpressionAttributeValues: {
	    ":group":groupName
	}
    };
    var docClient=new AWS.DynamoDB.DocumentClient();
    docClient.scan(params,callback);
}

module.exports= {
    getItem,
    writeItem,
    getPeopleInGroup
}
