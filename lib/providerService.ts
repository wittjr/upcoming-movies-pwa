import { DatabaseService } from '@lib/dbService.js'
import { Logger } from '@lib/clientLogger.js'
import * as Constants from '@lib/constants'

class ProviderService {

    async addProvider(id: number) {
        await DatabaseService.put(Constants.PROVIDER_TABLESPACE, {id: id})
    }

    async removeProvider(id: number) {
        const data = await DatabaseService.get(Constants.PROVIDER_TABLESPACE, id)
        if (data) {
            await DatabaseService.delete(Constants.PROVIDER_TABLESPACE, id)
        }
    }

    async checkProvider(id: number): Promise<boolean> {
        let data = await DatabaseService.get(Constants.PROVIDER_TABLESPACE, id)
        if (data) {
            return true
        }
        return false
    }
}

export const ProviderSvc = new ProviderService()