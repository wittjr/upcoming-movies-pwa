class LogService {
    log(data) {
        if (typeof window === 'undefined') return
        fetch('/api/logs', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: 'browser',
                message: data
            })
        })
    }
}

export const Logger = new LogService()
