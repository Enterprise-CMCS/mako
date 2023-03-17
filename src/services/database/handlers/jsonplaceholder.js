const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const axios = require("axios");
const { send, SUCCESS, FAILED } = require("cfn-response-async");
const dynamodbClient = new DynamoDBClient({ region: "us-east-1" });

module.exports.seedData = async (event, context) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const items = response.data.map((post) => ({
      PK: `POST#${post.id}`,
      SK: `USER#${post.userId}`,
      title: post.title,
      body: post.body,
    }));

    const putRequests = items.map((item) => ({
      PutRequest: {
        Item: item,
      },
    }));

    const params = {
      RequestItems: {
        [process.env.TABLE_NAME]: putRequests,
      },
    };

    const result = await dynamodbClient.send(new BatchWriteItemCommand(params));
    console.log("Data inserted successfully:", result);
    return result;
  } catch (err) {
    console.error("Error inserting data:", err);
    return err;
  } finally {
    try {
      const responseStatus = SUCCESS; // or FAILED
      const responseData = { message: "Data inserted successfully" };
      await send(event, context, responseStatus, responseData, "static");
    } catch (err) {
      console.error("Error sending response:", err);
      return err;
    }
  }
};
