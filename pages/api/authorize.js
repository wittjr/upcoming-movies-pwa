import { Logger } from '@lib/logger.js';

async function handler(req, res) {
    Logger.log("api/authorize");
    // console.log(req)
    const query = req.query
    const {code} = query;
    Logger.log(code)

    const response = await fetch('https://api.trakt.tv/oauth/token', {
        method: 'post',
        json: {
            "code": code,
            "client_id": "7e22162f9eb4579e79453681c2a03590c1ebee89a79c422574c7f59bc6d462db",
            "client_secret": "b8053e71ffd43fe39bc7c71d81b93d32eb91cdd8cf963e8fd99be13579f56ee3",
            "redirect_uri": "https://bucolic-bombolone-57352b.netlify.app/api/authorize",
            "grant_type": "authorization_code"
        }
    });

    Logger.log(response)
    Logger.log(response.status)
    Logger.log(response.statusText)
    Logger.log(response.headers)
    Logger.log(response.body)
    const {body} = response.body
    Logger.log('Returning body')
    res.status(200).setHeader('Content-Type', 'application/json').json(body)
}

export default handler
