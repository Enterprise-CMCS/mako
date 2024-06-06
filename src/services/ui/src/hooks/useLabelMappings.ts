import { useMemo } from "react";

export const SUB_TYPES = {
  New: "Initial",
  Amend: "Amendment",
  Renew: "Renewal",
};

export const STATES = {
  AL: "Alabama, AL",
  KY: "Kentucky, KY",
  OH: "Ohio, OH",
  AK: "Alaska, AK",
  LA: "Louisiana, LA",
  OK: "Oklahoma, OK",
  AZ: "Arizona, AZ",
  ME: "Maine, ME",
  OR: "Oregon, OR",
  AR: "Arkansas, AR",
  MD: "Maryland, MD",
  PA: "Pennsylvania, PA",
  AS: "American Samoa, AS",
  MA: "Massachusetts, MA",
  PR: "Puerto Rico, PR",
  CA: "California, CA",
  MI: "Michigan, MI",
  RI: "Rhode Island, RI",
  CO: "Colorado, CO",
  MN: "Minnesota, MN",
  SC: "South Carolina, SC",
  CT: "Connecticut, CT",
  MS: "Mississippi, MS",
  SD: "South Dakota, SD",
  DE: "Delaware, DE",
  MO: "Missouri, MO",
  TN: "Tennessee, TN",
  DC: "District of Columbia, DC",
  MT: "Montana, MT",
  TX: "Texas, TX",
  FL: "Florida, FL",
  NE: "Nebraska, NE",
  TT: "Trust Territories, TT",
  GA: "Georgia, GA",
  NV: "Nevada, NV",
  UT: "Utah, UT",
  GU: "Guam, GU",
  NH: "New Hampshire, NH",
  VT: "Vermont, VT",
  HI: "Hawaii, HI",
  NJ: "New Jersey, NJ",
  VA: "Virginia, VA",
  ID: "Idaho, ID",
  NM: "New Mexico, NM",
  VI: "Virgin Islands, VI",
  IL: "Illinois, IL",
  NY: "New York, NY",
  WA: "Washington, WA",
  IN: "Indiana, IN",
  NC: "North Carolina, NC",
  WV: "West Virginia, WV",
  IA: "Iowa, IA",
  ND: "North Dakota, ND",
  WI: "Wisconsin, WI",
  KS: "Kansas, KS",
  MP: "Northern Mariana Islands, MP",
  WY: "Wyoming, WY",
  ZZ: "ZZ Test Date, ZZ",
};

export const useLabelMapping = () => {
  return useMemo(() => {
    return { ...STATES, ...SUB_TYPES } as Record<string, string>; // add other label mappings
  }, []);
};