import { response } from "../libs/handler";
import { APIGatewayEvent } from "aws-lambda";
import * as sql from "mssql";
import { isAuthorized } from "../libs/auth/user";

import { Authority, onemacSchema } from "shared-types";
import {
  getNextBusinessDayTimestamp,
  seaToolFriendlyTimestamp,
} from "shared-utils";
import { buildStatusMemoQuery } from "../libs/statusMemo";
import { produceMessage } from "../libs/kafka";

export const submit = async (event: APIGatewayEvent) => {
  try {
    if (!event.body) {
      return response({
        statusCode: 400,
        body: "Event body required",
      });
    }
    const body = JSON.parse(event.body);
    console.log(body);

    if (!(await isAuthorized(event, body.state))) {
      return response({
        statusCode: 403,
        body: { message: "Unauthorized" },
      });
    }

    const activeSubmissionTypes = [
      Authority.CHIP_SPA,
      Authority.MED_SPA,
      Authority["1915b"],
      Authority["1915c"], // We accept amendments, renewals, and extensions for Cs
    ];
    if (!activeSubmissionTypes.includes(body.authority)) {
      return response({
        statusCode: 400,
        body: {
          message: `OneMAC (micro) Submissions API does not support the following authority: ${body.authority}`,
        },
      });
    }

    // I think we need to break this file up.  A switch maybe
    if(body.seaActionType == "Extend") { 
  //  if([Authority["1915b"], Authority["1915c"]].includes(body.authority) && body.seaActionType == "Extend") { 
      console.log("Received new temporary extension sumbissions");
      console.log("currently doing nothing and will return");
      return response({
        statusCode: 403,
        body: { message: "DEV RETURN..." },
      });
    }

    const today = seaToolFriendlyTimestamp();
    const submissionDate = getNextBusinessDayTimestamp();
    console.log(
      "Initial Submission Date determined to be: " +
        new Date(submissionDate).toISOString()
    );
    const pool = await sql.connect({
      user: process.env.dbUser,
      password: process.env.dbPassword,
      server: process.env.dbIp as string,
      port: parseInt(process.env.dbPort as string),
      database: "SEA",
    });
    console.log(body);
    const query = `
      DECLARE @RegionID INT;
      DECLARE @PlanTypeID INT;
      DECLARE @SPWStatusID INT;
      DECLARE @SubmissionDate DATETIME;
      DECLARE @StatusDate DATETIME;
      DECLARE @ProposedDate DATETIME;
      DECLARE @TitleName NVARCHAR(MAX) = ${
        body.subject ? `'${body.subject.replace("'", "''")}'` : "NULL"
      };
      DECLARE @SummaryMemo NVARCHAR(MAX) = ${
        body.description ? `'${body.description.replace("'", "''")}'` : "NULL"
      };
      DECLARE @StatusMemo NVARCHAR(MAX) = ${buildStatusMemoQuery(
        body.id,
        "Package Submitted",
        "insert"
      )}
      
      -- Set your variables
      SELECT @RegionID = Region_ID FROM SEA.dbo.States WHERE State_Code = '${
        body.state
      }';
      SELECT @PlanTypeID = Plan_Type_ID FROM SEA.dbo.Plan_Types WHERE Plan_Type_Name = '${
        body.authority
      }';
      SELECT @SPWStatusID = SPW_Status_ID FROM SEA.dbo.SPW_Status WHERE SPW_Status_DESC = 'Pending';
      
      SET @SubmissionDate = DATEADD(s, CONVERT(INT, LEFT(${submissionDate}, 10)), CAST('19700101' as DATETIME));
      SET @StatusDate = DATEADD(s, CONVERT(INT, LEFT(${today}, 10)), CAST('19700101' as DATETIME));
      SET @ProposedDate = DATEADD(s, CONVERT(INT, LEFT(${
        body.proposedEffectiveDate
      }, 10)), CAST('19700101' as DATETIME));

      -- Main insert into State_Plan
      INSERT INTO SEA.dbo.State_Plan (ID_Number, State_Code, Title_Name, Summary_Memo, Region_ID, Plan_Type, Submission_Date, Status_Date, Proposed_Date, SPW_Status_ID, Budget_Neutrality_Established_Flag, Status_Memo)
      VALUES ('${body.id}', '${
      body.state
    }', @TitleName, @SummaryMemo, @RegionID, @PlanTypeID, @SubmissionDate, @StatusDate, @ProposedDate, @SPWStatusID, 0, @StatusMemo);
    `;
    console.log(query);

    // TODO: FFF
    //   -- Insert into State_Plan_Service_SubTypes
    //   INSERT INTO SEA.dbo.State_Plan_Service_SubTypes (ID_Number, Service_SubType_ID)
    //   VALUES ('${body.id}', TRY_CAST('${body.subTypeId}' AS INT));

    //   -- Insert into State_Plan_Service_Types
    //   INSERT INTO SEA.dbo.State_Plan_Service_Types (ID_Number, Service_Type_ID)
    //   VALUES ('${body.id}', TRY_CAST('${body.typeId}' AS INT));
    // `;

    const result = await sql.query(query);
    console.log(result);
    if ([Authority["1915b"], Authority.CHIP_SPA].includes(body.authority)) {
      const actionTypeQuery = `
      UPDATE sp
      SET sp.Action_Type = at.Action_ID
      FROM SEA.dbo.State_Plan sp
      INNER JOIN SEA.dbo.Action_Types at ON at.Plan_Type_ID = (
          SELECT pt.Plan_Type_ID
          FROM SEA.dbo.Plan_Types pt
          WHERE pt.Plan_Type_Name = '${body.authority}'
      )
      WHERE at.Action_Name = '${body.seaActionType}'
      AND sp.ID_Number = '${body.id}';
      
      `;
      const actionTypeQueryResult = await sql.query(actionTypeQuery);
      console.log(actionTypeQueryResult);
    }

    await pool.close();

    const eventBody = onemacSchema.safeParse(body);
    if (!eventBody.success) {
      return console.log(
        "MAKO Validation Error. The following record failed to parse: ",
        JSON.stringify(eventBody),
        "Because of the following Reason(s): ",
        eventBody.error.message
      );
    }

    console.log(eventBody);
    await produceMessage(
      process.env.topicName as string,
      body.id,
      JSON.stringify(eventBody.data)
    );

    return response({
      statusCode: 200,
      body: { message: "success" },
    });
  } catch (error) {
    console.error({ error });
    return response({
      statusCode: 500,
      body: { message: "Internal server error" },
    });
  }
};

export const handler = submit;
