const dayjs = require('dayjs')
const isLeapYear = require('dayjs/plugin/isLeapYear')
dayjs.extend(isLeapYear)

const days_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default async function handler(req, res) {
    console.log("api/movies/upcoming");
    var { weeks_before, weeks_after, month } = req.query

    // console.log(`${weeks_before} ${weeks_after}`)
    var page=1;
    var pages=1;
    // var today = new Date();
    var today = dayjs()
    // console.log(today.format('YYYY-MM-DD'))
    // var after = today.subtract(weeks_before || 1, 'week').day(1)
    // var before = today.add(weeks_after || 4, 'week').day(5)
    // var after = today.month(month || today.month()).date(1)
    if (today.month() != month) {
        // console.log('different month')
        var after = today.month(month || today.month()).date(1)
    } else {
        var after = today.month(month || today.month())
        // console.log(`current month ${after.day()}`)
        if (after.day() > 2) {
            after.day(2)
        } else if (after.day() < 2) {
            // console.log(after.subtract(2, 'day').day(4))
            after = after.subtract(2, 'day').day(2)
        }    
    }
    // console.log(after.day(2).format('YYYY-MM-DD'))
    // console.log(after.day(6).format('YYYY-MM-DD'))
    // console.log(after.day(4).format('YYYY-MM-DD'))
    // console.log(after.day(3).format('YYYY-MM-DD'))
    // console.log(after.day(1).format('YYYY-MM-DD'))
    // console.log(after.day(5).format('YYYY-MM-DD'))
    var last_day_of_month = days_in_months[after.month()]
    if (after.isLeapYear() && after.month() == 2) {
        last_day_of_month = 29
    }
    var before = after.date(last_day_of_month)
    // console.log(after.format('YYYY-MM-DD'))
    // console.log(before.format('YYYY-MM-DD'))
    // today.setHours(0,0,0,0);
    
    const movies = []
    while (page <= pages) {
        // var response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&region=US&api_key=${process.env.TMDB_ID}`);
        // var url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_ID}&language=en-US&region=US&sort_by=release_date.asc&certification_country=US&certification.gte=G&include_adult=false&include_video=false&primary_release_date.gte=${after.format('YYYY-MM-DD')}&primary_release_date.lte=${before.format('YYYY-MM-DD')}&with_release_type=2%7C3&with_original_language=en&page=${page}`
        // var url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_ID}&language=en-US&region=US&sort_by=release_date.asc&certification_country=US&include_adult=false&include_video=false&primary_release_date.gte=${after.format('YYYY-MM-DD')}&primary_release_date.lte=${before.format('YYYY-MM-DD')}&with_release_type=2%7C3&with_original_language=en&page=${page}`
        var url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_ID}&language=en-US&region=US&sort_by=release_date.asc&certification_country=US&include_adult=false&include_video=false&release_date.gte=${after.format('YYYY-MM-DD')}&release_date.lte=${before.format('YYYY-MM-DD')}&with_release_type=2%7C3&with_original_language=en&page=${page}`
        console.log(`Calling: ${url}`)
        var response = await fetch(url)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json();
        // var filtered = data.results.filter((movie) => {
        //     return new Date(movie.release_date) >= today
        // })
        // console.log(data)
        movies.push(...data.results);
        pages = data.total_pages
        page += 1
    }
    // console.log(movies.length)
    // page=1
    // pages=1
    // while (page <= pages) {
    //     var response = await fetch(
    //         `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_ID}&language=en-US&region=US&sort_by=release_date.asc&certification_country=US&certification.gte=1&include_adult=false&include_video=false&page=1&primary_release_date.gte=${before.format('YYYY-MM-DD')}&primary_release_date.lte=${after.format('YYYY-MM-DD')}&with_release_type=2%7C3&with_original_language=en`
    //     )
    //     if (!response.ok) {
    //         throw new Error('API Issue')
    //     }
    //     const data = await response.json();
    //     // var filtered = data.results.filter((movie) => {
    //     //     return new Date(movie.release_date) >= today
    //     // })
    //     // console.log(data)
    //     movies.push(...data.results);
    //     pages = data.total_pages
    //     page += 1
    // }
    // movies.map(async (movie) => {
    //     var details = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${process.env.TMDB_ID}`);
    //     if (!details.ok) {
    //         throw new Error('API Issue')
    //     }
    //     var dets = await details.json()
    //     // console.log(dets)
    //     var release_dates = []
    //     for (let i in dets.results) {
    //         if (dets.results[i].iso_3166_1 == 'US') {
    //             for (let j in dets.results[i].release_dates) {
    //                 let date = dets.results[i].release_dates[j]
    //                 if ((date.type == 2 || date.type == 3) && (['G', 'PG', 'PG-13', 'R', 'NC-17'].includes(date.certification))) {
    //                     release_dates.push(structuredClone(date))
    //                 }
    //             }
    //             break
    //         }
    //     }
    //     if (release_dates.length > 0) {
    //         if (!(movie.release_date in results)) {
    //             results[movie.release_date] = []
    //         }    
    //         movie.release_dates = structuredClone(release_dates)
    //         results[movie.release_date].push(structuredClone(movie))
    //     }
    // })
    res.setHeader('Cache-Control', 's-maxage=86400')
    return res.send({
        content:
            movies,
    })

}