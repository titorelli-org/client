import { BotsClient, BotsClientConfig } from "./BotsClient";
import { CasClient, CasClientConfig } from "./CasClient";
import { ModelClient, ModelClientConfig } from "./ModelClient";

export function createClient(
  type: "model",
  conf: ModelClientConfig,
): Promise<ModelClient>;

export function createClient(
  type: "cas",
  conf: CasClientConfig,
): Promise<CasClient>;

export function createClient(
  type: "bots",
  conf: BotsClientConfig,
): Promise<BotsClient>;

export async function createClient(
  type: "model" | "cas" | "bots",
  conf: ModelClientConfig | CasClientConfig | BotsClientConfig,
) {
  switch (type) {
    case "model":
      return new ModelClient(conf);
    case "cas":
      return new CasClient(conf);
    case "bots":
      return new BotsClient(conf);
    default:
      throw new Error(`Unknown client type: ${type}`);
  }
}
