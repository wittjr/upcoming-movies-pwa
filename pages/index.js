import React, { useState } from "react";
import Layout from "../components/layout"
import Head from 'next/head'
import Header from '@components/header'
import Footer from '@components/footer'
import Modal from '@components/modal'

export default function Home() {
    const [showModal, setShowModal] = useState(false);

    return (
        <Layout>
        <p>Welcome</p>
      </Layout>
        // <div className="container">
        //     <Head>
        //         <title>Next.js Starter!</title>
        //         <link rel="icon" href="/favicon.ico" />
        //     </Head>

        //     <main>
        //         <Header title="Welcome to my app!" />
        //         <p className="description">
        //             Get started by editing <code>pages/index.js</code>
        //         </p>
        //         <p>
        //             <a href="https://api.trakt.tv/oauth/authorize?response_type=code&client_id=7e22162f9eb4579e79453681c2a03590c1ebee89a79c422574c7f59bc6d462db&redirect_uri=https://bucolic-bombolone-57352b.netlify.app/api/authorize">Login to Trakt</a>
        //         </p>
        //         <div id="modal-root"></div>
        //         <div>
        //             <button onClick={() => setShowModal(true)}>Login</button>
        //             <Modal
        //                 onClose={() => setShowModal(false)}
        //                 show={showModal}
        //             >
        //                 Hello from the modal!
        //             </Modal>
        //         </div>
        //     </main>

        //     <Footer />
        // </div>
    )
}
