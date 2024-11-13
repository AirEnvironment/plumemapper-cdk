import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class PlumemapperCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const lambda_cloneSite = new lambda.Function(this, "cloneSite", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("../src/lambda/cloneSite"),
      memorySize: 512,
      timeout: cdk.Duration.seconds(15),
    });

    lambda_cloneSite.addEnvironment("API_PLUMEMAPPER_SITETABLE_NAME", "Site-qycpioq6zbdofgtelfr7o5lgca-production");
    lambda_cloneSite.addEnvironment("REGION", "ap-southeast-2");

    // Give access to the dynamoDB tables to the lambda function
    // const table = new dynamodb.Table(this, "replacewithsitetablename", {
    //   partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    // });

    // Reference existing DynamoDB table
    const plumemapperProdSiteTable = dynamodb.Table.fromTableName(this, "existing_PlumeMapper_SiteTable_Prod", "Site-qycpioq6zbdofgtelfr7o5lgca-production");
    plumemapperProdSiteTable.grantReadWriteData(lambda_cloneSite);
  }
}
