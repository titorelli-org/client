import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Prediction, UnlabeledExample } from "../../types";
import { clientsStore } from "./clientsStore";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";
import { Logger } from "pino";
import { logger } from "./logger";
import { requestLogger } from "./requestLogger";

export type ModelClientConfig = {
  baseUrl: string;
  auth: {
    clientName: string;
    initialAccessToken: string;
  };
  logger?: Logger;
};

export class ModelClient {
  private readonly axios: AxiosInstance;
  private readonly clientsStore = clientsStore;
  private readonly logger = logger;

  constructor({
    baseUrl,
    auth: { clientName, initialAccessToken },
    logger,
  }: ModelClientConfig) {
    this.axios = axios.create({ baseURL: baseUrl });

    if (logger) {
      requestLogger(this.axios, logger ?? this.logger);
    }

    oidcInterceptor(this.axios, {
      client: { client_name: clientName },
      clientRepository: this.clientsStore,
      initialAccessToken,
      logger: this.logger,
    });
  }

  public async predict(input: UnlabeledExample) {
    const { data } = await this.axios.post<Prediction>(`/predict`, input);

    return data;
  }
}
