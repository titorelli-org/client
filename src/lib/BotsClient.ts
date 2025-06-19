import axios from "axios";
import type { AxiosInstance } from "axios";
import { clientsStore } from "./clientsStore";
import { oidcInterceptor } from "@titorelli-org/axios-oidc-interceptor";
import { logger } from "./logger";

export class BotsClient {
  private axios: AxiosInstance;
  private clientsStore = clientsStore;
  private logger = logger;

  constructor(
    private readonly botsOrigin: string,
    private readonly clientName: string,
  ) {
    this.axios = axios.create({ baseURL: this.botsOrigin });

    oidcInterceptor(this.axios, {
      client: { client_name: this.clientName },
      clientRepository: this.clientsStore,
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
