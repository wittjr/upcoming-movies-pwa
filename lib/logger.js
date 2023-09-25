const { IncomingWebhook } = require('@slack/webhook');

// Read a url from the environment variables
const url = process.env.SLACK_WEBHOOK_URL;

// Initialize
const webhook = new IncomingWebhook(url);


class LogService {
    log(message) {
        if (process.env.NODE_ENV == 'development') {
            console.log(message)
        } else {
            try {
                webhook.send(JSON.stringify(message))
            } catch (err) {}    
        }
    }
}

export const Logger = new LogService()
