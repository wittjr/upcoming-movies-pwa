// import React, { useState } from "react";
// import Layout from "@components/layout"
import Movie from "@components/movie"
// import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { DatabaseService } from '@lib/dbService.js'
// import { MovieService } from '@lib/movieService.js'
import { Logger } from '@lib/clientLogger.js'

export default function Home() {
    // const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
    }, [content])

    const fetchData = async () => {
        const results = await DatabaseService.getMovieUpcomingWatchlist()
        let upcoming_movies = []
        for (let i=0; i<results.length; i++) {
            let details = await DatabaseService.getMovie(results[i])
            if (details) {
                upcoming_movies.push(structuredClone(details))
            }
        }

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
            <h1>Upcoming List</h1>
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


        // <div className="container">
        //     <Head>
        //         <title>Next.js Starter!</title>
        //         <link rel="icon" href="/favicon.ico" />
        //     </Head>

        //     <main>
        //         <Header title="Welcome to my app!" />
        //         <p className="description">
        //             Get started by editing <code>pages/index.js</code>
        //         </p>
        //         <p>
        //             <a href="https://api.trakt.tv/oauth/authorize?response_type=code&client_id=7e22162f9eb4579e79453681c2a03590c1ebee89a79c422574c7f59bc6d462db&redirect_uri=https://bucolic-bombolone-57352b.netlify.app/api/authorize">Login to Trakt</a>
        //         </p>
        //         <div id="modal-root"></div>
        //         <div>
        //             <button onClick={() => setShowModal(true)}>Login</button>
        //         </div>
        //     </main>

        //     <Footer />
        // </div>
    )
}
