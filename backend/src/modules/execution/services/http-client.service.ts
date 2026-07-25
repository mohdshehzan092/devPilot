import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";

@Injectable()
export class HttpClientService {
    async execute(config:AxiosRequestConfig) {
        return axios(config)
    }
}