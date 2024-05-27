import { useSession } from "next-auth/react"
import Layout from "@components/layout"
import { useState, useEffect } from "react"
import AccessDenied from "@components/access-denied"
import { DatabaseService } from '@lib/dbService.js';
import { Logger } from '@lib/clientLogger.js'
import WatchProviderList from "@components/watchProviderList";

export default function MePage() {
    const { data, status } = useSession()
    const [content, setContent] = useState()
    // const [tvProviders, setTvProviders] = useState()
    const [movieProviders, setMovieProviders] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
    }, [content])

    const fetchData = async () => {
        const res = await fetch("/api/me")
        const json = await res.json()
        if (json.content) {
            setContent(json.content)
        }

        // const tvProviders = await fetch("/api/tv-providers")
        // const tvData = await tvProviders.json()
        // if (tvData.content) {
        //     setTvProviders(tvData.content)
        // }

        const movieProviders = await fetch("/api/movie-providers")
        const movieData = await movieProviders.json()
        if (movieData.content) {
            setMovieProviders(movieData.content)
        }
    }

    const clearMovies = async() => {
        const result = await DatabaseService.deleteAll('movies')
        Logger.log(result)
    }

    const clearDatabase = async() => {
        const result = await DatabaseService.reset()
        Logger.log(result)
        const DBDeleteRequest = window.indexedDB.deleteDatabase("upcoming")
        Logger.log(DBDeleteRequest)

        DBDeleteRequest.onerror = (event) => {
            Logger.error("Error deleting database.");
        };

        DBDeleteRequest.onsuccess = (event) => {
            Logger.log("Database deleted successfully");
            Logger.log(event.result); // should be undefined
        };
    }

    const PrettyPrintJson = ({ data }) => {
        return (
          <div style={{width: "75%", marginBottom: "50px", height: "80vh", overflowY: "scroll", border: "1px black solid"}}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )
    }

    const allProviders = []

    return (
        <>
            {/* <WatchProviderList key="tvProviders" type="TV" items={tvProviders}></WatchProviderList> */}
            <WatchProviderList key="movieProviders" type="Movie" items={movieProviders} showDisabled="true"></WatchProviderList>

            {/* <PrettyPrintJson data={content} /> */}
            {/* <PrettyPrintJson data={tvProviders} /> */}
            <div>
                <button onClick={clearMovies}>Clear Movie Data</button>&nbsp;&nbsp;
                <button onClick={clearDatabase}>Delete Database</button>
            </div>
        </>
    )
}

MePage.auth = true