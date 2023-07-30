import { useState, useEffect } from 'react'
import styles from './movie.module.css'
import WatchProviderList from "./watchProviderList"
import { Service } from '../lib/db.js';

export default function MovieButtons(props) {
    const [data, setData] = useState(props.data)

    const ignore = () => {
        let newData = {...data}
        newData.ignore = true
        Service.put('movies', newData)
        props.stateChanger(newData)
    }
    
    const watched = async () => {
        let newData = {...data}
        newData.watched = true
        newData.interested = true
        const response = await fetch(`/api/watched/${newData.imdb_id}`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const movie = await response.json();
        props.stateChanger(newData)
    }
    
    const interested = async () => {
        let newData = {...data}
        // console.log(newData)
        newData.interested = true
        const response = await fetch(`/api/watchlist/${newData.imdb_id}`)
        if (!response.ok) {
            throw new Error('API Issue')
        }
        const movie = await response.json();
        props.stateChanger(newData)
    }
    
    if (data) {
        // console.log(data)
        return (
            <>
                <button className={styles.actionButton} onClick={ignore}>Nope</button>
                <button className={styles.actionButton} onClick={interested}>Interested</button>
                <button className={styles.actionButton} onClick={watched}>Watched</button>
            </>
        )
    } else {
        return null;
    }
}