import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import axios from "axios";
import { toast } from "vue-sonner";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiUrl || "http://localhost:8080";

  const api = axios.create({
    baseURL: apiBase,
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorMessage =
        error.response?.data?.error ||
        error.error ||
        error.message ||
        "Une erreur est survenue";
      console.error("API Error:", errorMessage);
      toast.error("Erreur API", {
        description: errorMessage,
      });
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});
