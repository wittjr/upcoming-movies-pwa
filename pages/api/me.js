import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { withAuth } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt';

async function handler(req, res) {
    console.log("api/me");

    const session = await getServerSession(req, res, authOptions)
    // const token = await getToken({ req });
    const token = await getToken({ req, encryption: true });
    console.log(token)
    console.log(session)

    if (session) {
        var date = new Date();
        const [month, day, year] = [
            date.getMonth(),
            date.getDate(),
            date.getFullYear(),
        ];
        var today = year + '-' + month + '-' + day
        console.log(today)
        // console.log(session)
        // console.log(JSON.stringify(authOptions) )
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
        if (!response.ok) {
            throw new Error('API Issue')
        }


        // console.log(response)
        // console.log(response.headers)
        // console.log(response.body)
        const { body } = response
        // console.log('Returning body')
        // console.log(JSON.parse(body))
        // res.status(200).setHeader('Content-Type', 'application/json').json(JSON.parse(body))

        return res.send({
            content:
                JSON.parse(body),
        })
    }

    res.send({
        error: "You must be signed in to view the protected content on this page.",
    })
}

export default handler
