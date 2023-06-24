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
    // console.log(props)

    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            // console.log(props.id)
            let newData = await Service.getMovie(props.id)
            // console.log(newData)
            // if (newData.id == 1135486) {
            //     console.log(newData)
            // }    
    
            // const now = dayjs()
            // const res = await fetch(`/api/movies/${props.id}`)
            // const newData = await res.json()
            // if (newData.id == 747188) {
            //     console.log(`${newData.title} : ${ newData.release_date} ${newData.release_dates.results.length}`)
            // }

            // for (let i=0; i<newData.release_dates.results.length; i++) {
            //     if (newData.release_dates.results[i].iso_3166_1 == 'US') {
            //         // console.log(`${i} ${JSON.stringify(newData.release_dates.results[i].release_dates)}`)
            //         // var keep_dates = []
            //         for (let j=0; j<newData.release_dates.results[i].release_dates.length; j++) {
            //             // console.log(keep_dates)
            //             if (newData.release_dates.results[i].release_dates[j].type == 2) {
            //                 // console.log(dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD'))
            //                 newData.limited_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
            //                 newData.limited_certification = newData.release_dates.results[i].release_dates[j].certification
            //             } else if (newData.release_dates.results[i].release_dates[j].type == 3) {
            //                 newData.theatrical_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
            //                 newData.theatrical_certification = newData.release_dates.results[i].release_dates[j].certification
            //             } else if (newData.release_dates.results[i].release_dates[j].type == 4) {
            //                 newData.digital_release_date = dayjs(newData.release_dates.results[i].release_dates[j].release_date).format('YYYY-MM-DD')
            //                 newData.digital_certification = newData.release_dates.results[i].release_dates[j].certification
            //             }
            //         }
            //         // newData.release_dates = structuredClone(keep_dates)
            //         break
            //     }
            // }

            setData(newData);
            // console.log(newData)
            // Service.put('movies', newData)
        };
        fetchData();

    }, [props.id]);

    const ignore = () => {
        data.ignore = true
        Service.put('movies', data)
    }


    var poster_path = 'https://placehold.co/220x330'
    // var today = dayjs()
    // var after = today.subtract(1, 'week').day(1).format('YYYY-MM-DD')
    // var before = today.add(8, 'week').day(5).format('YYYY-MM-DD')
    // console.log(after)
    // console.log(before)

    const provider_types = ['flatrate', 'buy', 'rent']

    const release_types = ['', '', 'Theatrical (Limited)', 'Theatrical', 'Digital']

    if (data && data.ignore != true) {
        // if (data.id == 1135486) {
        //     console.log(data.title)
        //     console.log(data)
    
        // }
        // console.log(data.release_dates.results.length)
        // if (data['watch/providers'].results.US) {
        //     console.log(data.title)
        //     console.log(data['watch/providers'].results.US)
        // }
        if (data.poster_path) {
            poster_path = 'https://image.tmdb.org/t/p/original/' + data.poster_path
        }
        if (data.release_dates.results.length > 0) {
            // var keep_dates = []
            // for (let i=0; i<data.release_dates.length; i++) {
            //     // console.log(dayjs(data.release_dates[i].release_date).format('YYYY-MM-DD'))
            //     if (dayjs(data.release_dates[i].release_date).isBetween(after, before, null, [])) {
            //         keep_dates.push(structuredClone(data.release_dates[i]))
            //     }
            //     if (data.release_dates[i].type == 4 && dayjs(data.release_dates[i].release_date).isSameOrBefore(today)) {
            //         // console.log(today)
            //         // console.log(dayjs(data.release_dates[i].release_date))
            //         // console.log(dayjs(data.release_dates[i].release_date).isSameOrBefore(today))
            //         // console.log(data)
            //         // console.log(data.release_dates[i])
            //         keep_dates = []
            //         break
            //     }
            // }
            // keep_dates = [...data.release_dates]

            // if (keep_dates.length > 0) {
            // if (1 == 0) {
            //     console.log('why')
            //     return (
            //         <div className={styles.movie}>
            //             <img className={styles.poster} src={poster_path}></img>
            //             <div className={styles.title}>{data.title}</div>
            //             {/* <div className={styles.date}>{release_type} {release_date}</div> */}
            //             <div  className={styles.overview}>{data.overview}</div>
            //             {keep_dates.map(d => (
            //                 <ul key={d.release_date + '-' + d.type} className={styles.list}>
            //                     <li>Type: {release_types[d.type]}</li>
            //                     <li>Date: {dayjs(d.release_date.split('T')[0]).format('YYYY-MM-DD')}</li>
            //                     <li>Rating: {d.certification}</li>
            //                 </ul>
            //             ))}
            //             {data['watch/providers'] && data['watch/providers'].results && data['watch/providers'].results.US && Object.keys(data['watch/providers'].results.US) && Object.keys(data['watch/providers'].results.US).map(d => (
            //                 // console.log(d)
            //                 <WatchProviderList key={`${props.id}-${d}`} type={d} items={data['watch/providers'].results.US[d]}></WatchProviderList>
            //                 // d != 'link' && data['watch/providers'].results.US[d].map(watch => (
            //                 //     <WatchProvider key={d + '-' + watch.provider_id} provider={{...watch}}></WatchProvider>
            //                 // ))
            //             ))}
            //             {/* {data['watch/providers'].results.US.flatrate && data['watch/providers'].results.US.flatrate.map(d => (
            //                 <ul key={'flatrate-' + watch.provider_id} className={styles.list}>
            //                     <li>Type: {d}</li>
            //                     <li>Provider: {watch.provider_name}</li>
            //                 </ul>
            //             ))}
            //             {data['watch/providers'].results.US.buy && data['watch/providers'].results.US.buy.map(d => (
            //                 <ul key={'flatrate-' + watch.provider_id} className={styles.list}>
            //                     <li>Type: {d}</li>
            //                     <li>Provider: {watch.provider_name}</li>
            //                 </ul>
            //             ))}
            //             {data['watch/providers'].results.US.rent && data['watch/providers'].results.US.rent.map(d => (
            //                 <ul key={'flatrate-' + watch.provider_id} className={styles.list}>
            //                     <li>Type: {d}</li>
            //                     <li>Provider: {watch.provider_name}</li>
            //                 </ul>
            //             ))} */}
            //             {/* <p>Runtime: {movie.data.movie.runtime}</p> */}
            //             {/* <p><img className={styles.poster} src={content}></img></p> */}
            //             {/* </div> */}
            //             {/* <hr /> */}
            //         </div>
            //     )
            // } else {
                // console.log('Kept no dates')
                // console.log(data.release_dates)
                // console.log(data)
                // return null
                return (
                    <div className={styles.movie}>
                        <img className={styles.poster} src={poster_path}></img>
                        <div className={styles.title}>{data.title}</div>
                        <button onClick={ignore}>Ignore</button>
                        {/* <div className={styles.date}>{release_type} {release_date}</div> */}
                        <div  className={styles.overview}>{data.overview}</div>
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
                        {/* {data['watch/providers'].results.US.flatrate && data['watch/providers'].results.US.flatrate.map(d => (
                            <ul key={'flatrate-' + watch.provider_id} className={styles.list}>
                                <li>Type: {d}</li>
                                <li>Provider: {watch.provider_name}</li>
                            </ul>
                        ))}
                        {data['watch/providers'].results.US.buy && data['watch/providers'].results.US.buy.map(d => (
                            <ul key={'flatrate-' + watch.provider_id} className={styles.list}>
                                <li>Type: {d}</li>
                                <li>Provider: {watch.provider_name}</li>
                            </ul>
                        ))}
                        {data['watch/providers'].results.US.rent && data['watch/providers'].results.US.rent.map(d => (
                            <ul key={'flatrate-' + watch.provider_id} className={styles.list}>
                                <li>Type: {d}</li>
                                <li>Provider: {watch.provider_name}</li>
                            </ul>
                        ))} */}
                        {/* <p>Runtime: {movie.data.movie.runtime}</p> */}
                        {/* <p><img className={styles.poster} src={content}></img></p> */}
                        {/* </div> */}
                        {/* <hr /> */}
                    </div>
                )
            // }
        } else {
            // console.log('No release dates')
            // console.log(data)
            return null
        }

    } else {
        return null;
    }
}