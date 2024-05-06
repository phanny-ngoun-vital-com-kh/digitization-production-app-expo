import { api } from "./api"
import { IRequestService, RequestService } from "./request-util"

export class BaseApi {
    protected requestService: IRequestService
    constructor() {
        this.requestService = RequestService(api)
    }
    // protected getRequest(): IRequestService {
    //     if (!this.requestService) {
    //         throw Error("Failed to get request.")
    //     }
    //     return this.requestService
    // }
}