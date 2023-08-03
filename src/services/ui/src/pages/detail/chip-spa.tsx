import { SearchData } from "@/api";
import { DetailWrapper } from "./wrapper";
import { Link } from "@enterprise-cmcs/macpro-ux-lib";
import {
  AdditionalInfo,
  Attachmentslist,
  CardWithTopBorder,
  ChipSpaPackageDetails,
  DetailsSection,
  SubmissionInfo,
} from "@/components";

export const ChipSpa = ({ data }: { data?: SearchData }) => {
  console.log({ data });
  return (
    <div className="block md:flex">
      <aside className="flex-none font-bold hidden md:block pr-8">
        {[
          "Package Overview",
          "Package Details",
          "Attachments",
          "Additional Info",
        ].map((val) => (
          <Link
            key={val}
            href={`#${val.toLowerCase().split(" ").join("-")}`}
            style={{
              display: "block",
              textDecoration: "none",
              marginBottom: "16px",
            }}
            text={val}
          />
        ))}
      </aside>
      <div className="flex-1">
        <section id="package-overview" className="block md:flex mb-8 gap-8">
          <CardWithTopBorder title="Status">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {data?._source.status || "Unknown"}
              </h2>
            </div>
          </CardWithTopBorder>
          <CardWithTopBorder title="Package Actions">
            <div className="flex flex-col gap-y-2">
              <Link
                href="#"
                style={{
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                {" "}
                Withdraw Package
              </Link>
              <Link
                href="#"
                style={{ textDecoration: "none", fontWeight: 700 }}
              >
                {" "}
                Issue Formal RAI
              </Link>
            </div>
          </CardWithTopBorder>
        </section>
        <DetailsSection id="package-details" title="CHIP SPA Package Details">
          <ChipSpaPackageDetails
            {...{
              "SPA ID": data?._id,
              Type: data?._source.programType,
              State: data?._source.state,
              "Sub-Type": data?._source.planType,
              "Initial Submission Date": data?._source.submission_date,
              "Proposed Effective Date": data?._source.proposedDate,
              "Approved Effective Date": data?._source.approvedEffectiveDate,
              "Change Date": data?._source.changedDate,
            }}
          />
        </DetailsSection>

        <DetailsSection id="attachments" title="Attachments">
          <Attachmentslist {...{ attachments: data?._source.attachments }} />
        </DetailsSection>
        <DetailsSection id="additional-info" title="Additional Information">
          <AdditionalInfo
            {...{ additionalInfo: data?._source.additionalInformation }}
          />
          {/* in general, for all these components, should we be passing the entire record instead?  and keep that this is that logic in the component */}
          <SubmissionInfo
            {...{
              submitterName: data?._source.submitterName,
              submitterEmail: data?._source.submitterEmail,
              submissionOrigin: data?._source.submissionOrigin,
              leadAnalyst: data?._source.leadAnalyst,
            }}
          />
        </DetailsSection>
      </div>
    </div>
  );
};

export const ChipSpaPage = () => (
  <DetailWrapper>
    <ChipSpa />
  </DetailWrapper>
);
