import { Waiver1915bStateEmail } from "../../content/respondToRai/emailTemplates";
import { emailTemplateValue } from "../../mock-data/respond-to-rai";

const Waiver1915bStateEmailPreview = () => {
  return (
    <Waiver1915bStateEmail
      variables={{
        ...emailTemplateValue,
        id: "CO-1234.R21.00",
        territory: "CO",
        authority: "Waiver 1915(b)",
        attachments: {
          cmsForm179: {
            label: "CMS Form 179",
            files: [
              {
                filename: "waiver-rai-response.pdf",
                title: "Waiver RAI Response",
                bucket: "test-bucket",
                key: "waiver-rai-response.pdf",
                uploadDate: Date.now(),
              },
              {
                filename: "spa-pages.pdf",
                title: "SPA Pages",
                bucket: "test-bucket",
                key: "spa-pages.pdf",
                uploadDate: Date.now(),
              },
            ],
          },
          spaPages: {
            label: "SPA Pages",
            files: [],
          },
          other: {
            label: "Other",
            files: [],
          },
        },
      }}
    />
  );
};

export default Waiver1915bStateEmailPreview;
