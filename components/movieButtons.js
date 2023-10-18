import { useState } from 'react'
import { DatabaseService } from '@lib/dbService.js'
import './movieButtons.module.css'

export default function MovieButtons({stateChanger, data}) {

    const ignore = () => {
        let newData = { ...data }
        newData.ignore = true
        DatabaseService.put('movies', newData)
        stateChanger(newData)
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
        DatabaseService.put('movies', newData)
        stateChanger(newData)
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
        } else {
            console.log('add to watchlist')
            newData.watchlist = 1
            const response = await fetch(`/api/watchlist/${newData.imdb_id}`, {
                method: 'POST'
            })
            if (!response.ok) {
                throw new Error('API Issue')
            }
        }
        console.log(data)
        DatabaseService.put('movies', newData)
        stateChanger(newData)
    }

    if (data) {
        let classList = [
            "py-2",
            "px-2",
            "font-semibold",
            "rounded-lg",
            "shadow-md",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-opacity-75"
        ]
        let blueButton = [
            "bg-blue-500",
            "text-white",
            "hover:bg-blue-700",
            "zfocus:ring-blue-400",
        ].concat(classList).join(" ")
        let watchLabel = 'Watchlist+'
        let watchButtonColor = [
            "bg-blue-500",
            "text-white",
            "hover:bg-blue-700",
            "zfocus:ring-blue-400",
        ]
        if (data.watchlist && data.watchlist == 1) {
            watchLabel = 'Watchlist-'
            watchButtonColor = [
                "bg-red-500",
                "text-white",
                "hover:bg-red-700",
                "zfocus:ring-red-400",
            ]
        }
        return (
            <>
                <button className={blueButton} onClick={ignore}>Ignore</button>
                <button className={watchButtonColor.concat(classList).join(" ")} onClick={interested}>{watchLabel}</button>
                <button className={blueButton} onClick={watched}>Watched</button>
            </>
        )
    } else {
        return null;
    }
}