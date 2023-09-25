import { useState, useEffect } from 'react'
import styles from './movie.module.css'
import WatchProviderList from "./watchProviderList"
import MovieButtons from "./movieButtons"
import { Service } from '../lib/db.js';
import { Logger } from '@lib/clientLogger.js';

const dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)

export default function Movie(props) {
    const [data, setData] = useState(props.data)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let newData = await Service.getMovie(props.id)
    //         setData(newData);
    //     };
    //     fetchData();

    // }, [props.id]);

    // useEffect(() => {
    // }, [data]);

    var poster_path = 'https://placehold.co/220x330'

    const provider_types = ['flatrate', 'buy', 'rent']

    const release_types = ['', '', 'Theatrical (Limited)', 'Theatrical', 'Digital']

    // Logger.log(data)
    if (data && data.ignore != true) {
        // console.log(data)
        if (data.poster_path) {
            poster_path = 'https://image.tmdb.org/t/p/original/' + data.poster_path
        }
        if (data.release_dates.results.length > 0) {

            return (
                <div className={styles.movie}>
                    <img className={styles.poster} src={poster_path}></img>
                    <div className={[styles.title, styles.row].join(' ')}>{data.title}</div>
                    <div className={[styles.overview, styles.row].join(' ')}>{data.overview}</div>
                    <div className={styles.row}>
                        <span className={styles.label}>Genre(s):</span>
                        <span>&nbsp;&nbsp;</span>
                        <span>{data.genres.reduce((v, g) => {
                            if (v.length == 0) {
                                return g.name
                            } else {
                                return v + ', ' + g.name
                            }
                        }, '')}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Runtime:</span>
                        <span>&nbsp;&nbsp;</span>
                        {data.runtime == 0 && 
                            <span>-</span>
                        }
                        {data.runtime != 0 &&
                            <span>{data.runtime} minutes</span>
                        }
                    </div>
                    <div className={styles.movie}>
                        <div className={styles.row}>
                            <MovieButtons stateChanger={setData} data={data}/>
                        </div>
                    </div>
                    
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