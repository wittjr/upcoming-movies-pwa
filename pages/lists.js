import { useSession } from "next-auth/react"
import Movie from "@components/movie"
import { useState, useEffect } from "react"
import { DatabaseService } from '@lib/dbService.js';
import { MovieService } from '@lib/movieService.js';
import { Logger } from '@lib/clientLogger.js';

const dayjs = require('dayjs-with-plugins')
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

export default function ListsPage() {
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()

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
                if (details.theatrical_release_date && dayjs().isSameOrBefore(dayjs(details.theatrical_release_date))) {
                    if (dayjs().diff(details.theatrical_release_date, 'day') < -180) {
                        future_movies.push(structuredClone(details))
                    } else {
                        upcoming_movies.push(structuredClone(details))                            
                    }
                } else {
                    released_movies.push(structuredClone(details))
                }
            }
        }
        setContent({
            'released': released_movies,
            'upcoming': upcoming_movies,
            'future': future_movies
        })
    }

    return (
        <>
            <h1>Watch List</h1>
            <div className="movie-section">
                {
                    content && content['released'] && content['released'].map(movie => {
                        return (
                            <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie}></Movie>
                        )
                    })
                }
            </div>
            <h1>Upcoming List</h1>
            <div className="movie-section">
                {
                    content && content['upcoming'] && content['upcoming'].map(movie => {
                        return (
                            <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie}></Movie>
                        )
                    })
                }
            </div>
            <h1>Future List</h1>
            <div className="movie-section">
                {
                    content && content['future'] && content['future'].map(movie => {
                        return (
                            <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie}></Movie>
                        )
                    })
                }
            </div>
        </>
    )
}