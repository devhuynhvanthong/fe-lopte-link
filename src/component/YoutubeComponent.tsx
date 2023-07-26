import {TypePropYoutube} from "~/@type/youtube";
import {useEffect, useRef, useState} from "react";
import YouTube from "react-youtube";
import {is} from "immutable";
export default function YoutubeComponent( {idVideo, onTime, isCount }: TypePropYoutube) {
    const [time, setTime] = useState(0)
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevCount => prevCount + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (!isCount) {
            setIsRunning(false)
        }
    }, [isCount])

    useEffect(()  => {
        console.log(time)
        if (onTime) {
            onTime(time)
        }
    }, [time])
    const handlePauseResume = () => {
        if (isCount) {
            setIsRunning(prevIsRunning => !prevIsRunning);
        }
    };

    const handleReset = () => {
        setTime(0);
    };

    return <YouTube
        onPause={() => {
            handlePauseResume()
        }}
        onPlay={() => {
            handlePauseResume()
        }}
        videoId={idVideo}
    />
}