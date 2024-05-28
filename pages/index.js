import Movie from "@components/movie"
import { useState, useEffect } from "react"
import { DatabaseService } from '@lib/dbService.js'
import { Logger } from '@lib/clientLogger.js'

export default function Home() {
    const [content, setContent] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
    }, [content])

    const fetchData = async () => {
        const upcoming_movies = await DatabaseService.getMovieUpcomingWatchlist()
        const dayjs = require('dayjs-with-plugins')
        var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
        dayjs.extend(isSameOrBefore)
        upcoming_movies.sort((a, b) => { 
            let com = 1
            if (dayjs(a.release_date).isSameOrBefore(dayjs(b.release_date))) {
                com = -1
            }
            return com
        })

        setContent({
            'upcoming': upcoming_movies,
        })
    }

    return (
        <>
            <span className="title">In Theater and Upcoming</span>
            <div className="movie-section">
                {
                    content && content['upcoming'] && content['upcoming'].map(movie => {
                        return (
                            <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie} page={window.location.pathname}></Movie>
                        )
                    })
                }
            </div>
        </>
    )
}
