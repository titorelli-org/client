import type { AxiosInstance } from "axios";
import type { CasPrediction } from "../../types";
import { clientsStore } from "./clientsStore";
import { logger } from "./logger";
import axios from "axios";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";

export class CasClient {
  private axios: AxiosInstance;
  private clientsStore = clientsStore;
  private logger = logger;

  constructor(
    private readonly casOrigin: string,
    private readonly clientName: string,
  ) {
    this.axios = axios.create({ baseURL: this.casOrigin });

    oidcInterceptor(this.axios, {
      client: { client_name: this.clientName },
      clientRepository: this.clientsStore,
      logger: this.logger,
    });
  }

  async isBanned(tgUserId: number) {
    const { data } = await this.axios.get<CasPrediction>("/isBanned", {
      params: {
        tgUserId,
      },
    });

    return data;
  }

  async ban(tgUserId: number) {
    const { data } = await this.axios.post<void>("/train", {
      tgUserId,
      banned: true,
    });

    return data;
  }

  async protect(tgUserId: number) {
    const { data } = await this.axios.post<void>("/train", {
      tgUserId,
      banned: false,
    });

    return data;
  }
}
