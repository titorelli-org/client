import axios, { type AxiosInstance } from "axios";
import { CasPrediction } from "../../types";

export class CasClient {
  private axios: AxiosInstance;

  constructor(baseURL: string) {
    this.axios = axios.create({ baseURL });
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
