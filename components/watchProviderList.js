import { useState, useEffect } from 'react'
import styles from './watchProviderList.module.css'
import WatchProvider from "./watchProvider"

export default function WatchProviderList(props) {
    // console.log(props)
    if (Array.isArray(props.items)) {
        return (
            <>
                <div className={styles.provider_title}>{props.type}</div>
                <div className={styles.provider_section}>
                    {props.items.map(watch => (
                        <WatchProvider key={`${props.type}-${watch.provider_id}`} provider={watch}></WatchProvider>
                    ))}
                </div>
            </>
        )    
    } else {
        return null
    }
}