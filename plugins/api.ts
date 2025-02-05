import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const apiBase = config.public.apiUrl || 'http://localhost:8080'

  // On crée une instance Axios
  const api = axios.create({
    baseURL: apiBase,
  })

  // // Exemple : Intercepteur pour ajouter le token à chaque requête
  // api.interceptors.request.use((request) => {
  //   // Ici, tu peux chercher le token dans un store Pinia, un cookie, un composable, etc.
  //   // On va faire un exemple fictif :
  //   const token = useCookie('token').value
  //   if (token) {
  //     request.headers.Authorization = `Bearer ${token}`
  //   }
  //   return request
  // })

  // // Optionnel : intercepteur de réponse (pour gérer les erreurs globalement)
  // api.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     // Par exemple, si le token est expiré, on redirige l'utilisateur vers /login
  //     if (error.response && error.response.status === 401) {
  //       // nuxtApp.$router.push('/login') ou tout autre handling
  //     }
  //     return Promise.reject(error)
  //   }
  // )

  // On retourne l’instance pour y accéder via `nuxtApp.$api`
  return {
    provide: {
      api,
    },
  }
})
