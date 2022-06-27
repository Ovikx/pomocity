import React, { useState } from 'react';
import { Timer } from '../components/Timer';
import { SkyscraperViewer } from '../features/skyscraperBuilding/SkyscraperViewer';

export const Build = () => {
    const [minutes, setMinutes] = useState(25);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(Number(e.target.value));
        console.log(minutes);
    }

    return (
        <div>
            <h1>Timer</h1>
            <input
                type='number'
                placeholder={String(minutes)}
                onChange={handleChange}
                value={minutes}
            />
            <Timer seconds={minutes*60} />
            <SkyscraperViewer />
        </div>
    )
}