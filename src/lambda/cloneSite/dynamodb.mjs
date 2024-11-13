const REGION = process.env.REGION;

const API_PLUMEMAPPER_SITETABLE_ARN = process.env.API_PLUMEMAPPER_SITETABLE_ARN;
const API_PLUMEMAPPER_SITETABLE_NAME = process.env.API_PLUMEMAPPER_SITETABLE_NAME;
const API_PLUMEMAPPER_SURVEYCOLLECTIONTABLE_ARN = process.env.API_PLUMEMAPPER_SURVEYCOLLECTIONTABLE_ARN;
const API_PLUMEMAPPER_SURVEYCOLLECTIONTABLE_NAME = process.env.API_PLUMEMAPPER_SURVEYCOLLECTIONTABLE_NAME;
const API_PLUMEMAPPER_SURVEYTABLE_ARN = process.env.API_PLUMEMAPPER_SURVEYTABLE_ARN;
const API_PLUMEMAPPER_SURVEYTABLE_NAME = process.env.API_PLUMEMAPPER_SURVEYTABLE_NAME;

const marshallOptions = {
  removeUndefinedValues: true, // false, by default.
};
const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};
const translateConfig = { marshallOptions, unmarshallOptions };
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({ region: REGION });
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
const docClient = DynamoDBDocumentClient.from(client, translateConfig); // client is DynamoDB client

import { randomUUID } from "crypto";

/**
 * @typedef {object} CloneSiteInput
 * @property {string} newSiteName - The new name for the site
 * @property {string} siteID - The ID of the site to be cloned
 * @property {boolean} [cloneCharacter] - Whether to clone the character
 * @property {boolean} [cloneSources] - Whether to clone the sources
 * @property {boolean} [cloneZones] - Whether to clone the zones
 * @property {boolean} [cloneRegulatoryBuffers] - Whether to clone the regulatory buffers
 * @property {boolean} [cloneGrids] - Whether to clone the grids
 * @property {boolean} [cloneCollectionSurveys] - Whether to clone the collection surveys
 */
export async function cloneSite(cloneSiteInput) {
  // Get the site to be cloned via the siteID
  let siteData;
  const dynamoDBLookupParams = {
    TableName: API_PLUMEMAPPER_SITETABLE_NAME,
    KeyConditionExpression: "id = :siteID",
    ExpressionAttributeValues: {
      ":siteID": cloneSiteInput.siteID,
    },
  };
  try {
    const siteRes = await docClient.send(new QueryCommand(dynamoDBLookupParams));
    siteData = siteRes?.Items[0];
  } catch (e) {
    throw new Error(e);
  }
  console.log("Site lookup from id lookup: ", siteData);

  // Create a new site object with the new name
  const newSiteData = {
    ...siteData,
    id: randomUUID(),
    siteName: cloneSiteInput.newSiteName,
  };
  let response;
  // Create a new site in the database
  try {
    response = await docClient.send(
      new PutCommand({
        TableName: API_PLUMEMAPPER_SITETABLE_NAME,
        Item: newSiteData,
      })
    );
  } catch (e) {
    throw new Error(e);
  }
  console.log("New site created: ", response);

  return response;
}
