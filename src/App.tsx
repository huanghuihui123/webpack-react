import React, { Suspense } from 'react';
import Routes from './routes/index';

const App: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes />
        </Suspense>
    )
}

export default App