import { AxiosInstance } from "axios";
import { Logger } from "pino";

export const requestLogger = (axios: AxiosInstance, logger: Logger) => {
  const respIId = axios.interceptors.response.use(
    (resp) => {
      logger.info(resp, "Axios response");

      return resp;
    },
    (error) => {
      logger.error(error, "Axios error");

      throw error;
    },
  );

  return {
    detach() {
      axios.interceptors.response.eject(respIId);
    },
  };
};
