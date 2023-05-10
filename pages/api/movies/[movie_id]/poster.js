export default async function handler(req, res) {
    const { movie_id } = req.query
    console.log(`api/movies/${movie_id}/poster`);
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${process.env.TMDB_ID}&language=en-US`);
    if (!response.ok) {
        throw new Error('API Issue')
    }
    const data = await response.json()
    data.basePath = 'https://image.tmdb.org/t/p/original'
    return res.send({
        content:
            data,
    })

}