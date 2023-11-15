import { OsMainSourceItem } from "shared-types";
import { DetailsSection } from "../DetailsSection";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Attachmentslist,
} from "@/components";
import { BLANK_VALUE } from "@/consts";
import { getActiveRai } from "shared-utils";

export const RaiList = (data: OsMainSourceItem) => {
  if (!data.rais) return null;
  return (
    <DetailsSection id="rai-responses" title="Formal RAI Activity">
      {(() => {
        const sortedKeys = Object.keys(data.rais) // Sort the RAIs by timestamp
          .map(Number)
          .sort((a, b) => b - a);
        return (
          <div>
            {sortedKeys.map((key, i) => (
              <Accordion key={i} type="multiple" defaultValue={["item-0"]}>
                <AccordionItem value={`item-${i}`}>
                  <AccordionTrigger>{`RAI Requested on ${
                    data.rais[key].requestedDate
                      ? format(
                          new Date(data.rais[key].requestedDate),
                          "EEE, MMM d yyyy, h:mm:ss a"
                        )
                      : "Unknown"
                  }`}</AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-8">
                      <h3 className="text-xl font-semibold mb-2">
                        CMS Request Info
                      </h3>
                      {data.rais[key].requestedDate ? ( // if has data
                        <>
                          <h4 className="text-l font-semibold mb-2 ml-4">
                            Submitted Time:
                          </h4>
                          <p className="mb-4 text-sm ml-8">
                            {format(
                              new Date(data.rais[key].requestedDate),
                              "EEE, MMM d yyyy, h:mm:ss a"
                            )}
                          </p>
                          <p className="text-l font-semibold mb-2 ml-4 ">
                            Attachments
                          </p>
                          {data.rais[key].request?.attachments ? (
                            <div className="ml-4">
                              <Attachmentslist
                                id={data.id}
                                attachments={data.rais[key].request.attachments}
                              />
                            </div>
                          ) : (
                            <p className="ml-4">${BLANK_VALUE}</p>
                          )}
                          <h4 className="text-l font-semibold mb-2 ml-4">
                            Additional Information
                          </h4>
                          <p className="mb-4 text-sm ml-8">
                            {data.rais[key].request?.additionalInformation ??
                              BLANK_VALUE}
                          </p>
                        </>
                      ) : (
                        <p className="ml-4">No Request Recorded</p>
                      )}
                    </div>
                    {/* <div className="ml-8">
                      <h3 className="text-xl font-semibold mb-2">
                        State Response Info
                      </h3>
                      {data.rais[key].responseDate ? ( // if has data
                        <>
                          <h4 className="text-l font-semibold mb-2 ml-4">
                            Submitted Time:
                          </h4>
                          <p className="mb-4 text-sm ml-8">
                            {format(
                              new Date(data.rais[key].responseDate),
                              "EEE, MMM d yyyy, h:mm:ss a"
                            )}
                          </p>
                          <p className="text-l font-semibold mb-2 ml-4 ">
                            Attachments
                          </p>
                          {data.rais[key].response?.attachments ? (
                            <div className="ml-4">
                              <Attachmentslist
                                id={data.id}
                                attachments={
                                  data.rais[key].response.attachments
                                }
                              />
                            </div>
                          ) : (
                            <p className="ml-4">${BLANK_VALUE}</p>
                          )}
                          <h4 className="text-l font-semibold mb-2 ml-4">
                            Additional Information
                          </h4>
                          <p className="mb-4 text-sm ml-8">
                            {data.rais[key].response?.additionalInformation ??
                              BLANK_VALUE}
                          </p>
                        </>
                      ) : (
                        <p className="ml-4">No Response Recorded</p>
                      )}
                    </div> */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        );
      })()}
    </DetailsSection>
  );
};
