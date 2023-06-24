import Layout from "../components/layout"
import Movie from "../components/movie"
import { useState, useEffect } from "react"
const dayjs = require('dayjs')
import dynamic from "next/dynamic"
// const DB = dynamic(() => import('../lib/db.js'), {ssr: false})
import { Service } from '../lib/db.js';
import { MService } from '../lib/movies.js';


export default function MoviesPage() {
    // const { data } = useSession()
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()
    const [month, setMonth] = useState(() => {
        var today = dayjs()
        // console.log(`set month ${today.month()}`)
        return today.month()
    })
    const [initialMonth, setInitialMonth] = useState(() => {
        var today = dayjs()
        // console.log(`set initial month ${today.month()}`)
        return today.month()
    })

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // console.log(content)
    }, [content])

    const fetchData = async () => {
        MService.get(month)
        MService.get(month+1)

        let start = dayjs().day(2).subtract(7, 'day').day(2)
        console.log(`Init: ${initialMonth}/${month} Start: ${start.format('YYYY-MM-DD')}`)
        if (initialMonth != month) {
            start = dayjs().month(month).date(1)
            console.log(`Init: ${initialMonth}/${month} Start: ${start.format('YYYY-MM-DD')}`)
        }
        let end = start.date(31)
        // start = start.day(2)
        // console.log(start)
        // start = start.subtract(7, 'day')
        // start.subtract(7, 'day')
        // start.day(2)
        // console.log(end)
        console.log(`Init: ${initialMonth}/${month} Start: ${start.format('YYYY-MM-DD')} End: ${end.format('YYYY-MM-DD')}`)
        const query = await Service.getAllMovies(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
        let results = Array.from(new Set(query[0]))
        // console.log(results)
        // let details = await Service.getMovies(results)
        // console.log(details)
        setContent(results)
    }

    const prevMonth = async() => {
        month = month - 1
        setMonth(month)
        fetchData()
    }
    
    const nextMonth = async() => {
        month = month + 1
        setMonth(month)
        fetchData()
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
            {/* {
                content &&
                <h1>Titles: {content.length}</h1>

            } */}
            {
                // console.log(releaseDates)
            }
            <div className="movie-section">
                {
                    content && content.map(movie => {
                        // console.log(movie)
                        return (
                            <Movie key={movie} id={movie}></Movie>
                        )
                    })
                    // content && releaseDates.map(date => {
                    //     var x = content[date].map(movie => {
                    //         // console.log(movie)
                    //         if (movie.original_language == 'en') {
                    //             return (
                    //                 <Movie key={movie.id} data={movie}></Movie>
                    //             )
                    //         }
                    //     })
                    //     return x
                    // })
                }
            </div>
            {!isCurrentMonth() && (<button onClick={prevMonth}>Previous Month</button>)}
            <button onClick={nextMonth}>Next Month</button>
        </>
    )
}