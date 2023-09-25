import { Logger } from '@lib/logger.js'

export async function getMovieDetails(movie_id) {
    var url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.TMDB_ID}&language=en-US&append_to_response=release_dates%2Cwatch%2Fproviders`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('API Issue')
    }
    var data = await response.json()
    data.basePath = 'https://image.tmdb.org/t/p/original'
    return data
}

async function handler(req, res) {
    const { movie_id } = req.query
    const data = await getMovieDetails(movie_id)
    // Logger.log(data)
    res.setHeader('Cache-Control', 's-maxage=86400')
    return res.send(
        data
    )
}

export default handler