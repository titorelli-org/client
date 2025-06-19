import path from "node:path";
import { ClientRepositoryYaml } from "@titorelli-org/axios-oidc-interceptor";

export const clientsFilename = path.join(process.cwd(), "/data/self-clients.yml");
export const clientsStore = new ClientRepositoryYaml(clientsFilename);
