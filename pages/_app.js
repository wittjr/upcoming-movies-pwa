import '@styles/globals.css'
import Layout from "@components/layout"
import { useEffect } from 'react'
import { SessionProvider } from "next-auth/react"
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react"
import { Logger } from '@lib/clientLogger.js'

const db = dynamic(() => import('@lib/db.js'), { ssr: false })

function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status } = useSession({ required: true })

    // Logger.log(`STATUS: ${status}`)
    if (status === "loading") {
        return <div>Loading...</div>
    }

    return children
}

async function registerSync() {
    const swRegistration = await navigator.serviceWorker.ready;
    swRegistration.sync.register("content-sync");
}

async function registerPeriodicSync() {
    const swRegistration = await navigator.serviceWorker.ready;
    try {
        Logger.log("Attempting to register periodic sync.");
        await swRegistration.periodicSync.register("content-periodicSync", {
            minInterval: 10 * 1000,
        });
    } catch {
        Logger.log("Periodic Sync could not be registered!");
    }
}

async function checkSync() {
    navigator.serviceWorker.ready.then(registration => {
        registration.periodicSync.getTags().then(tags => {
            Logger.log(tags)
        });
      });
}

export default function Application({
    Component,
    pageProps: { session, ...pageProps },
}) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            registerPeriodicSync().then(
                checkSync()
            )
            registerSync()
            checkSync()
        }
    }, []);
    // Logger.log(`Component.auth: ${Component.auth}`)
    return (
        <SessionProvider session={session}>
            <Layout>
                {Component.auth ? (
                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                ) : (
                    <Component {...pageProps} />
                )}
            </Layout>
        </SessionProvider>
    )
}