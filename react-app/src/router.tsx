import * as C from "@/components";
import { TimeoutModal } from "@/components";
import * as F from "@/features";
import {
  postSubmissionLoader,
  PostSubmissionWrapper,
} from "@/features/forms/post-submission/post-submission-forms";
import { QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, Outlet } from "react-router";
export const queryClient = new QueryClient();
export const FAQ_TAB = "faq-tab";

const RoutesWithTimeout = () => (
  <>
    <TimeoutModal />
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <C.Layout />,
    children: [
      { path: "/", index: true, element: <F.Welcome /> },
      { path: "/faq", element: <F.Faq /> },
      { path: "/faq/:id", element: <F.Faq /> },
      { path: "/webforms", element: <F.WebformsList /> },
      { path: "/webform/:id/:version", element: <F.Webform /> },
      {
        element: <RoutesWithTimeout />,
        children: [
          {
            path: "/dashboard",
            element: <F.Dashboard />,
            loader: F.dashboardLoader(queryClient),
          },
          {
            path: "/details/:authority/:id",
            element: <F.Details />,
            loader: F.packageDetailsLoader,
          },
          {
            path: "/new-submission/spa/medicaid/create",
            element: <F.MedicaidForm />,
          },
          {
            path: "/new-submission/spa/chip/create",
            element: <F.ChipForm />,
          },
          {
            path: "/new-submission/waiver/b/capitated/amendment/create",
            element: <F.CapitatedWaivers.AmendmentForm />,
          },
          {
            path: "/new-submission/waiver/b/capitated/initial/create",
            element: <F.CapitatedWaivers.InitialForm />,
          },
          {
            path: "/new-submission/waiver/b/capitated/renewal/create",
            element: <F.CapitatedWaivers.Renewal />,
          },
          {
            path: "/new-submission/waiver/b/b4/renewal/create",
            element: <F.ContractingWaivers.RenewalForm />,
          },
          {
            path: "/new-submission/waiver/b/b4/initial/create",
            element: <F.ContractingWaivers.InitialForm />,
          },
          {
            path: "/new-submission/waiver/b/b4/amendment/create",
            element: <F.ContractingWaivers.AmendmentForm />,
          },
          {
            path: "/new-submission/waiver/app-k",
            element: <F.AppKAmendmentForm />,
          },
          {
            path: "/new-submission/waiver/temporary-extensions",
            element: <F.TemporaryExtensionForm />,
          },
          {
            path: "/new-submission",
            element: <F.NewSubmissionInitialOptions />,
          },
          {
            path: "/new-submission/spa",
            element: <F.SPASubmissionOptions />,
          },
          {
            path: "/new-submission/waiver",
            element: <F.WaiverSubmissionOptions />,
          },
          {
            path: "/new-submission/waiver/b",
            element: <F.BWaiverSubmissionOptions />,
          },
          {
            path: "/new-submission/waiver/b/b4",
            element: <F.B4WaiverSubmissionOptions />,
          },
          {
            path: "/new-submission/waiver/b/capitated",
            element: <F.BCapWaiverSubmissionOptions />,
          },
          {
            path: "/new-submission/spa/medicaid",
            element: <F.MedicaidSPASubmissionOptions />,
          },
          {
            path: "/new-submission/spa/chip",
            element: <F.ChipSPASubmissionOptions />,
          },
          {
            path: "/new-submission/spa/medicaid/landing/medicaid-eligibility",
            element: <F.MedicaidEligibilityLandingPage />,
          },

          { path: "/profile", element: <F.Profile /> },
          { path: "/guides/abp", element: <F.ABPGuide /> },
          {
            path: "/actions/:type/:authority/:id",
            element: <PostSubmissionWrapper />,
            loader: postSubmissionLoader,
          },
        ],
      },
    ],
    loader: F.loader(queryClient),
    HydrateFallback: () => null,
  },
]);
