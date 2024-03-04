import { OneMacUser } from "ui/src/api";
import { Authority, opensearch } from "../../shared-types";

export const testStateUser: OneMacUser = {
  isCms: false,
  user: {
    sub: "0000aaaa-0000-00aa-0a0a-aaaaaa000000",
    "custom:cms-roles": "onemac-micro-statesubmitter",
    email_verified: true,
    given_name: "George",
    family_name: "Harrison",
    "custom:state": "VA,OH,SC,CO,GA,MD",
    email: "george@example.com",
  },
};
export const testCmsUser: OneMacUser = {
  isCms: true,
  user: {
    sub: "0000aaaa-0000-00aa-0a0a-aaaaaa000000",
    "custom:cms-roles": "onemac-micro-reviewer",
    email_verified: true,
    given_name: "CMS",
    family_name: "Person",
    "custom:state": "VA,OH,SC,CO,GA,MD",
    email: "george@example.com",
  },
};
export const baseNewSubmissionObj: opensearch.main.ItemResult = {
  _index: "main",
  _id: "MD-74-0036",
  _version: 4,
  _seq_no: 14206,
  _primary_term: 1,
  found: true,
  _source: {
    id: "MD-74-0036",
    attachments: [
      {
        filename:
          "CMS179 TRANSMITTAL FORM - Home and Community-Based Services, Psychosocial Rehabilitation Services.docx",
        title: "CMS Form 179",
        bucket: "om-uploads-master-attachments-635052997545",
        key: "a4bc64d1-46a8-4305-bfee-209e1a3ebb40",
        uploadDate: 1709319909222,
      },
      {
        filename: "10-20-17 MT 1915(b)(4) Big Sky Waiver app revised (6).docx",
        title: "SPA Pages",
        bucket: "om-uploads-master-attachments-635052997545",
        key: "22ad64f1-1e33-4dc0-a071-a587df644cbe",
        uploadDate: 1709319909222,
      },
    ],
    appkParentId: null,
    raiWithdrawEnabled: false,
    additionalInformation: "does the master branch work?!",
    submitterEmail: "george@example.com",
    submitterName: "George Harrison",
    origin: "OneMAC",
    changedDate: "2024-03-01T19:05:09.773Z",
    statusDate: "2024-03-01T00:00:00.000Z",
    subTypeName: null,
    subject: null,
    typeName: null,
    description: null,
    leadAnalystName: null,
    raiReceivedDate: null,
    raiRequestedDate: null,
    leadAnalystOfficerId: null,
    proposedDate: "2024-03-30T00:00:00.000Z",
    state: "MD",
    raiWithdrawnDate: null,
    finalDispositionDate: null,
    stateStatus: "Under Review",
    submissionDate: "2024-03-01T00:00:00.000Z",
    subTypeId: null,
    cmsStatus: "Pending",
    reviewTeam: [],
    flavor: "MEDICAID",
    authorityId: 125,
    initialIntakeNeeded: true,
    authority: "Medicaid SPA" as Authority,
    approvedEffectiveDate: null,
    typeId: null,
    seatoolStatus: "Pending",
    secondClock: false,
    changelog: [
      {
        _index: "changelog",
        _id: "MD-12-3456",
        _score: null,
        // @ts-ignore
        _source: {
          authority: "medicaid spa",
          origin: "micro",
          appkParentId: null,
          additionalInformation: "does the master branch work?!",
          submitterName: "George Harrison",
          submitterEmail: "george@example.com",
          attachments: [
            {
              filename:
                "CMS179 TRANSMITTAL FORM - Home and Community-Based Services, Psychosocial Rehabilitation Services.docx",
              title: "CMS Form 179",
              bucket: "test-bucket",
              key: "test-key",
              uploadDate: 1709319909222,
            },
            {
              filename:
                "10-20-17 MT 1915(b)(4) Big Sky Waiver app revised (6).docx",
              title: "SPA Pages",
              bucket: "test-bucket",
              key: "test-key",
              uploadDate: 1709319909222,
            },
          ],
          raiWithdrawEnabled: false,
          actionType: "new-submission",
          timestamp: "1709319909826",
          id: "MD-12-3456",
          packageId: "MD-12-3456",
        },
        sort: [1709319909826],
      },
    ],
  },
};
