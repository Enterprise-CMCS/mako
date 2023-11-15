import * as sql from "mssql";

const user = process.env.dbUser;
const password = process.env.dbPassword;
const server = process.env.dbIp;
const port = parseInt(process.env.dbPort);
const config = {
  user: user,
  password: password,
  server: server,
  port: port,
  database: "SEA",
};

import { Action, raiSchema, RaiSchema } from "shared-types";
import { produceMessage } from "../libs/kafka";
import { response } from "../libs/handler";
import { SEATOOL_STATUS } from "shared-types/statusHelper";
import { getActiveRai, getLatestRai } from "shared-utils";

const TOPIC_NAME = process.env.topicName;

export async function issueRai(body: RaiSchema) {
  console.log("CMS issuing a new RAI");
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();
    // Issue RAI
    const query1 = `
      Insert into SEA.dbo.RAI (ID_Number, RAI_Requested_Date)
        values ('${body.id}'
        ,dateadd(s, convert(int, left(${body.requestedDate}, 10)), cast('19700101' as datetime)))
    `;
    const result1 = await transaction.request().query(query1);
    console.log(result1);

    // Update Status
    const query2 = `
      UPDATE SEA.dbo.State_Plan
        SET SPW_Status_ID = (Select SPW_Status_ID from SEA.dbo.SPW_Status where SPW_Status_DESC = '${SEATOOL_STATUS.PENDING_RAI}')
        WHERE ID_Number = '${body.id}'
    `;
    const result2 = await transaction.request().query(query2);
    console.log(result2);

    // write to kafka here
    const result = raiSchema.safeParse(body);
    if (result.success === false) {
      console.log(
        "RAI Validation Error. The following record failed to parse: ",
        JSON.stringify(body),
        "Because of the following Reason(s):",
        result.error.message
      );
    } else {
      await produceMessage(
        TOPIC_NAME,
        body.id,
        JSON.stringify({ ...result.data, actionType: Action.ISSUE_RAI })
      );
    }

    // Commit transaction
    await transaction.commit();
  } catch (err) {
    // Rollback and log
    await transaction.rollback();
    console.error("Error executing one or both queries:", err);
  } finally {
    // Close pool
    await pool.close();
  }
}

export async function withdrawRai(id, timestamp) {
  console.log("CMS withdrawing an RAI");
}

export async function respondToRai(body: RaiSchema, rais: any) {
  console.log("State responding to RAI");
  const activeKey = getActiveRai(rais).key;
  console.log("LATEST RAI KEY: " + activeKey);
  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);
  console.log(body);
  try {
    await transaction.begin();
    // Issue RAI
    const query1 = `
      UPDATE SEA.dbo.RAI
        SET RAI_RECEIVED_DATE = DATEADD(s, CONVERT(int, LEFT('${body.responseDate}', 10)), CAST('19700101' AS DATETIME))
        WHERE ID_Number = '${body.id}' AND RAI_REQUESTED_DATE = DATEADD(s, CONVERT(int, LEFT('${activeKey}', 10)), CAST('19700101' AS DATETIME))
    `;
    const result1 = await transaction.request().query(query1);
    console.log(result1);

    // Update Status
    const query2 = `
      UPDATE SEA.dbo.State_Plan
        SET SPW_Status_ID = (Select SPW_Status_ID from SEA.dbo.SPW_Status where SPW_Status_DESC = '${SEATOOL_STATUS.PENDING}')
        WHERE ID_Number = '${body.id}'
    `;
    const result2 = await transaction.request().query(query2);
    console.log(result2);

    //   // write to kafka here
    const result = raiSchema.safeParse({ ...body, requestedDate: activeKey });
    if (result.success === false) {
      console.log(
        "RAI Validation Error. The following record failed to parse: ",
        JSON.stringify(body),
        "Because of the following Reason(s):",
        result.error.message
      );
    } else {
      console.log(JSON.stringify(result, null, 2));
      await produceMessage(
        TOPIC_NAME,
        body.id,
        JSON.stringify({
          ...result.data,
          actionType: Action.RESPOND_TO_RAI,
        })
      );
    }

    // Commit transaction
    await transaction.commit();
  } catch (err) {
    // Rollback and log
    await transaction.rollback();
    console.error("Error executing one or both queries:", err);
  } finally {
    // Close pool
    await pool.close();
  }
  console.log("heyo");
}

export async function withdrawPackage(id, timestamp) {
  console.log("State withdrawing a package.");
}

export async function toggleRaiResponseWithdraw(body, toggle) {
  const { id } = body;
  try {
    await produceMessage(
      TOPIC_NAME,
      id,
      JSON.stringify({
        actionType: toggle
          ? Action.ENABLE_RAI_WITHDRAW
          : Action.DISABLE_RAI_WITHDRAW,
        raiWithdrawEnabled: toggle,
      })
    );

    return response({
      statusCode: 200,
      body: {
        message: "record successfully submitted",
      },
    });
  } catch (err) {
    console.log(err);

    return response({
      statusCode: 500,
    });
  }
}
