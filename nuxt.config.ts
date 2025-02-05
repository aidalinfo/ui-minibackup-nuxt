// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt'],
  components: {
    dirs: [
      // On peut lister plusieurs répertoires
      {
        path: '~/components/ui', // où shadcn place ses composants
        extensions: ['vue', 'ts'],
      },
      {
        path: '~/components/internal', // ton dossier perso
        extensions: ['vue', 'ts'],
      },
    ],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8086'
    }
  },
  plugins: [
    '~/plugins/api'
  ]
})