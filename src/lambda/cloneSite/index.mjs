import { cloneSite } from "./dynamodb.mjs";

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

/**
 * The handler function for the Lambda
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  // console.log(`EVENT: ${JSON.stringify(event)}`);

  /** @type {CloneSiteInput} */
  const input = /** @type {CloneSiteInput} **/ (event.arguments.input);

  if (!input?.newSiteName || !input?.siteID) {
    return {
      httpStatusCode: 400,
      body: {
        message: "newSiteName and siteID are required fields",
      },
    };
  }

  // console.log(`INPUT: ${JSON.stringify(input)}`);

  // const endpoint = new URL(GRAPHQL_ENDPOINT);

  // const signer = new SignatureV4({
  // 	credentials: defaultProvider(),
  // 	region: AWS_REGION,
  // 	service: "appsync",
  // 	sha256: Sha256,
  // });

  // const requestToBeSigned = new HttpRequest({
  // 	method: "POST",
  // 	headers: {
  // 		"Content-Type": "application/json",
  // 		host: endpoint.host,
  // 	},
  // 	hostname: endpoint.host,
  // 	body: JSON.stringify({
  // 		query,
  // 		variables: { siteID: input.siteID }, // Pass the siteID variable here
  // 	}),
  // 	path: endpoint.pathname,
  // });

  // const signed = await signer.sign(requestToBeSigned);
  // const request = new Request(endpoint, signed);

  let httpStatusCode = 200;
  let response;

  try {
    // response = await fetch(request);
    // body = await response.json();
    // console.log(`RESPONSE: ${JSON.stringify(body)}`);
    // Below is the expected response for appsync query that will work with schema.graphql
    // body = {
    // 	message: "Hello from your Amplify Function!",
    // 	data: JSON.stringify(input),
    // };
    response = await cloneSite(input);
  } catch (error) {
    return {
      httpStatusCode: 500,
      body: {
        message: error?.message,
      },
    };
  }

  return {
    httpStatusCode: httpStatusCode,
    body: {
      message: "Site cloned successfully. Check the response for details.",
      data: JSON.stringify(response),
    },
  };
};
