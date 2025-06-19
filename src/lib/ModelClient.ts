import type { AxiosInstance } from "axios";
import axios from "axios";
import type { Prediction, UnlabeledExample } from "../../types";
import { clientsStore } from "./clientsStore";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";
import { logger } from "./logger";

export class ModelClient {
  private axios: AxiosInstance;
  private clientsStore = clientsStore;
  private logger = logger;

  constructor(
    private readonly modelOrigin: string,
    private readonly clientName: string,
  ) {
    this.axios = axios.create({ baseURL: this.modelOrigin });

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
