import { BaseUrl } from "@/constants/urls";
import axios from "axios";

export let api = axios.create({
  baseURL: BaseUrl,
});

export const setBearerToken = (token: any) => {
  api = axios.create({
    baseURL: BaseUrl,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeBearerToken = () => {
  api = axios.create({
    baseURL: BaseUrl,
  });
};
