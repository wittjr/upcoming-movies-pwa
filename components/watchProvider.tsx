import { useState, useEffect, Profiler } from 'react'
import styles from './watchProvider.module.css'
import { ProviderSvc } from '@lib/providerService'
import { Logger } from '@lib/clientLogger.js'
import { Provider } from '@lib/provider'

export default function WatchProvider({ id, name, logo_path, showDisabled=true }) {
    const initialImgClasses = [styles.provider_image, styles.tooltip]
    const disabledStyle = styles.provider_disable
    const [imgClasses, setImageClasses] = useState(initialImgClasses)

    ProviderSvc.checkProvider(id).then(data => {
        if (data) {
            setImageClasses([...initialImgClasses, styles.provider_disable])
        }
    })

    async function handleClick() {
        if (imgClasses.length > initialImgClasses.length) {
            await ProviderSvc.removeProvider(id)
            setImageClasses([...initialImgClasses])
        } else {
            await ProviderSvc.addProvider(id)
            setImageClasses([...initialImgClasses, styles.provider_disable])
        }
    }

    return (
        <>
        {((imgClasses.length == initialImgClasses.length) || showDisabled) && 
            <div data-tooltip={name} className={styles.tooltip}>
                <img onClick={handleClick} src={`https://image.tmdb.org/t/p/original/${logo_path}`} data-tooltip={name} className={imgClasses.join(' ')} />
            </div>
        }
        </>
    )
}