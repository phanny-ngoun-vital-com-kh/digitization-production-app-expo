/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type { ApiConfig, ApiFeedResponse } from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode"
import { IRequestService, RequestService } from "./request-util"
import { showPopup } from "app/utils-v2/popup-ui"
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

export type ApiInitConfigType = {
  token: () => string | undefined;
  clearToken: () => void;
  login: () => Promise<void>;
  waiting: (wait: boolean) => void,
  sessionTimeout: () => void
}
/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig
  initConf?: ApiInitConfigType
  requestService: IRequestService = RequestService(this)
  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })

    this.apisauce.axiosInstance.interceptors.request.use(config => {
      const token = this.initConf?.token()

      __DEV__ && console.log("URL", config.url);
      
      if (config.url && !config.url.includes("login")) {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          } as any
        }
      }
      return config
    })
    this.apisauce.addMonitor((response: any) => {

      const { status, url, config } = response;
      const urlCheck = url || config.url

      __DEV__ && console.log(status, urlCheck);

      if (status == 401 && !(urlCheck).includes("logout")) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Session expired',
          textBody: 'សូមចូលក្នុងប្រពន្ធ័ម្តងទៀត',
          button: 'close',
          onPressButton:()=> this.clearToken()
          // autoClose: 100
        })
      }
    })

  }

  clearToken() {
    this.initConf?.clearToken()
  }

  async login() {
    await this.initConf?.login()
  }
  
  timeOut() {
    this.initConf?.sessionTimeout()
  }

  setAppInitConfig(config: ApiInitConfigType) {
    this.initConf = config
  }
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
