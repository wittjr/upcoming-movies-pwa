import { getToken } from 'next-auth/jwt';
import { getMovieDetails } from '/pages/api/movies/[movie_id]'
import { Logger } from '@lib/logger.js';

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default async function handler(req, res) {
    const { movie_id } = req.query
    Logger.log(`api/watchlist/${movie_id}`);

    const token = await getToken({ req, encryption: true });
    var results = [];

    var response = await fetch(
        `https://api.trakt.tv/sync/history/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.accessToken,
                'trakt-api-version': 2,
                'trakt-api-key': process.env.TRAKT_ID
            },
            body: JSON.stringify({
                "movies": [
                  {
                    "ids": {
                      "imdb": movie_id
                    }
                  }
                ]})
        }
    );
    if (!response.ok) {
        throw new Error('API Issue')
    }
    var data = await response.json();
    Logger.log(data)

    // var promises = data.map(async (movie) => {
    //     var movie_details = await getMovieDetails(movie.movie.ids.tmdb)
    //     // Logger.log(movie_details)
    //     results.push(structuredClone(movie_details));
    //     // Logger.log(`Results length: ${results.length}`)
    // })
    
    // await Promise.all(promises)

    // Logger.log(`Results: ${JSON.stringify(results)}`);

    return res.send(data)

}