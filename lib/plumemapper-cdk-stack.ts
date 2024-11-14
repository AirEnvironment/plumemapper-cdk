import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";

export class PlumemapperCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Define your constructs here

    const lambda_cloneSite = new lambda.Function(this, "cloneSite", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lambda/cloneSite")),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(15),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        REGION: "ap-southeast-2",
        API_PLUMEMAPPER_SITETABLE_NAME: "Site-qycpioq6zbdofgtelfr7o5lgca-production",
        API_PLUMEMAPPER_SURVEYCOLLECTIONTABLE_NAME: "SurveyCollection-qycpioq6zbdofgtelfr7o5lgca-production",
        API_PLUMEMAPPER_SURVEYTABLE_NAME: "Survey-qycpioq6zbdofgtelfr7o5lgca-production",
      },
    });

    // Give access to the dynamoDB tables to the lambda function
    // const table = new dynamodb.Table(this, "replacewithsitetablename", {
    //   partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    // });

    // Reference existing DynamoDB table
    const plumemapperProdSiteTable = dynamodb.Table.fromTableName(this, "existing_PlumeMapper_SiteTable_Prod", "Site-qycpioq6zbdofgtelfr7o5lgca-production");
    plumemapperProdSiteTable.grantReadWriteData(lambda_cloneSite);
  }
}
