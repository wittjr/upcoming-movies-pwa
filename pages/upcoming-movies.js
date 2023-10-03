import Layout from "@components/layout"
import Movie from "@components/movie"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { DatabaseService } from '@lib/dbService.js'
import { Logger } from '@lib/clientLogger.js'
import { MovieService } from '@lib/movieService.js'
const dayjs = require('dayjs-with-plugins')

export default function MoviesPage() {
    // const { data } = useSession()
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()
    const [month, setMonth] = useState(() => {
        var today = dayjs()
        // Logger.log(`set month ${today.month()}`)
        return today.month()
    })
    const [initialMonth, setInitialMonth] = useState(() => {
        var today = dayjs()
        // Logger.log(`set initial month ${today.month()}`)
        return today.month()
    })

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // Logger.log(content)
    }, [content])

    const daysInMonth = (month, year) => {
        const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (year%4 == 0) {
            days[1] = 29
        }
        return days[month]
    }

    const fetchData = async () => {
        MovieService.get(month)
        MovieService.get(month+1)

        let start = dayjs().hour(0).minute(0).second(0).millisecond(0)
        let end = dayjs().hour(23).minute(59).second(59).millisecond(999)
        // Logger.log(`Init: ${initialMonth}/${month} Start: ${start.format('YYYY-MM-DD')}`)
        if (initialMonth != month) {
            start = dayjs().month(month).date(1).hour(0).minute(0).second(0).millisecond(0)
            end = start.date(daysInMonth(start.month(), start.year())).hour(23).minute(59).second(59).millisecond(999)
            // Logger.log(`Init: ${initialMonth}/${month} Start: ${start.format('YYYY-MM-DD')}`)
        } else {
            start = dayjs().day(2).subtract(7, 'day').day(2).hour(0).minute(0).second(0).millisecond(0)
            end = dayjs().date(daysInMonth(dayjs().month(), dayjs().year)).hour(23).minute(59).second(59).millisecond(999)
        }

        Logger.log(`Init: ${initialMonth}/${month} Start: ${start.format('YYYY-MM-DD')} End: ${end.format('YYYY-MM-DD')}`)
        const query = await DatabaseService.getAllMovies(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
        // Logger.log(query)
        let results = Array.from(new Set(query[0].concat(query[1])))
        // Logger.log(results)

        let movies = {}
        for (let i=0; i<results.length; i++) {
            let details = await DatabaseService.getMovie(results[i])
            // Logger.log(details)
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
    
        // Logger.log(movies)
        // let details = await DatabaseService.getMovies(results)
        // Logger.log(details)

        let dates = Object.keys(movies).sort()
        // Logger.log(dates)

        let ordered = []

        for (let i=0; i<dates.length; i++) {
            let titles = movies[dates[i]].map((m) => m.title)
            movies[dates[i]].sort((a, b) => a.title.localeCompare(b.title))
            ordered.push(...movies[dates[i]])
            // Logger.log(ordered)
        }
        // Logger.log(ordered)


        setContent(ordered)
    }

    const prevMonth = async() => {
        month = month - 1
        setMonth(month)
        fetchData()
        window.scrollTo(0, 0)
    }
    
    const nextMonth = async() => {
        month = month + 1
        setMonth(month)
        fetchData()
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
            <h1>Upcoming Movies</h1>
            {!isCurrentMonth() && (<button onClick={prevMonth}>Previous Month</button>)}
            <button onClick={nextMonth}>Next Month</button>
            <div className="movie-section">
                {
                    content && content.map(movie => {
                        // Logger.log(movie)
                        return (
                            <Movie key={movie.id + '-' + movie.release_type + '-' +  movie.release_date} data={movie}></Movie>
                        )
                    })
                }
            </div>
            {!isCurrentMonth() && (<button onClick={prevMonth}>Previous Month</button>)}
            <button onClick={nextMonth}>Next Month</button>
        </>
    )
}