import { useSession } from "next-auth/react"
import Movie from "../components/movie"
import { useState, useEffect } from "react"
import { Service } from '../lib/db.js';
import { MService } from '../lib/movies.js';
import { Logger } from '@lib/clientLogger.js';

export default function ListsPage() {
    // const { data } = useSession()
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // Logger.log(content)
    }, [content])

    const fetchData = async () => {
        // const query = await Service.getAllMovies()
        // Logger.log(query)
        // let results = Array.from(new Set(query[0].concat(query[1])))
        const response = await fetch(`/api/lists`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json();
        // Logger.log(data)
        // Logger.log(data.length)
        const movies = []
        for (let i=0; i<data.length; i++) {
            // Logger.log(data[i])
            const response = await fetch(`/api/movies/${data[i].movie.ids.tmdb}`)
            if (!response.ok) {
                throw new Error('API Issue')
            }
            const movie = await response.json();
            // Logger.log(movie.title)
            movies.push(structuredClone(movie))
        }

        setContent(movies)
    }

    return (
        <>
            <h1>Watch List</h1>
            <div className="movie-section">
                {
                    content && content.map(movie => {
                        // Logger.log(`${movie.id}:${movie.title}`)
                        return (
                            <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie}></Movie>
                        )
                    })
                }
            </div>
        </>
    )
}