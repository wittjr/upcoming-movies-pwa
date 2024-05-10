import { getServerSession } from "next-auth/next"
import { authOptions } from "@pages/api/auth/[...nextauth]"
import { withAuth } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt';
import { Logger } from '@lib/logger.js';

async function handler(req, res) {
    Logger.log("api/me");

    const session = await getServerSession(req, res, authOptions)
    // const token = await getToken({ req });
    const token = await getToken({ req, encryption: true });
    // Logger.log(token)
    // Logger.log(session)

    if (session) {
        var date = new Date();
        const [month, day, year] = [
            date.getMonth(),
            date.getDate(),
            date.getFullYear(),
        ];
        var today = year + '-' + month + '-' + day
        // Logger.log(today)
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
        const response = await fetch('https://api.trakt.tv/users/settings', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.accessToken,
                'trakt-api-version': '2',
                'trakt-api-key': process.env.TRAKT_ID
            }
        
        })
        const json = await response.json()

        // Logger.log(response)
        // Logger.log(response.headers)
        // Logger.log(response.body)
        // const { body } = response
        // Logger.log('Returning body')
        // Logger.log(JSON.parse(body))
        // res.status(200).setHeader('Content-Type', 'application/json').json(JSON.parse(body))

        return res.send({
            content:
                json,
        })
    }

    res.send({
        error: "You must be signed in to view the protected content on this page.",
    })
}

export default handler
