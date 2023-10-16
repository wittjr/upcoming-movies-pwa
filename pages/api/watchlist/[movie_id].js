import { getToken } from 'next-auth/jwt';
import { getMovieDetails } from '/pages/api/movies/[movie_id]'
import { Logger } from '@lib/logger.js';

// const fetcher = (url) => fetch(url).then((res) => res.json());

export default async function handler(req, res) {
    const { movie_id } = req.query

    const token = await getToken({ req, encryption: true });
    let response

    Logger.log(`${req.method} /api/watchlist/${movie_id}`)

    if (req.method == 'POST') {
        response = await fetch(
            `https://api.trakt.tv/sync/watchlist/`,
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
                    ]
                })
            }
        )
    } else if (req.method == 'DELETE') {
        response = await fetch(
            `https://api.trakt.tv/sync/watchlist/remove`,
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
                    ]
                })
            }
        );
    }

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