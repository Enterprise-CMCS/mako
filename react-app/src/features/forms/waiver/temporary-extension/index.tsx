import {
  ActionForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RequiredIndicator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { Link, useParams } from "react-router-dom";
import { formSchemas } from "@/formSchemas";
import { FAQ_TAB } from "@/router";
import { useGetItem } from "@/api";
import { getFAQLinkForAttachments } from "../../faqLinks";

export const TemporaryExtensionForm = () => {
  const { id: waiverId } = useParams<{ id: string }>();
  const { data: submission } = useGetItem(waiverId, { enabled: waiverId !== undefined });

  return (
    <ActionForm
      schema={formSchemas["temporary-extension"]}
      title="Temporary Extension Request Details"
      breadcrumbText={`Request ${
        submission ? submission._source.authority : "1915(b) or 1915(c)"
      } Temporary Extension`}
      fields={(form) => (
        <>
          {submission ? (
            <div>
              <p>Approved Initial or Renewal Waiver Number</p>
              <p className="text-xl">{waiverId}</p>
            </div>
          ) : (
            <FormField
              name="ids.validAuthority.authority"
              control={form.control}
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>
                    <strong className="font-bold">Temporary Extension Type</strong>{" "}
                    <RequiredIndicator />
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="-- select a temporary extension type --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1915(b)">1915(b)</SelectItem>
                      <SelectItem value="1915(c)">1915(c)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {waiverId && submission ? (
            <div>
              <p>Temporary Extension Type</p>
              <p className="text-xl">{submission._source.authority}</p>
            </div>
          ) : (
            <FormField
              name="ids.validAuthority.waiverNumber"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem
                    className="max-w-md"
                    onChange={async () => {
                      await form.trigger("ids.validAuthority.authority");
                    }}
                  >
                    <FormLabel data-testid="waiverNumber-label">
                      <strong className="font-bold">
                        Approved Initial or Renewal Waiver Number
                      </strong>{" "}
                      <RequiredIndicator />
                    </FormLabel>
                    <FormDescription>
                      Enter the existing waiver number in the format it was approved, using a dash
                      after the two character state abbreviation.
                    </FormDescription>
                    <FormControl>
                      <Input
                        className="max-w-sm"
                        ref={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.currentTarget.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <FormField
            control={form.control}
            name="ids.id"
            render={({ field }) => (
              <FormItem
                onChange={async () => {
                  await form.trigger("ids.validAuthority.authority");
                }}
              >
                <FormLabel data-testid="requestNumber-label">
                  <strong className="font-bold">
                    Temporary Extension Request Number
                    <RequiredIndicator />
                  </strong>
                  <Link
                    className="text-blue-600 cursor-pointer hover:underline px-4"
                    to={"/faq/waiver-extension-id-format"}
                    target={FAQ_TAB}
                    rel="noopener noreferrer"
                  >
                    What is my Temporary Extension Request Number?
                  </Link>
                </FormLabel>
                <FormDescription className="max-w-md">
                  Must use a waiver extension request number with the format SS-####.R##.TE## or
                  SS-#####.R##.TE##
                </FormDescription>
                <FormControl>
                  <Input
                    className="max-w-sm"
                    ref={field.ref}
                    value={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      attachments={{
        faqLink: getFAQLinkForAttachments("temporary-extension"),
      }}
      documentPollerArgs={{
        property: (data) => data.id,
        documentChecker: (check) => check.recordExists,
      }}
      bannerPostSubmission={{
        header: "Temporary extension request submitted",
        body: "Your submission has been received.",
        variant: "success",
      }}
    />
  );
};
