import Movie from "@components/movie"
import { useState, useEffect } from "react"
import { DatabaseService } from '@lib/dbService.js'
import { MovieService } from '@lib/movieService.js'
const dayjs = require('dayjs-with-plugins')

export default function MoviesPage() {
    const [content, setContent] = useState()
    // const [releaseDates, setReleaseDates] = useState()
    const [month, setMonth] = useState(() => dayjs().month())
    const [initialMonth] = useState(() => dayjs().month())

    useEffect(() => {
        let ignore = false
        setContent(undefined)
        fetchData(month).then(result => {
            if (!ignore) {
              setContent(result)
            }
          });
          return () => {
            ignore = true
          }
    }, [month])

    const fetchData = async () => {
        MovieService.get(month)
        MovieService.get(month+1)

        let start = dayjs().hour(0).minute(0).second(0).millisecond(0)
        let end = dayjs().hour(23).minute(59).second(59).millisecond(999)
        if (initialMonth != month) {
            start = dayjs().month(month).date(1).hour(0).minute(0).second(0).millisecond(0)
            end = start.date(start.daysInMonth()).hour(23).minute(59).second(59).millisecond(999)
        } else {
            start = dayjs().day(2).subtract(7, 'day').day(2).hour(0).minute(0).second(0).millisecond(0)
            end = dayjs().date(dayjs().daysInMonth()).hour(23).minute(59).second(59).millisecond(999)
            MovieService.get_movie_watch_history_from_date(dayjs(start).date(1).format('YYYY-MM-DD'))
        }
        const query = await DatabaseService.getAllMovies(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
        const results = Array.from(new Set(query[0].concat(query[1])))
        const allDetails = await DatabaseService.getMovies(results)

        let movies = {}
        for (const details of allDetails) {
            if (!details) continue
            if ('limited_release_date' in details && (dayjs(details.limited_release_date).isBetween(start, end, null, '[]'))) {
                if (!(details.limited_release_date in movies)) {
                    movies[details.limited_release_date] = []
                }
                details.release_date = details.limited_release_date
                details.release_type = 'limited'
                movies[details.limited_release_date].push(structuredClone(details))
            }
            if ('theatrical_release_date' in details && (dayjs(details.theatrical_release_date).isBetween(start, end, null, '[]'))) {
                if (!(details.theatrical_release_date in movies)) {
                    movies[details.theatrical_release_date] = []
                }
                details.release_date = details.theatrical_release_date
                details.release_type = 'theatrical'
                movies[details.theatrical_release_date].push(structuredClone(details))
            }
        }
    
        let dates = Object.keys(movies).sort()
        let ordered = []

        for (let i=0; i<dates.length; i++) {
            movies[dates[i]].sort((a, b) => a.title.localeCompare(b.title))
            ordered.push(...movies[dates[i]])
        }
        return ordered
    }

    const prevMonth = async() => {
        setMonth(month-1)
        window.scrollTo(0, 0)
    }
    
    const nextMonth = async() => {
        setMonth(month+1)
        window.scrollTo(0, 0)
    }

    const isCurrentMonth = () => {
        if (initialMonth == month) {
            return true
        }
        return undefined
    }

    return (
        <>
            <span className="title">Upcoming Movies</span>
            <div>
                {!isCurrentMonth() && (<button onClick={prevMonth}>Previous Month</button>)}
                <button onClick={nextMonth}>Next Month</button>
            </div>
            {!content && (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0'}}>
                    <div style={{width: 48, height: 48, borderRadius: '50%', border: '4px solid #d1d5db', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite'}}></div>
                </div>
            )}
            <div className="movie-section">
                {
                    content && content.map(movie => {
                        return (
                            <Movie key={movie.id + '-' + movie.release_type + '-' +  movie.release_date} data={movie} page={window.location.pathname}></Movie>
                        )
                    })
                }
            </div>
            <div>
                {!isCurrentMonth() && (<button onClick={prevMonth}>Previous Month</button>)}
                <button onClick={nextMonth}>Next Month</button>
            </div>
        </>
    )
}