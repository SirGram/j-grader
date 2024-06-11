import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { FaPause, FaPlay } from 'react-icons/fa6';

export default function CircleProgress({ countdownSeconds, answerTime, isRunning, buttonPressed, setButtonPressed }: { countdownSeconds: number, answerTime: number, isRunning:boolean, buttonPressed:boolean, setButtonPressed:(value:boolean)=>void }) {
    const [key, setKey] = useState<number>(0); // key to reset the timer

    useEffect(() => {
        if (countdownSeconds <1 || buttonPressed){
        setKey(prevKey => prevKey + 1);}
        setButtonPressed(false)
    }, [countdownSeconds, buttonPressed]);

    return(
        <div className='relative'>
    <CountdownCircleTimer
    key={key}
    isPlaying={isRunning}
    duration={answerTime}
    colors={['#004777', '#F7B801', '#A30000' ]}
    colorsTime={[7,  2, 0]}
    strokeWidth={3}
    trailColor="rgba(0, 0, 0, 0)"
    size={24}
  >
    
  </CountdownCircleTimer>
  <div className="absolute  text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> {!isRunning ?<FaPlay /> :<FaPause />}</div>  
  </div>
)
}