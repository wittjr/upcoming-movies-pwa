import { useState } from 'react'
import { DatabaseService } from '@lib/dbService.js';

export default function MovieButtons(props) {
    const [data, setData] = useState(props.data)

    const ignore = () => {
        let newData = { ...data }
        newData.ignore = true
        DatabaseService.put('movies', newData)
        setData(newData)
    }

    const watched = async () => {
        let newData = { ...data }
        newData.watchlist = 0
        const response = await fetch(`/api/watched/${newData.imdb_id}`, {
            method: 'POST'
        })
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const movie = await response.json();
        setData(newData)
    }

    const interested = async () => {
        let newData = { ...data }
        console.log(data)
        if (data.watchlist && data.watchlist == 1) {
            console.log('remove from watchlist')
            newData.watchlist = 0
            const response = await fetch(`/api/watchlist/${newData.imdb_id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error('API Issue')
            }
            // const movie = await response.json();
        } else {
            console.log('add to watchlist')
            newData.watchlist = 1
            const response = await fetch(`/api/watchlist/${newData.imdb_id}`, {
                method: 'POST'
            })
            if (!response.ok) {
                throw new Error('API Issue')
            }
            // const movie = await response.json();
        }
        console.log(data)
        DatabaseService.put('movies', newData)
        setData(newData)
    }

    if (data) {
        let watchLabel = 'Watchlist+'
        if (data.watchlist && data.watchlist == 1) {
            watchLabel = 'Watchlist-'
        }
        return (
            <>
                <button className="actionButton" onClick={ignore}>Ignore</button>
                <button className="actionButton" onClick={interested}>{watchLabel}</button>
                <button className="actionButton" onClick={watched}>Watched</button>
            </>
        )
    } else {
        return null;
    }
}