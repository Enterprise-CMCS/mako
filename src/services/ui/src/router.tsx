import { createBrowserRouter } from "react-router-dom";
import * as P from "@/pages";
import { loader as rootLoader } from "@/pages/welcome";
import { dashboardLoader } from "@/pages/dashboard";
import "@/api/amplifyConfig";
import * as C from "@/components";
import { QueryClient } from "@tanstack/react-query";
import {ROUTES} from "@/routes";
export const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <C.Layout />,
    children: [
      { path: ROUTES.HOME, index: true, element: <P.Welcome /> },
      {
        path: ROUTES.DASHBOARD,
        element: <P.Dashboard />,
        loader: dashboardLoader(queryClient),
      },
      { path: ROUTES.DETAILS, element: <P.Details /> },
      { path: ROUTES.FAQ, element: <P.Faq /> },
      { path: ROUTES.NEW_SUBMISSION_OPTIONS, element: <P.NewSubmissionInitialOptions /> },
      { path: ROUTES.SPA_SUBMISSION_OPTIONS, element: <P.SPASubmissionOptions /> },
      { path: ROUTES.CREATE, element: <P.Create /> },
      { path: "/form", element: <P.ExampleForm /> },
    ],
    loader: rootLoader(queryClient),
  },
]);
