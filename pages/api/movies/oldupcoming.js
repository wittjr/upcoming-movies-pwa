export default async function handler(req, res) {
    console.log("api/movies/upcoming");

    var page=1;
    var pages=1;
    var results = {}
    var today = new Date();
    today.setHours(0,0,0,0);
    while (page <= pages) {
        var response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&region=US&api_key=${process.env.TMDB_ID}`);
        if (!response.ok) {
            throw new Error('API Issue')
        }
        var data = await response.json();
        var filtered = data.results.filter((movie) => {
            return new Date(movie.release_date) >= today
        })
        filtered.map(async (movie) => {
            var details = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${process.env.TMDB_ID}`);
            if (!details.ok) {
                throw new Error('API Issue')
            }
            var dets = await details.json()
            var release_dates = []
            for (let i in dets.results) {
                if (dets.results[i].iso_3166_1 == 'US') {
                    for (let j in dets.results[i].release_dates) {
                        let date = dets.results[i].release_dates[j]
                        if ((date.type == 2 || date.type == 3) && (['G', 'PG', 'PG-13', 'R', 'NC-17'].includes(date.certification))) {
                            release_dates.push(structuredClone(date))
                        }
                    }
                    break
                }
            }
            if (release_dates.length > 0) {
                if (!(movie.release_date in results)) {
                    results[movie.release_date] = []
                }    
                movie.release_dates = structuredClone(release_dates)
                results[movie.release_date].push(structuredClone(movie))
            }
        })
        pages = data.total_pages
        page += 1
    }
    return res.send({
        content:
            results,
    })

}