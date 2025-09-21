import axios from "axios";
import type { AxiosInstance } from "axios";
import { clientsStore } from "./clientsStore";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";
import { logger } from "./logger";
import { Logger } from "pino";
import { requestLogger } from "./requestLogger";

export type BotsClientConfig = {
  baseUrl: string;
  auth: {
    clientName: string;
    initialAccessToken: string;
  };
  logger?: Logger;
};

export class BotsClient {
  private readonly axios: AxiosInstance;
  private readonly clientsStore = clientsStore;
  private readonly logger = logger;

  constructor({
    baseUrl,
    auth: { clientName, initialAccessToken },
    logger,
  }: BotsClientConfig) {
    this.axios = axios.create({ baseURL: baseUrl });

    if (logger) {
      requestLogger(this.axios, logger ?? this.logger);
    }

    oidcInterceptor(this.axios, {
      client: { client_name: clientName },
      clientRepository: this.clientsStore,
      initialAccessToken: initialAccessToken,
      logger: this.logger,
    });
  }

  async list(
    accountId: number,
    { accessToken }: { accessToken?: string } = {},
  ) {
    const { data } = await this.axios.get<unknown[]>("/bots", {
      params: { accountId, accessToken },
    });

    return data;
  }

  async create({
    id,
    accessToken,
    bypassTelemetry,
    accountId,
    modelId,
    tgBotToken,
    scopes,
  }: {
    id: number;
    accessToken: string;
    bypassTelemetry: boolean;
    accountId: number;
    modelId: number;
    tgBotToken: string;
    scopes: string;
  }) {
    const { data } = await this.axios.post<void>("/bots", {
      id,
      accessToken,
      bypassTelemetry,
      accountId,
      modelId,
      tgBotToken,
      scopes,
    });

    return data;
  }

  async update(
    id: number,
    {
      bypassTelemetry,
      modelId,
      tgBotToken,
      accessToken,
      state,
    }: {
      bypassTelemetry?: boolean;
      modelId?: number;
      tgBotToken?: string;
      accessToken?: string;
      state?: "starting" | "stopping";
    },
  ) {
    const { data } = await this.axios.post<void>(`/bots/${id}`, {
      bypassTelemetry,
      modelId,
      tgBotToken,
      accessToken,
      state,
    });

    return data;
  }

  async getState(id: number) {
    type BotStates =
      | "created"
      | "starting"
      | "running"
      | "stopping"
      | "stopped"
      | "failed";

    const { data } = await this.axios.get<BotStates>(`/bots/${id}/state`);

    return data;
  }

  async remove(id: number) {
    const { data } = await this.axios.delete<void>(`/bots/${id}`);

    return data;
  }
}
