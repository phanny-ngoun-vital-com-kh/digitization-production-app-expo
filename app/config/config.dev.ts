/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
// QA
// export const IP = '10.0.12.247'
// const PORT = '85'

// Prodution
// export const IP = 'ies.vital.com.kh'
// const PORT = '80'

// Local-t
// export const IP = '10.0.20.111'
// const PORT = '8080'

// Local
export const IP = '10.0.20.162'
const PORT = '8080'

const PROTOCOL = 'http'
export default {
  API_URL: `${PROTOCOL}://${IP}:${PORT}`,
  KEYCLOAK_CLIENT_ID: 'mobile_app'
}