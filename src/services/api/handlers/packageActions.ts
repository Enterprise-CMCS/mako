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

import { OneMacSink, transformOnemac } from "shared-types";

export async function issueRai(id: string, timestamp: number) {
  console.log("CMS issuing a new RAI");
  const pool = await sql.connect(config);
  const query = `
    Insert into SEA.dbo.RAI (ID_Number, RAI_Requested_Date)
      values ('${id}'
        ,dateadd(s, convert(int, left(${timestamp}, 10)), cast('19700101' as datetime)))
  `;
  // Prepare the request
  const request = pool.request();
  request.input("ID_Number", sql.VarChar, id);
  request.input("RAI_Requested_Date", sql.DateTime, new Date(timestamp));

  const result = await sql.query(query);
  console.log(result);
  await pool.close();
}

export async function withdrawRai(id, timestamp) {
  console.log("CMS withdrawing an RAI");
}

export async function respondToRai(id, timestamp) {
  console.log("State respnding to RAI");
}

export async function withdrawPackage(id, timestamp) {
  console.log("State withdrawing a package.");
}
