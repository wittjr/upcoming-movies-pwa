import React from 'react';
import Layout from "../components/layout"

const fallback = () => (
    <Layout>
        <div>
            <h1>This is fallback page when device is offline </h1>
            <small>Route will fallback to this page</small>
        </div>

    </Layout>
);

export default fallback;