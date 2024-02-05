import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { getToken } from 'next-auth/jwt';
import { Logger } from '@lib/logger.js';

export default async function handler(req, res) {
    Logger.log(req.query)
    const { start_at } = req.query

    const session = await getServerSession(req, res, authOptions)
    const token = await getToken({ req, encryption: true });

    let url = `https://api.trakt.tv/users/${token.username}/history/movies?limit=50`
    if (start_at) {
        Logger.log(`api/watched?start_at=${start_at}`)
        url += `&start_at=${start_at}`
    } else {
        Logger.log(`api/watched`)
    }
    Logger.log(url)

    if (session) {
        // const response = await fetch(`https://api.trakt.tv/users/${token.username}/history/movies?limit=50`, {
        const response = await fetch(url, {
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

        return res.send([
            ...data,
        ])
    }

    res.send({
        error: "You must be signed in to view the protected content on this page.",
    })
}