import type { AxiosInstance } from "axios";
import type { CasPrediction } from "../../types";
import { clientsStore } from "./clientsStore";
import { logger } from "./logger";
import axios from "axios";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";
import { Logger } from "pino";
import { requestLogger } from "./requestLogger";

export class CasClient {
  private readonly axios: AxiosInstance;
  private readonly clientsStore = clientsStore;
  private readonly logger = logger;

  constructor(
    private readonly casOrigin: string,
    private readonly clientName: string,
    logger?: Logger,
  ) {
    this.axios = axios.create({ baseURL: this.casOrigin });

    if (logger) {
      requestLogger(this.axios, logger ?? this.logger);
    }

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
