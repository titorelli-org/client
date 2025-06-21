import { DiscoveryResult } from "../../types";

const getDiscoveryUrl = (propsBaseUrl: string | URL) => {
  if (typeof propsBaseUrl === "string" && !propsBaseUrl.startsWith("http")) {
    return `https://${propsBaseUrl}/.well-known/appspecific/ru.titorelli.json`;
  }

  const baseUrl =
    typeof propsBaseUrl === "string" ? new URL(propsBaseUrl) : propsBaseUrl;

  if (baseUrl.pathname === "/") {
    return `${baseUrl.protocol}//${baseUrl.host}/.well-known/appspecific/ru.titorelli.json`;
  }

  return baseUrl.href;
};

export const serviceDiscovery = async (
  paramsDiscoveryUrl: string | URL,
): Promise<DiscoveryResult> => {
  const discoveryUrl = getDiscoveryUrl(paramsDiscoveryUrl);

  const resp = await fetch(discoveryUrl);

  return resp.json();
};
