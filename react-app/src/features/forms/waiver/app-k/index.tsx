import {
  ActionForm,
  DatePicker,
  Input,
  FormControl,
  FormField,
  // FormIntroText,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredIndicator,
  Textarea,
} from "@/components";
import { Authority } from "shared-types";
import { formSchemas } from "@/formSchemas";
import { WaiverIdField } from "./WaiverIdField";
import { StateField } from "./StateField";
import { Link } from "react-router-dom";
import { FAQ_TAB } from "@/router";

export const AppKAmendmentForm = () => (
  <ActionForm
    title="1915(c) Appendix K Amendment Request Details"
    breadcrumbText="Request a 1915(c) Appendix K Amendment"
    schema={formSchemas["app-k"]}
    fields={(form) => (
      <>
        <div>
          {/* <FormIntroText /> */}
          <p className="max-w-4xl mt-4 text-gray-700 font-light">
            <span className="font-bold">
              If your Appendix K submission is for more than one waiver number,
              please enter one of the applicable waiver numbers. You do not need
              to create multiple submissions.
            </span>
          </p>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-[280px]">
              <FormLabel className="font-bold" htmlFor="amendment-title">
                Amendment Title <RequiredIndicator />
              </FormLabel>
              <Textarea {...field} className="h-[80px]" id="amendment-title" />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col">
          <FormLabel className="font-bold" htmlFor="1975c">
            Waiver Authority
          </FormLabel>
          <span className="text-lg font-thin" id="1975c">
            1915(c)
          </span>
        </div>
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4">
                <FormLabel className="font-bold">
                  Waiver Amendment Number <RequiredIndicator />
                </FormLabel>
                <Link
                  to={"/faq/waiver-c-id"}
                  target={FAQ_TAB}
                  rel="noopener noreferrer"
                  className="text-blue-900 underline"
                >
                  What is my waivement amendment number?
                </Link>
              </div>
              <p className="text-gray-500 font-light" id="waiver-number-format">
                The Waiver Number must be in the the format SS-####.R##.## or
                SS-#####.R##.##. For amendments, the last two digits start with
                '01' and ascends.
              </p>
              <FormControl className="max-w-sm">
                <Input
                  ref={field.ref}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(e.currentTarget.value.toUpperCase())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <StateField value={field.value} onChange={field.onChange} />
          )}
        /> */}

        {/* <WaiverIdField
          control={form.control}
          name="waiverIds"
          state={form.watch("state")}
        /> */}

        <FormField
          control={form.control}
          name="proposedEffectiveDate"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <FormLabel
                className="font-bold block"
                data-testid="proposedEffectiveDate-label"
              >
                Proposed Effective Date of 1915(c) Appendix K Amendment{" "}
                <RequiredIndicator />
              </FormLabel>
              <FormControl>
                <DatePicker
                  dataTestId="proposedEffectiveDate"
                  onChange={field.onChange}
                  date={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )}
    defaultValues={{ id: "", title: "" }}
    documentPollerArgs={{
      property: "id",
      // fix?
      documentChecker: (checks) =>
        checks.authorityIs([Authority["1915c"]]) && checks.actionIs("Amend"),
    }}
    attachments={{
      faqLink: "/faq/appk-attachments",
    }}
  />
);
