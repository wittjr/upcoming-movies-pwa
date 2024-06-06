import { useState, useEffect } from 'react'
import styles from './watchProviderList.module.css'
import WatchProvider from "./watchProvider"

export default function WatchProviderList({type, items, showDisabled=false}) {
    const [expanded, setExpanded] = useState(type == 'flatrate')

    if (Array.isArray(items)) {
        return (
            <>
                <div className={styles.provider_title} onClick={() => setExpanded(!expanded)}>{type} Providers</div>
                {expanded &&
                    <div className={styles.provider_section}>
                        {items.map(watch => (
                            <WatchProvider key={`${type}-${watch.provider_id}`} id={watch.provider_id} name={watch.provider_name} logo_path={watch.logo_path} showDisabled={showDisabled}></WatchProvider>
                        ))}
                    </div>
                }
            </>
        )    
    } else {
        return null
    }
}