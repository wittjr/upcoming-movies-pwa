import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { getToken } from 'next-auth/jwt';
import { Logger } from '@lib/logger.js';

export default async function handler(req, res) {
    Logger.log("api/lists");

    const session = await getServerSession(req, res, authOptions)
    // const token = await getToken({ req });
    const token = await getToken({ req, encryption: true });
    // Logger.log(token)
    // Logger.log(session)

    if (session) {
        // Logger.log(session)
        // Logger.log(JSON.stringify(authOptions) )
        // const response = await got.get('https://api.trakt.tv/users/settings', {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + token.accessToken,
        //         'trakt-api-version': '2',
        //         'trakt-api-key': process.env.TRAKT_ID
        //     }
        // });
        const response = await fetch(`https://api.trakt.tv/users/${token.username}/watchlist/movies/title`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.accessToken,
                'trakt-api-version': '2',
                'trakt-api-key': process.env.TRAKT_ID
            }
        })
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json();
        // var filtered = data.results.filter((movie) => {
        //     return new Date(movie.release_date) >= today
        // })
        // Logger.log(data)
        // movies.push(...data.results);
    
        // Logger.log(response)
        // Logger.log(response.headers)
        // Logger.log(response.body)
        // const { body } = response
        // Logger.log('Returning body')
        // Logger.log(JSON.parse(body))
        // res.status(200).setHeader('Content-Type', 'application/json').json(JSON.parse(body))

        return res.send([
            ...data,
        ])
    }

    res.send({
        error: "You must be signed in to view the protected content on this page.",
    })
}