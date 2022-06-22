import React, { useEffect, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

interface Props {
    seconds: number
}

export const Timer = (props: Props) => {
    const [timer, setTimer] = useState(props.seconds);
    const [timerOn, setTimerOn] = useState(false);

    useEffect(() => {
        if (timerOn) {
            const interval = setInterval(
                () => {
                    if (timer > 0)
                        setTimer(timer-1);
                },
                1000
            );

            return (
                () => {
                    clearInterval(interval);
                }
            )
        }
    }, [timer, timerOn]);

    const startClick = () => {
        setTimerOn(true)
    }

    const pauseClick = () => {
        setTimerOn(false)
    }

    const stopClick = () => {
        setTimerOn(false);
        setTimer(props.seconds);
    }

    const startStopButton = <button onClick={
        timerOn ? stopClick : startClick
    }>
        {timerOn ? 'Stop' : 'Start'}
    </button>;

    return (
        <div>
            <p>{timer}</p>
            {startStopButton}
            <button onClick={pauseClick}>Pause</button>
        </div>
    );
}