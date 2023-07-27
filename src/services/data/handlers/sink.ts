import { Handler } from "aws-lambda";
import { decode } from "base-64";
import * as os from "./../../../libs/opensearch-lib";
import { AnyZodObject } from "zod";
if (!process.env.osDomain) {
  throw "ERROR:  process.env.osDomain is required,";
}
const osDomain: string = process.env.osDomain;
const index = "main";

const planTypeLookup = {
  121: "1115",
  122: "1915b_waivers",
  123: "1915c_waivers",
  124: "CHIP_SPA",
  125: "Medicaid_SPA",
  126: "1115_Indep_Plus",
  127: "1915c_Indep_Plus",
  130: "UPL",
};

type ProgramType = "WAIVER" | "MEDICAID" | "CHIP" | "UNKNOWN";

function sortAndExtractReceivedDate(arr: any) {
  // Sort the array by RAI_REQUESTED_DATE in ascending order
  arr.sort((a, b) => a.RAI_REQUESTED_DATE - b.RAI_REQUESTED_DATE);

  return arr[arr.length - 1].RAI_RECEIVED_DATE;
}

export const seatool: Handler = async (event) => {
  const records: Record<string, unknown>[] = [];
  for (const key in event.records) {
    event.records[key].forEach(
      ({ key, value }: { key: string; value: string }) => {
        const id: string = JSON.parse(decode(key));
        const eventData: Record<any, any> = {};
        if (!value) {
          // handle delete somehow
        } else {
          // do different things based on authority
          const record = { ...JSON.parse(decode(value)) };
          const planTypeId = record?.STATE_PLAN?.PLAN_TYPE_ID;
          const rai_received_date = record?.["RAI"]
            ? sortAndExtractReceivedDate(record?.["RAI"])
            : null;

          switch (planTypeId) {
          case 124:
          case 125:
            // These are spas
            eventData.id = id;
            eventData.planTypeId = planTypeId;
            eventData.planType = planTypeLookup[planTypeId];
            eventData.authority = "SPA";
            eventData.state = record?.["STATES"]?.[0]?.["STATE_CODE"] || null;
            eventData.submission_date =
                record?.["STATE_PLAN"]?.["SUBMISSION_DATE"] || null;
            if (rai_received_date) {
              eventData.rai_received_date = rai_received_date; // maybe
            }
            eventData.status =
                record?.SPW_STATUS?.[0].SPW_STATUS_DESC || null;
          case 122:
          case 123:
            // These are waivers
            eventData.id = id;
            eventData.planTypeId = planTypeId;
            eventData.planType = planTypeLookup[planTypeId];
            eventData.authority = "WAIVER";
            eventData.state = record?.["STATES"]?.[0]?.["STATE_CODE"] || null;
            eventData.submission_date =
                record?.["STATE_PLAN"]?.["SUBMISSION_DATE"] || null;
            if (rai_received_date) {
              eventData.rai_received_date = rai_received_date; // maybe
            }
            eventData.status =
                record?.SPW_STATUS?.[0].SPW_STATUS_DESC || null;
          default:
            // This is not something we're concerned with
          }
          records.push({
            key: id,
            value: eventData,
          });
        }
      }
    );
  }
  console.log(records);
  console.log("yepyep");
  try {
    for (const item of records) {
      await os.updateData(osDomain, {
        index,
        id: item.key,
        body: {
          doc: item.value,
          doc_as_upsert: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const getProgramType = (record: { componentType: string }) => {
  let type: ProgramType = "UNKNOWN";
  if (record.componentType.includes("waiver")) type = "WAIVER";
  if (record.componentType.includes("medicaid")) type = "MEDICAID";
  if (record.componentType.includes("chip")) type = "CHIP";

  return type;
};
export const onemac: Handler = async (event) => {
  const records: Record<string, unknown>[] = [];
  for (const key in event.records) {
    event.records[key].forEach(
      ({ key, value }: { key: string; value: string }) => {
        const id: string = decode(key);
        if (!value) {
          records.push({
            key: id,
            value: {
              onemac: null,
            },
          });
        } else {
          const record = { ...JSON.parse(decode(value)) };

          if (record.sk !== "Package") {
            console.log("Not a package type - ignoring");
            return;
          }
          const programType = getProgramType(record);

          if (
            record.proposedEffectiveDate &&
            !(record.proposedEffectiveDate instanceof Date)
          ) {
            record.proposedEffectiveDate = null;
          }

          if (
            record.finalDispositionDate &&
            !(record.finalDispositionDate instanceof Date)
          ) {
            record.finalDispositionDate = null;
          }

          records.push({
            key: id,
            value: {
              programType,
              [programType]: record,
            },
          });
        }
      }
    );
  }
  try {
    for (const item of records) {
      await os.updateData(osDomain, {
        index,
        id: item.key,
        body: {
          doc: item.value,
          doc_as_upsert: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};
