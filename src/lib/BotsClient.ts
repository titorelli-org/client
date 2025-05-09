import { AxiosInstance } from "axios";

export class BotsClient {
  constructor(
    private getAxios: () => AxiosInstance,
    private getReady: () => Promise<void>,
    private hasGrantedGlobalScope: (scope: string) => boolean,
  ) {}

  async list(
    accountId: number,
    { accessToken }: { accessToken?: string } = {},
  ) {
    await this.getReady();

    const hasScope = this.hasGrantedGlobalScope("bots/list");

    if (!hasScope) {
      console.error(
        "Client cannot list bots because it no't have bots/list scope granted",
      );

      return null;
    }

    const { data } = await this.getAxios().get<unknown[]>("/bots", {
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
    await this.getReady();

    const hasScope = this.hasGrantedGlobalScope("bots/create");

    if (!hasScope) {
      console.error(
        "Client cannot create bot because it no't have bots/create scope granted",
      );

      return null;
    }

    const { data } = await this.getAxios().post<void>("/bots", {
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
      state,
    }: {
      bypassTelemetry?: boolean;
      modelId?: number;
      tgBotToken?: string;
      state?: "starting" | "stopping";
    },
  ) {
    await this.getReady();

    const hasScope = this.hasGrantedGlobalScope("bots/update");

    if (!hasScope) {
      console.error(
        "Client cannot update bot because it no't have bots/update scope granted",
      );

      return null;
    }

    const { data } = await this.getAxios().post<void>(`/bots/${id}`, {
      bypassTelemetry,
      modelId,
      tgBotToken,
      state,
    });

    return data;
  }

  async getState(id: number) {
    await this.getReady();

    const hasScope = this.hasGrantedGlobalScope("bots/read");

    if (!hasScope) {
      console.error(
        "Client cannot read bot's state because it no't have bots/read scope granted",
      );

      return null;
    }

    const { data } = await this.getAxios().get<
      "created" | "starting" | "running" | "stopping" | "stopped" | "failed"
    >(`/bots/${id}/state`);

    return data;
  }

  async remove(id: number) {
    await this.getReady();

    const hasScope = this.hasGrantedGlobalScope("bots/remove");

    if (!hasScope) {
      console.error(
        "Client cannot remove bot because it no't have bots/remove scope granted",
      );

      return null;
    }

    const { data } = await this.getAxios().delete<void>(`/bots/${id}`);

    return data;
  }
}
