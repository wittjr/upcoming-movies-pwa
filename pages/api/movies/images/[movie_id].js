async function handler(req, res) {
    const { movie_id } = req.query
    console.log("api/movies/images/" + movie_id);
    // console.log(req)
    // const query = req.query
    // const {code} = query;
    // console.log(code)


    const response = await fetch('https://api.themoviedb.org/3/movie/' + movie_id + '?api_key=260ba61dc56fa94e788e611240e87ff8&language=en-US');

    // console.log(response)
    // console.log(response.headers)
    // console.log(response.body)
    const {body} = response
    
    console.log('Returning body')
    console.log(JSON.parse(body))
    var data = JSON.parse(body)
    data.basePath = 'https://image.tmdb.org/t/p/original'
    // res.status(200).setHeader('Content-Type', 'application/json').json(JSON.parse(body))
    return res.send({
        content:
            data,
    })

}

export default handler
