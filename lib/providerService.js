import { DatabaseService } from '@lib/dbService.js'
import { Logger } from '@lib/clientLogger.js'
import * as Constants from '@lib/constants'
import {Provider} from '@lib/provider'


class ProviderService {
    addProvider(provider_name, provider_id, provider_logo_path, ignored=false) {
        const provider = new Provider(provider_id, provider_name, provider_logo_path, ignored)
        DatabaseService.put(Constants.PROVIDER_TABLESPACE, provider, provider_id)
        return provider
    }

    async updateProvider(inputData) {
        console.log(inputData)
        const data = await DatabaseService.get(Constants.PROVIDER_TABLESPACE, inputData.provider_id)
        if (data) {
            const provider = new Provider(data.id, data.provider_name, data.provider_logo_path, inputData.ignored)
            provider.ignored(ignored)
            DatabaseService.put(Constants.PROVIDER_TABLESPACE, provider, provider_id)
            return provider
        } else {
            console.log('here')
            // const provider = new Provider(inputData.id, data.provider_name, data.provider_logo_path, data.ignored)
            // DatabaseService.put(Constants.PROVIDER_TABLESPACE, provider, provider_id)
        }
        return undefined
    }

    getIgnoredProviders() {

    }
}

export const ProviderSvc = new ProviderService()