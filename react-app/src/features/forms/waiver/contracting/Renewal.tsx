import {
  ActionForm,
  DatePicker,
  FAQ_TAB,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RequiredIndicator,
} from "@/components";
import { Link } from "react-router-dom";
import { contractingWaivers } from "shared-types";

export const RenewalForm = () => {
  return (
    <ActionForm
      schema={contractingWaivers.renewalFeSchema}
      title="1915(b)(4) FFS Selective Contracting Renewal Waiver"
      fields={({ control }) => (
        <>
          <div className="flex flex-col">
            <FormLabel className="font-semibold" htmlFor="1975b">
              Waiver Authority
            </FormLabel>
            <span className="text-lg font-thin" id="1975b">
              1915(b)
            </span>
          </div>
          <FormField
            control={control}
            name="waiverNumber"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-4">
                  <FormLabel
                    className="font-semibold"
                    data-testid="waiverid-existing-label"
                  >
                    Existing Waiver Number to Renew <RequiredIndicator />
                  </FormLabel>
                </div>
                <p className="text-gray-500 font-light">
                  Enter the existing waiver number in the format it was
                  approved, using a dash after the two character state
                  abbreviation.
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
          <FormField
            control={control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-4">
                  <FormLabel
                    className="font-semibold"
                    data-testid="waiverid-renewal-label"
                  >
                    1915(b) Waiver Renewal Number <RequiredIndicator />
                  </FormLabel>
                  <Link
                    to="/faq/waiver-renewal-id-format"
                    target={FAQ_TAB}
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline flex items-center"
                  >
                    What is my 1915(b) Waiver Renewal Number?
                  </Link>
                </div>
                <p className="text-gray-500 font-light">
                  The Waiver Number must be in the format of SS-####.R##.00 or
                  SS-#####.R##.00. For renewals, the {"'R##'"} starts with{" "}
                  {" 'R01'"} and ascends.
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
          <FormField
            control={control}
            name="proposedEffectiveDate"
            render={({ field }) => (
              <FormItem className="max-w-lg">
                <FormLabel
                  className="font-semibold block"
                  data-testid="proposedEffectiveDate-label"
                >
                  Proposed Effective Date of 1915(b) Waiver Renewal{" "}
                  <RequiredIndicator />
                </FormLabel>
                <FormControl className="max-w-sm">
                  <DatePicker
                    onChange={field.onChange}
                    date={field.value}
                    dataTestId="proposedEffectiveDate"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      attachments={{
        faqLink: "/faq/waiverb-attachments",
      }}
      defaultValues={{ id: "" }}
      documentPollerArgs={{
        property: "id",
        documentChecker: (checks) => checks.actionIs("Renew"),
      }}
    />
  );
};
