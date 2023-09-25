import { Logger } from '@lib/logger.js';

async function handler(req, res) {
    const { movie_id } = req.query
    Logger.log("api/movies/images/" + movie_id);
    // Logger.log(req)
    // const query = req.query
    // const {code} = query;
    // Logger.log(code)


    const response = await fetch('https://api.themoviedb.org/3/movie/' + movie_id + '?api_key=260ba61dc56fa94e788e611240e87ff8&language=en-US');

    // Logger.log(response)
    // Logger.log(response.headers)
    // Logger.log(response.body)
    const {body} = response
    
    Logger.log('Returning body')
    Logger.log(JSON.parse(body))
    var data = JSON.parse(body)
    data.basePath = 'https://image.tmdb.org/t/p/original'
    // res.status(200).setHeader('Content-Type', 'application/json').json(JSON.parse(body))
    return res.send({
        content:
            data,
    })

}

export default handler
