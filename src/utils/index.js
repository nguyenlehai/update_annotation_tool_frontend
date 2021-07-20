import { message } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import i18n from "./i18n";

export const loadExistUser = () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  return jwtDecode(refreshToken);
};

export const axiosInstance = (() => {
  const _instance = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
  });

  _instance.interceptors.request.use(async (configs) => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      !accessToken ||
      Number(jwtDecode(accessToken).exp) <= Math.floor(Date.now() / 1000) + 300
    ) {
      // Access token expired
      const refreshToken = localStorage.getItem("refreshToken");
      if (
        !refreshToken ||
        Number(jwtDecode(refreshToken).exp) <=
          Math.floor(Date.now() / 1000) + 300
      ) {
        // Session expired
        return configs;
      }
      try {
        const {
          data: { accessToken: newAccessToken },
        } = await axios({
          method: "POST",
          url:
            process.env.REACT_APP_API_ENDPOINT +
            process.env.REACT_APP_REFRESH_TOKEN_PATH,
          data: {
            refreshToken,
            grantType: "refresh_token"
          },
        });
        localStorage.setItem("accessToken", newAccessToken);
        configs.headers.authorization = "Bearer " + newAccessToken;
      } catch (error) {}
      return configs;
    }
    configs.headers.authorization = "Bearer " + accessToken;
    return configs;
  });

  _instance.interceptors.response.use(
    (response) => response,
    (error) => {
      switch (error?.response?.status) {
        case 401:
          message.warning(i18n.t("Messages.Unauthorized"));
          break;
        case 403:
          message.warning(i18n.t("Messages.Forbidden"));
          break;
        case 500:
          if (error.response.data?.message) {
            message.error(error.response.data?.message);
          } else {
            message.error(i18n.t("Messages.ServerError"));
          }
          break;

        default:
          message.error(i18n.t("Messages.NetworkError"));
          break;
      }
      return Promise.reject(error);
    }
  );

  return _instance;
})();
