import { useState, useEffect } from 'react'
import styles from './watchProvider.module.css'

export default function WatchProvider(props) {
    // console.log(props)
    return (
        <div data-tooltip={props.provider.provider_name} className={styles.tooltip}>
            <img src={`https://image.tmdb.org/t/p/original/${props.provider.logo_path}`} data-tooltip={props.provider.provider_name} className={[styles.provider_image, styles.tooltip].join(' ')} />
            {/* <div>Provider: {props.provider.provider_name}</div> */}
        </div>
    )
}