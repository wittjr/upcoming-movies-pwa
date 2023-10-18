import { Logger } from '@lib/logger.js'

export async function getMovieDetails(movie_id) {
    var url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.TMDB_ID}&language=en-US&append_to_response=release_dates%2Cwatch%2Fproviders`
    const response = await fetch(url)
    if (!response.ok) {
        Logger.log(`ERROR:/api/movies/${movie_id}:getMovieDetails:API Issue:${response.status}:${response.statusText}:${response.url}`)
        // throw new Error(response.status)
        throw {
            status: response.status,
            statusText: response.statusText
        }
    }
    var data = await response.json()
    data.basePath = 'https://image.tmdb.org/t/p/original'
    return data
}

async function handler(req, res) {
    const { movie_id } = req.query
    try {
        const data = await getMovieDetails(movie_id)
        res.setHeader('Cache-Control', 's-maxage=86400')
        res.send(
            data
        )
    } catch (error) {
        console.log(`Caught error:${error}`)
        console.log(error)
        res.status(error.status).json(error)
    }
}

export default handler