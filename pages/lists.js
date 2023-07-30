import { useSession } from "next-auth/react"
import Movie from "../components/movie"
import { useState, useEffect } from "react"
import { Service } from '../lib/db.js';
import { MService } from '../lib/movies.js';

export default function ListsPage() {
    // const { data } = useSession()
    const [content, setContent] = useState()
    const [releaseDates, setReleaseDates] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // console.log(content)
    }, [content])

    const fetchData = async () => {
        // const query = await Service.getAllMovies()
        // console.log(query)
        // let results = Array.from(new Set(query[0].concat(query[1])))
        const response = await fetch(`/api/lists`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const data = await response.json();
        console.log(data)
        console.log(data.length)
        const movies = []
        for (let i=0; i<data.length; i++) {
            console.log(data[i])
            const response = await fetch(`/api/movies/${data[i].movie.ids.tmdb}`)
            if (!response.ok) {
                throw new Error('API Issue')
            }
            const movie = await response.json();
            console.log(movie)
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
                        // console.log(movie)
                        return (
                            <Movie key={movie.id + '-' +  movie.release_date} id={movie.id + '-' +  movie.release_date} data={movie}></Movie>
                        )
                    })
                }
            </div>
        </>
    )
}