import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
const Accordion = AccordionPrimitive.Root;
type AccordionItemProps = {
  className?: string; // Add className to prop type definition
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = {
  className?: string; // Add className to prop type definition
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex px-3 py-3 no-underline  text-lg font-bold">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "usa-accordion_button flex flex-1 items-center justify-between py-4 font-medium hover:underline [&[data-state=open]>svg]:hidden  ",
        className
      )}
      {...props}
    >
      {children}
      <PlusIcon   size={20} className="h-5 w-5" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

type AccordionContentProps = {
  className?: string; // Add className to prop type definition
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "text-sm transition-all px-3",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
