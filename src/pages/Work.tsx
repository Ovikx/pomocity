import React from 'react';
import { Timer } from '../components/Timer';

export const Work = () => {
    return (
        <div>
            <h1>Timer</h1>
            <Timer seconds={5} />
        </div>
    )
}