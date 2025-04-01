import axios from "axios"

export enum HttpMethod {
    POST = 'post',
    GET = 'get',
    PUT = 'put',
    PATCH = 'patch',
    DELETE = 'delete'
}
export const httpRequest = async (
    method: HttpMethod, 
    url: string, 
    data?: Record<string, any> | FormData | null, 
    params?:  Record<string, any> | null,
    headers: Record<string, any> = {'Content-Type': 'application/json' }
) => {
    const response = await axios({
        method,
        baseURL: 'http://localhost:3000',
        url,
        data,
        params,
        headers
    })
    return response.data
}