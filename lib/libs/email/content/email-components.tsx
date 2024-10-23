import {
  Text,
  Link,
  Section,
  Row,
  Column,
  Hr,
  Heading,
  Img,
} from "@react-email/components";
import { Attachment } from "shared-types";
type AttachmentsType = {
  [key: string]: { files?: Attachment[]; label: string };
};

export const getToAddress = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  if (process.env.isDev === "true") {
    return [`"${name}" <mako.stateuser+dev-to@gmail.com>`];
  }

  return [`"${name}" <${email}>`];
};

export const EmailNav = (props: { appEndpointUrl: string }) => {
  return (
    <Section>
      <Row className="bg-primary ">
        <Column>
          <div className="h-[70px] text-white">
            <Link href={props.appEndpointUrl}>
              <Img
                className="h-10 w-28 min-w-[112px] resize-none"
                src={"https://mako-dev.cms.gov/assets/onemac_logo-BFuMCpJm.svg"}
                alt="OneMAC Logo"
              />
            </Link>
          </div>
        </Column>
      </Row>
    </Section>
  );
};

export const LoginInstructions = (props: { appEndpointURL: string }) => {
  return (
    <Section>
      <ul style={{ maxWidth: "760px" }}>
        <li>
          <Text>
            The submission can be accessed in the OneMAC application, which you
            can find at{" "}
            <Link href={props.appEndpointURL}>{props.appEndpointURL}</Link>.
          </Text>
        </li>
        <li>
          <Text>
            If you are not already logged in, please click the "Login" link at
            the top of the page and log in using your Enterprise User
            Administration (EUA) credentials.
          </Text>
        </li>
        <li>
          <Text>
            After you have logged in, you will be taken to the OneMAC
            application. The submission will be listed on the dashboard page,
            and you can view its details by clicking on its ID number.
          </Text>
        </li>
      </ul>
    </Section>
  );
};

export const Attachments = (props: { attachments: AttachmentsType }) => {
  //check if empty
  const areAllAttachmentsEmpty = (attachments: AttachmentsType): boolean => {
    return Object.values(attachments).every(
      ({ files }) => !files || files.length === 0,
    );
  };

  // return if empty
  if (areAllAttachmentsEmpty(props.attachments)) {
    return <Text>No attachments</Text>;
  }

  // used in loop
  const attachmentKeys = Object.keys(props.attachments);
  // creating a string list of all the attachment filenames in the array
  const createAttachementList = (files: Attachment[]) => {
    let fileString: string = "";
    let i = 0;
    for (i = 0; i <= files.length - 2; i++) {
      fileString += files[i].filename + ", ";
    }
    fileString += files[i].filename;
    return fileString;
  };

  return (
    <>
      <Hr className="my-[16px] border-t-2 border-primary" />
      <Heading as="h3">Files:</Heading>
      <Section>
        {attachmentKeys?.map(
          (key: keyof typeof props.attachments, idx: number) => {
            if (!props.attachments[key].files) return;
            const title = props.attachments[key].label;
            const filenames = createAttachementList(
              props.attachments[key].files,
            );
            return (
              <Row key={key + String(idx)}>
                <Column>
                  <Text>{title}</Text>
                </Column>
                <Column>
                  <Text>{filenames}</Text>
                </Column>
              </Row>
            );
          },
        )}
      </Section>
    </>
  );
};

export const PackageDetails = (props: {
  details: { [key: string]: string | null | undefined };
  attachments: AttachmentsType | null;
}) => {
  return (
    <Section>
      <br />
      {Object.keys(props.details).map((label: string, idx: number) => {
        if (label === "Summary") {
          const summary =
            props.details[label] ?? "No additional information submitted";
          return (
            <Row>
              <Hr className="my-[16px] border-t-2 border-primary" />
              <Text style={{ margin: ".5em" }}>
                <Heading as="h3">Summary:</Heading>
              </Text>
              <Text style={{ margin: ".5em" }}>{summary}</Text>
            </Row>
          );
        }
        return (
          <Row key={label + idx}>
            <Column>
              <Text style={{ margin: ".5em", fontWeight: "bold" }}>
                {label}:
              </Text>
            </Column>
            <Column>
              <Text style={{ margin: ".5em" }}>
                {props.details[label] ?? "Unknown"}
              </Text>
            </Column>
          </Row>
        );
      })}
      {props.attachments && <Attachments attachments={props.attachments} />}
      <Hr className="my-[16px] border-t-2 border-primary" />
    </Section>
  );
};

export const MailboxSPA = () => {
  return (
    <Text>
      This mailbox is for the submittal of State Plan Amendments and non-web
      based responses to Requests for Additional Information (RAI) on submitted
      SPAs only. Any other correspondence will be disregarded.
    </Text>
  );
};

export const MailboxWaiver = () => {
  return (
    <Text>
      This mailbox is for the submittal of Section 1915(b) and 1915(c) Waivers,
      responses to Requests for Additional Information (RAI) on Waivers, and
      extension requests on Waivers only. Any other correspondence will be
      disregarded.
    </Text>
  );
};

export const ContactStateLead = (props: { isChip?: boolean }) => {
  return (
    <Section>
      <Hr className="my-[16px] border-t-2 border-primary" />
      <Text>
        If you have questions or did not expect this email, please contact{" "}
        {props.isChip ? (
          <Link href="mailto:CHIPSPASubmissionMailBox@CMS.HHS.gov">
            CHIPSPASubmissionMailBox@CMS.HHS.gov
          </Link>
        ) : (
          <Link href="mailto:spa@cms.hhs.gov">spa@cms.hhs.gov</Link>
        )}{" "}
        or your state lead.
      </Text>
      <Text>Thank you!</Text>
    </Section>
  );
};

export const SpamWarning = () => {
  return (
    <Section>
      <Hr className="my-[16px] border-t-2 border-primary" />
      <Text>
        If the contents of this email seem suspicious, do not open them, and
        instead forward this email to{" "}
        <Link href="mailto:SPAM@cms.hhs.gov">SPAM@cms.hhs.gov</Link>.
      </Text>
      <Text>Thank you!</Text>
    </Section>
  );
};

export const WithdrawRAI = (props: {
  id: string;
  submitterName: string;
  submitterEmail: string;
}) => {
  return (
    <Section>
      <Heading as="h3">
        The OneMAC Submission Portal received a request to withdraw the Formal
        RAI Response. You are receiving this email notification as the Formal
        RAI for {props.id} was withdrawn by {props.submitterName}{" "}
        {props.submitterEmail}.
      </Heading>
    </Section>
  );
};

export const getCpocEmail = (item: any): string[] => {
  const cpocName = item._source.leadAnalystName;
  const cpocEmail = item._source.leadAnalystEmail;
  const email = [`${cpocName} <${cpocEmail}>`];
  return email ?? [];
};

export const getSrtEmails = (item: any): string[] => {
  const reviewTeam = item._source.reviewTeam;
  if (!reviewTeam) {
    return [];
  }
  return reviewTeam.map(
    (reviewer: any) => `${reviewer.name} <${reviewer.email}>`,
  );
};
