import Layout from "../components/layout"
import Movie from "../components/movie"
import { useState, useEffect } from "react"
const dayjs = require('dayjs')

export default function MoviesPage() {
    // const { data } = useSession()
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()
    const [month, setMonth] = useState(() => {
        var today = dayjs()
        return today.month()
    })

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // console.log(content)
    }, [content])

    const fetchData = async () => {
        var url = `/api/movies/upcoming`
        if (month) {
            url += `?month=${month}`
        }
        console.log(url)
        const res = await fetch(url)
        const json = await res.json()
        if (json.content) {
            setContent(json.content)
            var dates = Object.keys(json.content)
            // console.log(dates)
            dates.sort()
            // console.log(dates)
            setReleaseDates(dates)
        }
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
        var today = dayjs()
        if (today.month() == month) {
            return true
        }
        return undefined
    }

    return (
        <Layout>
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
                            <Movie key={movie.id} id={movie.id}></Movie>
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
        </Layout>
    )
}