import { axiosInstance } from "utils";

export const getListNotification = async (query) => {
  const response = await axiosInstance.get("/notifications", {
    params: query,
  });

  return {
    dataSource: response.data.notifications,
    pagination: {
      current: query.page || 1,
      pageSize: 20,
      total: response.data.totalRecord,
    },
  };
};
