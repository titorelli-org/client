import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Prediction, UnlabeledExample } from "../../types";
import { clientsStore } from "./clientsStore";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";
import { Logger } from "pino";
import { logger } from "./logger";
import { requestLogger } from "./requestLogger";

export class ModelClient {
  private readonly axios: AxiosInstance;
  private readonly clientsStore = clientsStore;
  private readonly logger = logger;

  constructor(
    private readonly modelOrigin: string,
    private readonly clientName: string,
    logger?: Logger,
  ) {
    this.axios = axios.create({ baseURL: this.modelOrigin });

    if (logger) {
      requestLogger(this.axios, logger ?? this.logger);
    }

    oidcInterceptor(this.axios, {
      client: { client_name: this.clientName },
      clientRepository: this.clientsStore,
      logger: this.logger,
    });
  }

  public async predict(input: UnlabeledExample) {
    const { data } = await this.axios.post<Prediction>(`/predict`, input);

    return data;
  }
}
