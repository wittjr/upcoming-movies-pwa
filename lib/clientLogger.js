class LogService {
    log(data) {
        const res = fetch('/api/logs', {
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
