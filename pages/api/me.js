import { getServerSession } from "next-auth/next"
import { authOptions } from "@pages/api/auth/[...nextauth]"
import { withAuth } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt';
import { Logger } from '@lib/logger.js';

async function handler(req, res) {
    Logger.log("api/me");

    const session = await getServerSession(req, res, authOptions)
    const token = await getToken({ req, encryption: true });

    if (session) {
        var date = new Date();
        const [month, day, year] = [
            date.getMonth(),
            date.getDate(),
            date.getFullYear(),
        ];
        var today = year + '-' + month + '-' + day
        const response = await fetch('https://api.trakt.tv/users/settings', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.accessToken,
                'trakt-api-version': '2',
                'trakt-api-key': process.env.TRAKT_ID
            }
        
        })
        const json = await response.json()

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
