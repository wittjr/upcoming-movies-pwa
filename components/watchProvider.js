import { useState, useEffect } from 'react'
import styles from './watchProvider.module.css'
// import { DatabaseService } from '@lib/dbService.js'
import { ProviderSvc } from '@lib/providerService'
import { Logger } from '@lib/clientLogger.js'
import {Provider} from '@lib/provider'

export default function WatchProvider(props) {
    // const [enabled, setEnabled] = useState(props.enabled || true)
    // const prv = 
    const [provider, setProvider] = useState(new Provider(props.provider.provider_id, props.provider.provider_name, props.provider.logo_path, false))
    const handleClick = (event) => {
        event.target.classList.toggle(styles.provider_disable)
        if (provider.ignored) {
            provider.ignored = false
            setProvider(provider)
        } else {
            provider.ignored = true
            setProvider(provider)
        }
        ProviderSvc.updateProvider(provider)
    }

    return (
        <div data-tooltip={props.provider.provider_name} className={styles.tooltip}>
            <img onClick={handleClick} src={`https://image.tmdb.org/t/p/original/${props.provider.logo_path}`} data-tooltip={props.provider.provider_name} className={[styles.provider_image, styles.tooltip].join(' ')} />
        </div>
    )
}