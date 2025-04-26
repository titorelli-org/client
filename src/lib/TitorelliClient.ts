import axios, { type AxiosInstance } from "axios";
import { clientCredentials } from "axios-oauth-client";
import type {
  Prediction,
  UnlabeledExample,
  LabeledExample,
  AuthenticationResult,
} from "../../types";
import { DuplicateClient } from "./DuplicateClient";
import { CasClient } from "./CasClient";
import { TotemsClient } from "./Totems";
import { BotsClient } from "./BotsClient";

export type TitorelliClientConfig = {
  serviceUrl: string;
  casUrl: string;
  clientId: string;
  clientSecret: string;
  modelId: string;
  scope?: string | string[];
};

const globalScopes = [
  "cas/predict",
  "cas/train",
  "bots/create",
  "bots/list",
  "bots/update",
  "bots/read",
  "bots/remove",
];

export class TitorelliClient {
  private ready: Promise<void>;
  private axios: AxiosInstance;
  private serviceUrl: string;
  private casUrl: string;
  private clientId: string;
  private clientSecret: string;
  private modelId: string;
  private requestedScopes: string[] = [];
  private grantedScopes: string[] = [];

  public readonly duplicate: DuplicateClient;
  public readonly cas: CasClient;
  public readonly totems: TotemsClient;
  public readonly bots: BotsClient;

  constructor({
    serviceUrl,
    casUrl,
    clientId,
    clientSecret,
    scope,
    modelId,
  }: TitorelliClientConfig) {
    if (!serviceUrl) throw new Error("serviceUrl must be provided");
    if (!clientId) throw new Error("clientId must be provided");
    if (!clientSecret) throw new Error("clientSecret must be provided");
    if (!modelId) throw new Error("modelId must be provided");

    this.serviceUrl = serviceUrl;
    this.casUrl = casUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.modelId = modelId;
    this.requestedScopes = [].concat(scope).map((scope) => {
      if (globalScopes.includes(scope)) return scope;

      return `${this.modelId}/${scope}`;
    });

    this.duplicate = new DuplicateClient(
      () => this.axios,
      () => this.ready,
      () => this.modelId,
      this.hasGrantedModelScope,
    );
    this.cas = new CasClient(this.casUrl);
    this.totems = new TotemsClient(
      () => this.axios,
      () => this.ready,
      () => this.modelId,
      this.hasGrantedModelScope,
    );
    this.bots = new BotsClient(
      () => this.axios,
      () => this.ready,
      this.hasGrantedGlobalScope,
    );

    this.axios = axios.create({ baseURL: serviceUrl });

    this.ready = this.initialize();
  }

  async predict(reqData: UnlabeledExample & { tgUserId?: number }) {
    await this.ready;

    const { data } = await this.axios.post<Prediction>(
      `/models/${this.modelId}/predict`,
      reqData,
    );

    return data;
  }

  async train(example: LabeledExample) {
    await this.ready;

    const { data } = await this.axios.post<void>(
      `/models/${this.modelId}/train`,
      example,
    );

    return data;
  }

  hasGrantedModelScope = (scope: string) => {
    return this.grantedScopes.includes(`${this.modelId}/${scope}`);
  };

  hasGrantedGlobalScope = (scope: string) => {
    return this.grantedScopes.includes(scope);
  };

  private async initialize() {
    const authResult = await this.authenticate();

    this.grantedScopes = authResult.scope.split(" ");

    this.axios.interceptors.request.use((config) => {
      config.headers.Authorization = `${authResult.token_type} ${authResult.access_token}`;

      return config;
    });
  }

  private async authenticate() {
    const url = new URL("/oauth2/token", this.serviceUrl).toString();

    const getClientCredentials = clientCredentials(
      this.axios,
      url,
      this.clientId,
      this.clientSecret,
    );

    const finalScope = this.requestedScopes.join(" ");

    return getClientCredentials(finalScope) as Awaited<AuthenticationResult>;
  }
}
