import { useState, useEffect } from 'react'
import styles from './movie.module.css'
import WatchProviderList from "./watchProviderList"
import { Service } from '../lib/db.js';

const dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)

export default function Movie(props) {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            let newData = await Service.getMovie(props.id)
            setData(newData);
        };
        fetchData();

    }, [props.id]);

    useEffect(() => {
    }, [data]);

    const ignore = () => {
        let newData = {...data}
        newData.ignore = true
        Service.put('movies', newData)
        setData(newData)
    }

    var poster_path = 'https://placehold.co/220x330'

    const provider_types = ['flatrate', 'buy', 'rent']

    const release_types = ['', '', 'Theatrical (Limited)', 'Theatrical', 'Digital']

    if (data && data.ignore != true && data.runtime >= 60) {
        console.log(data)
        if (data.poster_path) {
            poster_path = 'https://image.tmdb.org/t/p/original/' + data.poster_path
        }
        if (data.release_dates.results.length > 0) {

            return (
                <div className={styles.movie}>
                    <img className={styles.poster} src={poster_path}></img>
                    <div className={styles.title}>{data.title}</div>
                    <button onClick={ignore}>Ignore</button>
                    {/* <div className={styles.date}>{release_type} {release_date}</div> */}
                    <div className={styles.overview}>{data.overview}</div>
                    {data.limited_release_date && (
                        <ul key={data.id + '-limited'} className={styles.list}>
                            <li>Type: Theatrical (Limited)</li>
                            <li>Date: {data.limited_release_date}</li>
                            <li>Rating: {data.limited_certification}</li>
                        </ul>
                    )}
                    {data.theatrical_release_date && (
                        <ul key={data.id + '-theatrical'} className={styles.list}>
                            <li>Type: Theatrical</li>
                            <li>Date: {data.theatrical_release_date}</li>
                            <li>Rating: {data.theatrical_certification}</li>
                        </ul>
                    )}
                    {data.digital_release_date && (
                        <ul key={data.id + '-digital'} className={styles.list}>
                            <li>Type: Digital</li>
                            <li>Date: {data.digital_release_date}</li>
                            <li>Rating: {data.digital_certification}</li>
                        </ul>
                    )}
                    {data['watch/providers'] && data['watch/providers'].results && data['watch/providers'].results.US && Object.keys(data['watch/providers'].results.US) && Object.keys(data['watch/providers'].results.US).map(d => (
                        // console.log(d)
                        <WatchProviderList key={`${props.id}-${d}`} type={d} items={data['watch/providers'].results.US[d]}></WatchProviderList>
                        // d != 'link' && data['watch/providers'].results.US[d].map(watch => (
                        //     <WatchProvider key={d + '-' + watch.provider_id} provider={{...watch}}></WatchProvider>
                        // ))
                    ))}
                </div>
            )
        } else {
            return null
        }
    } else {
        return null;
    }
}