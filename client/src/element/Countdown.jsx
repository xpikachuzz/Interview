import React, { useEffect, useState } from 'react'

export const Countdown = ({cb, timer}) => {
  const [counter, setCounter] = useState({timer, counterFinished: false});

  useEffect(() => {
      const key = setInterval(() => {
        setCounter(count => {
          if (count.counterFinished) {
            clearInterval(key)
            return count
          }
          // call the callback 
          if (count.timer <= 0) {
            clearInterval(key)
            return
          }
          return {...count, timer: count.timer - 1}
        })
      }, 1000);

      return () => {
      clearInterval(key);
      };
  }, [])

  useEffect(() => {
    if (counter.timer <= 0) {
      cb()
    }
  }, [counter.timer, cb])

  return (
    <div className='text-slate-100 font-bold text-2xl'>Timer: {counter.timer}</div>
  )
}
