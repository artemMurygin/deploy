import axios from 'axios'


const $api = axios.create(
    {
        baseURL: 'https://api.murygin.tech/api',
        withCredentials: true
    }
)

let accessToken = ''

export function setAccessToken(newAccessToken: string) {
    accessToken = newAccessToken
}

$api.interceptors.request.use((config) => {
    if (!config.headers.Authorization) {
        config.headers.Authorization = 'Bearer ' + accessToken
    }
    return config
})

$api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        console.log(error)
        const prevRequest = error.config

        if (error.response.status === 403 && !prevRequest.sent) {
            const response = await axios('http://localhost:3000/api/tokens/refresh', { withCredentials: true })
            const { accessToken } = response.data
            setAccessToken(accessToken)
            prevRequest.sent = true
            prevRequest.headers.Authorization = 'Bearer ' + accessToken
            return $api(prevRequest)
        }
        return Promise.reject(error)
    }
)

export default $api