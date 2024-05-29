import { Logger } from '@lib/logger.js'

export default async function handler(req, res) {
    Logger.log(`api/movie-providers`)

    const results = []
    const url = `https://api.themoviedb.org/3/watch/providers/movie?language=en-US&watch_region=US`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMBD_READ_TOKEN}`
        }
    }

    let response
    try {
        response = await fetch(url, options)
    } catch (error) {
        Logger.log(`Error in fetch for api/movie-providers: ${error}`)
    }
    if (!response.ok) {
        Logger.log(response?.status)
        Logger.log(response?.statusText)
        throw new Error('API Issue')
    }

    const data = await response.json()
    results.push(...data.results)
    res.setHeader('Cache-Control', 's-maxage=86400')    

    return res.send(results)

}