import { useState } from 'react'
import styles from './movie.module.css'
import WatchProviderList from "./watchProviderList"
import MovieButtons from "./movieButtons"

export default function Movie(props) {
    const [data, setData] = useState(props.data)
    const page = props.page

    if (!data || data.ignore === true) return null

    const poster_path = data.poster_path
        ? 'https://image.tmdb.org/t/p/original/' + data.poster_path
        : 'https://placehold.co/220x330'

    const showIgnore = !['/lists', '/'].includes(page)
    const hasReleaseDates = data.release_dates.results.length > 0
    const watchProviders = data['watch/providers']?.results?.US

    return (
        <div className={styles.movie}>
            <img className={styles.poster} src={poster_path}></img>
            <div className={[styles.title, styles.row].join(' ')}>{data.title}</div>
            <div className={[styles.overview, styles.row].join(' ')}>{data.overview}</div>
            <div className={styles.row}>
                <span className={styles.label}>Genre(s):</span>
                <span>&nbsp;&nbsp;</span>
                <span>{data.genres.reduce((v, g) => v.length == 0 ? g.name : v + ', ' + g.name, '')}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Runtime:</span>
                <span>&nbsp;&nbsp;</span>
                <span>{data.runtime == 0 ? '-' : `${data.runtime} minutes`}</span>
            </div>
            <div className={styles.buttonRow}>
                <MovieButtons stateChanger={setData} data={data} showIgnore={showIgnore} />
            </div>
            {hasReleaseDates && (<>
                {data.limited_release_date && (
                    <div className={styles.releaseBox}>
                        <ul className={styles.list}>
                            <li>Type: Theatrical (Limited)</li>
                            <li>Date: {data.limited_release_date}</li>
                            <li>Rating: {data.limited_certification}</li>
                        </ul>
                    </div>
                )}
                {data.theatrical_release_date && (
                    <div className={styles.releaseBox}>
                        <ul className={styles.list}>
                            <li>Type: Theatrical</li>
                            <li>Date: {data.theatrical_release_date}</li>
                            <li>Rating: {data.theatrical_certification}</li>
                        </ul>
                    </div>
                )}
                {data.digital_release_date && (
                    <div className={styles.releaseBox}>
                        <ul className={styles.list}>
                            <li>Type: Digital</li>
                            <li>Date: {data.digital_release_date}</li>
                            <li>Rating: {data.digital_certification}</li>
                        </ul>
                    </div>
                )}
                {watchProviders && Object.keys(watchProviders).map(d => (
                    <WatchProviderList key={`${props.id}-${d}`} type={d} items={watchProviders[d]}></WatchProviderList>
                ))}
            </>)}
        </div>
    )
}