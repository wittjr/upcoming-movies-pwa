import Movie from "@components/movie"
import { useState, useEffect } from "react"
import { DatabaseService } from '@lib/dbService.js'
const dayjs = require('dayjs-with-plugins')

export default function Home() {
    const [content, setContent] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const upcoming_movies = await DatabaseService.getMovieUpcomingWatchlist()
        upcoming_movies.sort((a, b) =>
            dayjs(a.release_date).isSameOrBefore(dayjs(b.release_date)) ? -1 : 1
        )

        setContent({
            'upcoming': upcoming_movies,
        })
    }

    return (
        <>
            <span className="title">In Theater and Upcoming</span>
            {!content && (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0'}}>
                    <div style={{width: 48, height: 48, borderRadius: '50%', border: '4px solid #d1d5db', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite'}}></div>
                </div>
            )}
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
