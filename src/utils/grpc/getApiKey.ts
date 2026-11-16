import { type Metadata, status } from "@grpc/grpc-js";

import { ENV } from "#utils/config";

export async function getApiKeyFromGrpc(metadata: Metadata): Promise<{
  success: boolean;
  error: string | null;
  code: status;
}> {
  const [apiKey] = metadata.get("api-key");
  if (apiKey !== ENV.API_KEY) {
    return {
      success: false,
      error: "No API key provided",
      code: status.UNAUTHENTICATED,
    };
  }

  return {
    success: true,
    error: null,
    code: status.OK,
  };
}
