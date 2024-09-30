
import { AppCredential, defineApiTokenAuth } from "@rollout/framework";

export type RolloutToolsCredential = AppCredential<{
  label: string;
  ipAddress: string;
  userAgent: string;
}>;

export const auth = defineApiTokenAuth<RolloutToolsCredential>()({
  userInputsSchema: [
    {
      key: "label",
      label: "Label",
      type: "textfield",
    },
  ],

  async getCredentialDataFromUserInputs({ userInputs, httpRequest }) {
    return {
      label: userInputs.label,
      ipAddress: httpRequest.ipAddress,
      userAgent: httpRequest.userAgent,
    };
  },

  async getCredentialOption({ credential }) {
    return {
      label: credential.data.label,
    };
  },

  async testConnection({ userInputs }) {
    return true;
  },
});
