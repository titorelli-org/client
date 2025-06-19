import { BotsClient } from "./BotsClient";
import { CasClient } from "./CasClient";
import { ModelClient } from "./ModelClient";

export function createClient(
  type: "model",
  ...args: ConstructorParameters<typeof ModelClient>
): Promise<ModelClient>;

export function createClient(
  type: "cas",
  ...args: ConstructorParameters<typeof CasClient>
): Promise<CasClient>;

export function createClient(
  type: "bots",
  ...args: ConstructorParameters<typeof BotsClient>
): Promise<BotsClient>;

export async function createClient(
  type: "model" | "cas" | "bots",
  ...args: [any, any]
) {
  switch (type) {
    case "model":
      return new ModelClient(...args);
    case "cas":
      return new CasClient(...args);
    case "bots":
      return new BotsClient(...args);
    default:
      throw new Error(`Unknown client type: ${type}`);
  }
}
