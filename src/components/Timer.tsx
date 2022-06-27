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

    useEffect(() => {
        setTimer(props.seconds);
    }, [props.seconds])

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

    const minutes: number = Math.floor(timer/60);
    const seconds: number = timer%60;
    let minuteString: string = String(minutes);
    let secondString: string = String(seconds);
    if (minutes < 10) {
        minuteString = `0${minutes}`
    }

    if (seconds < 10) {
       secondString = `0${seconds}`
    }
    const clock: string = minuteString + ':' + secondString;

    return (
        <div>
            <p>{clock}</p>
            {startStopButton}
            <button onClick={pauseClick}>Pause</button>
        </div>
    );
}