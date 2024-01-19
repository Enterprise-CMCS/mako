import { FC, useMemo } from "react";
import { opensearch } from "shared-types";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  DetailsSection,
} from "@/components";
import { BLANK_VALUE } from "@/consts";

export const AC_WithdrawEnabled: FC<opensearch.changelog.Document> = (
  props
) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">Change made</p>
      <p>
        {props.submitterName} has enabled package action to submit formal RAI
        response
      </p>
    </div>
  );
};

export const AC_WithdrawDisabled: FC<opensearch.changelog.Document> = (
  props
) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">Change made</p>
      <p>
        {props.submitterName} has disabled package action to submit formal RAI
        response
      </p>
    </div>
  );
};

export const AC_Update: FC<opensearch.changelog.Document> = () => {
  return <p>Coming Soon</p>;
};

export const AdminChange: FC<opensearch.changelog.Document> = (props) => {
  const [label, Content] = useMemo(() => {
    switch (props.actionType) {
      case "disable-rai-withdraw":
        return ["Disable formal RAI response withdraw", AC_WithdrawDisabled];
      case "enable-rai-withdraw":
        return ["Enable formal RAI response withdraw", AC_WithdrawEnabled];
      case "update":
        return ["SPA ID update", AC_Update];
      default:
        return [BLANK_VALUE, AC_Update];
    }
  }, [props.actionType]);

  return (
    <AccordionItem key={props.id} value={props.id}>
      <AccordionTrigger className="bg-gray-100 px-3">
        <p className="flex flex-row gap-2 text-gray-600">
          <strong>{label as string}</strong>
          {" - "}
          {format(new Date(props.timestamp), "eee, MMM d, yyyy hh:mm:ss a")}
        </p>
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <Content {...props} />
      </AccordionContent>
    </AccordionItem>
  );
};

export const AdminChanges: FC<opensearch.main.Document> = (props) => {
  const data = props.changelog?.filter((CL) =>
    ["disable-rai-withdraw", "enable-rai-withdraw"].includes(
      CL._source.actionType
    )
  );

  if (!data?.length) return <></>;

  return (
    <DetailsSection
      id="admin-updates"
      title={`Administrative Package Changes (${data?.length})`}
      description="Administrative changes reflect updates to specific data fields. If you have additional questions, please contact the assigned CPOC."
    >
      <Accordion
        type="multiple"
        defaultValue={[data?.[0]._source.id as string]}
        className="flex flex-col mt-6 gap-2"
      >
        {data?.map((CL) => (
          <AdminChange {...CL._source} key={CL._source.id} />
        ))}
      </Accordion>
    </DetailsSection>
  );
};
