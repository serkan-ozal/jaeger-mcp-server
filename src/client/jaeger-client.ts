import axios, { AxiosResponse } from 'axios';

export class JaegerClient {
    private readonly url: string;
    private readonly authorizationHeader: string | undefined;

    constructor(url: string, authorizationHeader?: string) {
        this.url = url;
        this.authorizationHeader = authorizationHeader;
    }

    async get<R>(path: string, params?: any): Promise<R> {
        const response: AxiosResponse = await axios.get(this.url + path, {
            params,
            headers: {
                Authorization: this.authorizationHeader,
            },
        });
        if (response.status != 200) {
            throw new Error(
                `Request failed with status code ${response.status}`
            );
        }
        return response.data as R;
    }
}
