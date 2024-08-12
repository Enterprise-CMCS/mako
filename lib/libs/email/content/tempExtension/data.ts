export const tempExtention = {
  body: {
    took: 368,
    errors: false,
    items: [
      {
        update: {
          _index: "rainmain",
          _id: "CO-00025.R00.00",
          _version: 5,
          result: "updated",
          forced_refresh: true,
          _shards: {
            total: 2,
            successful: 2,
            failed: 0,
          },
          _seq_no: 12331,
          _primary_term: 1,
          status: 200,
        },
      },
    ],
  },
  statusCode: 200,
  headers: {
    date: "Sun, 11 Aug 2024 21:20:40 GMT",
    "content-type": "application/json; charset=UTF-8",
    "content-length": "243",
    connection: "keep-alive",
    "access-control-allow-origin": "*",
  },
  meta: {
    context: null,
    request: {
      params: {
        method: "POST",
        path: "/_bulk",
        bulkBody: [
          {
            update: {
              _index: "rainmain",
              _id: "CO-00025.R00.00",
            },
          },
          {
            doc: {
              id: "CO-00025.R00.00",
              flavor: "WAIVER",
              actionType: "New",
              actionTypeId: 74,
              approvedEffectiveDate: null,
              description: null,
              finalDispositionDate: null,
              leadAnalystOfficerId: null,
              initialIntakeNeeded: true,
              leadAnalystName: null,
              authorityId: 122,
              authority: "1915(b)",
              types: null,
              subTypes: null,
              proposedDate: "2024-08-15T00:00:00.000Z",
              raiReceivedDate: null,
              raiRequestedDate: null,
              raiWithdrawnDate: null,
              reviewTeam: [],
              state: "CO",
              stateStatus: "Under Review",
              statusDate: "2024-08-11T00:00:00.000Z",
              cmsStatus: "Pending",
              seatoolStatus: "Pending",
              submissionDate: "2024-08-12T00:00:00.000Z",
              subject: null,
              secondClock: false,
            },
            doc_as_upsert: true,
          },
        ],
        querystring: "refresh=true",
        body: '{"update":{"_index":"rainmain","_id":"CO-00025.R00.00"}}\n{"doc":{"id":"CO-00025.R00.00","flavor":"WAIVER","actionType":"New","actionTypeId":74,"approvedEffectiveDate":null,"description":null,"finalDispositionDate":null,"leadAnalystOfficerId":null,"initialIntakeNeeded":true,"leadAnalystName":null,"authorityId":122,"authority":"1915(b)","types":null,"subTypes":null,"proposedDate":"2024-08-15T00:00:00.000Z","raiReceivedDate":null,"raiRequestedDate":null,"raiWithdrawnDate":null,"reviewTeam":[],"state":"CO","stateStatus":"Under Review","statusDate":"2024-08-11T00:00:00.000Z","cmsStatus":"Pending","seatoolStatus":"Pending","submissionDate":"2024-08-12T00:00:00.000Z","subject":null,"secondClock":false},"doc_as_upsert":true}\n',
        headers: {
          "user-agent":
            "opensearch-js/2.11.0 (linux 5.10.219-229.866.amzn2.x86_64-x64; Node.js v18.20.4)",
          "content-type": "application/x-ndjson",
          "content-length": "727",
        },
        timeout: 30000,
      },
      options: {},
      id: 7,
    },
    name: "opensearch-js",
    connection: {
      url: "https://vpc-opensearchdomai-rzzjuyi48nzc-wp5em7c73qkotfxn3vjnsep6em.us-east-1.es.amazonaws.com/",
      id: "https://vpc-opensearchdomai-rzzjuyi48nzc-wp5em7c73qkotfxn3vjnsep6em.us-east-1.es.amazonaws.com/",
      headers: {},
      deadCount: 0,
      resurrectTimeout: 0,
      _openRequests: 0,
      status: "alive",
      roles: {
        data: true,
        ingest: true,
      },
    },
    attempts: 0,
    aborted: false,
  },
};
