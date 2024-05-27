import { useSession } from "next-auth/react"
import Movie from "@components/movie"
import { useState, useEffect } from "react"
import { DatabaseService } from '@lib/dbService.js'
import { MovieService } from '@lib/movieService.js'
import { Logger } from '@lib/clientLogger.js'

const dayjs = require('dayjs-with-plugins')
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

export default function ListsPage() {
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()
    const [expandedPast, setExpandedPast] = useState(false)
    const [expandedPresent, setExpandedPresent] = useState(true)
    const [expandedFuture, setExpandedFuture] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
    }, [content])

    const fetchData = async () => {
        MovieService.get_movie_watch_list()
        const results = await DatabaseService.getMovieWatchlist()

        let released_movies = []
        let upcoming_movies = []
        let future_movies = []
        for (let i=0; i<results.length; i++) {
            let details = await DatabaseService.getMovie(results[i])
            if (details) {
                // Logger.log(`Title: ${details.title} ${details.release_status}`)
                if (details.release_status == -1) {
                    released_movies.push(structuredClone(details))
                } else if (details.release_status == 0) {
                    upcoming_movies.push(structuredClone(details))
                } else {
                    future_movies.push(structuredClone(details))
                }
                // if (details.theatrical_release_date && dayjs().isSameOrBefore(dayjs(details.theatrical_release_date))) {
                //     if (dayjs().diff(details.theatrical_release_date, 'day') < -180) {
                //         future_movies.push(structuredClone(details))
                //     } else {
                //         upcoming_movies.push(structuredClone(details))                            
                //     }
                // } else {
                //     released_movies.push(structuredClone(details))
                // }
            }
        }

        const title_sort = (a, b) => { 
            let com = 1
            if (a.title < b.title) {
                com = -1
            }
            return com
        }
        const release_date_sort = (a, b) => { 
            let com = 1
            // Logger.log(`${a.title} : ${b.title}`)
            // Logger.log(`${dayjs(a.release_date)} : ${dayjs(b.release_date)}`)
            if (a.release_date =="") {a.release_date = '2050-12-31'}
            if (b.release_date =="") {b.release_date = '2050-12-31'}
            // Logger.log(`${dayjs(a.release_date).isSameOrBefore(dayjs(b.release_date))}`)
            if (dayjs(a.release_date).isSameOrBefore(dayjs(b.release_date))) {
                com = -1
            }
            return com
        }

        released_movies.sort(title_sort)
        upcoming_movies.sort(release_date_sort)
        future_movies.sort(release_date_sort)
        // console.log(future_movies)

        setContent({
            'released': released_movies,
            'upcoming': upcoming_movies,
            'future': future_movies
        })
    }

    return (
        <>
            <span class="title" onClick={() => setExpandedPast(!expandedPast)}>Watch List</span>
            {expandedPast &&
                <div className="movie-section">
                    {
                        content && content['released'] && content['released'].map(movie => {
                            return (
                                <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie} page={window.location.pathname}></Movie>
                            )
                        })
                    }
                </div>
            }
            <span class="title" onClick={() => setExpandedPresent(!expandedPresent)}>Upcoming List</span>
            {expandedPresent &&
                <div className="movie-section">
                    {
                        content && content['upcoming'] && content['upcoming'].map(movie => {
                            return (
                                <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie} page={window.location.pathname}></Movie>
                            )
                        })
                    }
                </div>
            }
            <span class="title" onClick={() => setExpandedFuture(!expandedFuture)}>Future List</span>
            {expandedFuture &&
                <div className="movie-section">
                    {
                        content && content['future'] && content['future'].map(movie => {
                            return (
                                <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie} page={window.location.pathname}></Movie>
                            )
                        })
                    }
                </div>
            }
        </>
    )
}