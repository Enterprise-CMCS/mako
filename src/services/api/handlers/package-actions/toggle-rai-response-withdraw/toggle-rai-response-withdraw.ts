import {
  ToggleWithdrawRaiEnabled,
  toggleWithdrawRaiEnabledSchema,
  Action,
} from "shared-types";
import { response } from "../../../libs/handler";
import { TOPIC_NAME } from "../consts";

export async function toggleRaiResponseWithdraw(
  body: ToggleWithdrawRaiEnabled,
  toggle: boolean,
  packageActionWriteService = globalThis.packageActionWriteService,
) {
  const result = toggleWithdrawRaiEnabledSchema.safeParse({
    ...body,
    raiWithdrawEnabled: toggle,
  });
  if (result.success === false) {
    console.error(
      "Toggle Rai Response Withdraw Enable event validation error. The following record failed to parse: ",
      JSON.stringify(body),
      "Because of the following Reason(s):",
      result.error.message,
    );
    return response({
      statusCode: 400,
      body: {
        message: "Toggle Rai Response Withdraw Enable event validation error",
      },
    });
  }
  try {
    await packageActionWriteService.toggleRaiResponseWithdraw({
      ...result.data,
      action: toggle ? Action.ENABLE_RAI_WITHDRAW : Action.DISABLE_RAI_WITHDRAW,
      id: result.data.id,
      topicName: TOPIC_NAME,
    });

    return response({
      statusCode: 200,
      body: {
        message: "record successfully submitted",
      },
    });
  } catch (err) {
    console.log(err);

    return response({
      statusCode: 500,
    });
  }
}
