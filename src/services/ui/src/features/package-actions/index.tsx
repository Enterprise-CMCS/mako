import { Navigate, RouteObject } from "react-router-dom";
import {
  ToggleRaiResponseWithdraw,
  onValidSubmission as toggleRaiWithdrawSubmission,
} from "./ToggleRaiResponseWithdraw";
import {
  WithdrawPackage,
  onValidSubmission as withdrawPackageSubmission,
} from "./WithdrawPackage";
import {
  RespondToRai,
  onValidSubmission as respondToRaiSubmission,
} from "./RespondToRai";
import {
  TemporaryExtension,
  onValidSubmission as temporaryExtensionSubmission,
} from "./TemporaryExtension";
import { ActionWrapper } from "./ActionWrapper";

export const packageActionRoutes: RouteObject = {
  path: "/action/:authority/:id",
  element: <ActionWrapper />,
  children: [
    {
      path: "enable-rai-withdraw",
      element: <ToggleRaiResponseWithdraw isEnabled />,
      action: toggleRaiWithdrawSubmission,
    },
    {
      path: "disable-rai-withdraw",
      element: <ToggleRaiResponseWithdraw isEnabled={false} />,
      action: toggleRaiWithdrawSubmission,
    },
    {
      path: "withdraw-package",
      element: <WithdrawPackage />,
      action: withdrawPackageSubmission,
    },
    {
      path: "respond-to-rai",
      element: <RespondToRai />,
      action: respondToRaiSubmission,
    },
    {
      path: "temporary-extension",
      element: <TemporaryExtension />,
      action: temporaryExtensionSubmission,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ],
};

export * from "./ActionWrapper";
