import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import { useState, useEffect } from "react"
import AccessDenied from "../components/access-denied"
import { Service } from '../lib/db.js';

export default function MePage() {
    const { data } = useSession()
    const [content, setContent] = useState()

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        console.log(content)
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
        console.log(result)
    }

    const clearDatabase = async() => {
        const result = await Service.reset()
        console.log(result)
        const DBDeleteRequest = window.indexedDB.deleteDatabase("upcoming")
        console.log(DBDeleteRequest)

        DBDeleteRequest.onerror = (event) => {
            console.error("Error deleting database.");
        };

        DBDeleteRequest.onsuccess = (event) => {
            console.log("Database deleted successfully");
            console.log(event.result); // should be undefined
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