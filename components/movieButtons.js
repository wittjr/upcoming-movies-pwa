import { useState } from 'react'
import { DatabaseService } from '@lib/dbService.js'
import './movieButtons.module.css'
import { Logger } from '@lib/clientLogger.js'

export default function MovieButtons({stateChanger, data, showIgnore}) {

    const ignore = () => {
        let newData = { ...data }
        newData.ignore = true
        DatabaseService.put('movies', newData)
        stateChanger(newData)
    }

    const watched = async () => {
        let newData = { ...data }
        newData.watchlist = 0
        newData.watched = 1
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
        // Logger.log(data)
        if (data.watchlist && data.watchlist == 1) {
            Logger.log('remove from watchlist')
            newData.watchlist = 0
            const response = await fetch(`/api/watchlist/${newData.imdb_id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error('API Issue')
            }
        } else {
            Logger.log('add to watchlist')
            newData.watchlist = 1
            const response = await fetch(`/api/watchlist/${newData.imdb_id}`, {
                method: 'POST'
            })
            if (!response.ok) {
                throw new Error('API Issue')
            }
        }
        // console.log(data)
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
        let blueButtonBase = [
            "bg-blue-500",
            "text-white",
            "hover:bg-blue-700",
            "zfocus:ring-blue-400",
        ]
        let blueButton = [...blueButtonBase].concat(classList).join(" ")
        let watchLabel = 'Watchlist+'
        let watchButtonColor = [...blueButtonBase]
        if (data.watchlist && data.watchlist == 1) {
            watchLabel = 'Watchlist-'
            watchButtonColor = [
                "bg-red-500",
                "text-white",
                "hover:bg-red-700",
                "zfocus:ring-red-400",
            ]
        }
        let watchedButtonColor = [...blueButtonBase]
        let watchedDisable = ''
        if (data.watched && data.watched == 1) {
            watchedDisable = 'disabled'
            watchedButtonColor = [
                "bg-red-500",
                "text-white",
                "hover:bg-red-700",
                "zfocus:ring-red-400",
                "cursor-not-allowed",
                "disabled:opacity-75",
                "disabled:bg-red-500"
            ]
        }
        return (
            <>
                {showIgnore &&
                    <button className={blueButton} onClick={ignore}>Ignore</button>
                }                
                <button className={watchButtonColor.concat(classList).join(" ")} onClick={interested}>{watchLabel}</button>
                <button disabled={watchedDisable} className={watchedButtonColor.concat(classList).join(" ")} onClick={watched}>Watched</button>
            </>
        )
    } else {
        return null;
    }
}