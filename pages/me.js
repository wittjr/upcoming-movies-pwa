import { useSession } from "next-auth/react"
import Layout from "@components/layout"
import { useState, useEffect } from "react"
import AccessDenied from "@components/access-denied"
import { Service } from '@lib/db.js';
import { Logger } from '@lib/clientLogger.js'

export default function MePage() {
    const { data, status } = useSession()
    const [content, setContent] = useState()

    useEffect(() => {
        // Logger.log('DATA')
        // Logger.log(data)
        // Logger.log('STATUS')
        // Logger.log(status)
        fetchData()
    }, [])

    useEffect(() => {
        // Logger.log('CONTENT')
        // Logger.log(content)
    }, [content])

    const fetchData = async () => {
        const res = await fetch("/api/me")
        const json = await res.json()
        if (json.content) {
            setContent(json.content)
        }
    }

    const clearMovies = async() => {
        const result = await Service.deleteAll('movies')
        Logger.log(result)
    }

    const clearDatabase = async() => {
        const result = await Service.reset()
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


    return (
        <>
            {
                content &&
                    <p>{content.user.username}</p>
            }
            <iframe src="/api/me" />
            <button onClick={clearMovies}>Clear Movie Data</button>
            <button onClick={clearDatabase}>Delete Database</button>
        </>
    )
}

MePage.auth = true