import Layout from "../components/layout"
import Movie from "../components/movie"
import { useState, useEffect } from "react"

export default function MoviesPage() {
    // const { data } = useSession()
    const [content, setContent] = useState()
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        // console.log(content)
    }, [content])

    const fetchData = async () => {
        const res = await fetch("/api/movies/watchlist")
        const json = await res.json()
        if (json.content) {
            // console.log(json.content)
            setContent(json.content)
        }
    }

    return (
        <Layout>
            <h1>Movie Watchlist</h1>
            {/* <div className="movie-section">
                <>
                {content && content.map(movie => {
                    if (movie.movie.year == 2023) {
                        return <p key={movie.id}>{JSON.stringify(movie)}</p>
                    }
                })} 
                </>
            </div> */}
            <div className="movie-section">
                {
                    content && content.map(movie => {      
                        console.log(movie);
                        return (<Movie key={movie.id} data={movie}></Movie>)
                    })
                }
            </div>
        </Layout>
    )
}