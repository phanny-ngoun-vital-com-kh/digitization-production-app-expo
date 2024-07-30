/**
 * These are configuration settings for the production environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
const PROTOCOL = 'http'

// QA
// export const IP = '10.0.12.247'
// const PORT = '85'

// Prodution
export const IP = 'ies.vital.com.kh'
const PORT = '80'
// export const IP = '10.0.8.215'
// const PORT = '80'

export default {
  API_URL: `${PROTOCOL}://${IP}:${PORT}`,
  KEYCLOAK_CLIENT_ID: 'mobile_app'
}
