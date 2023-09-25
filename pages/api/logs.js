import { Logger } from '@lib/logger.js';
import { getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { getToken } from 'next-auth/jwt';

async function handler(req, res) {
    // console.log("api/logs");

    const session = await getServerSession(req, res, authOptions)
    const token = await getToken({ req, encryption: true })
    // console.log(req.body)
    const message = req.body.message
    // console.log(message)
    if (session && token) {
        Logger.log(message)
        return res.status(200).json({message: 'OK'})
    }

    res.send({
        error: "You must be signed in to view the protected content on this page.",
    })
}

export default handler