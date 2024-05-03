import { Logger } from '@lib/logger.js'

export default async function handler(req, res) {
    Logger.log(`api/tv-providers`)

    const results = []
    const url = `https://api.themoviedb.org/3/watch/providers/tv?language=en-US&watch_region=US`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMBD_READ_TOKEN}`
        }
    }

    var response = await fetch(url, options)
    if (!response.ok) {
        Logger.log(response)
        throw new Error('API Issue')
    }
    const data = await response.json()
    results.push(...data.results)

    res.setHeader('Cache-Control', 's-maxage=86400')
    return res.send({
        content:
            results,
    })

}