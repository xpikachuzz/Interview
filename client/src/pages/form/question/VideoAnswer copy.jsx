import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../createClient';
import { Countdown } from '../../../element/Countdown';

export const VideoAnswer = ({ question, question_no, form_id, setLoading, setError, userId, nextQuestionNav, email }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [permission, setPermission] = useState(false);
  const [recording, setRecording] = useState(false)
  const [finRecording, setFinRecording] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [timerRunOut, setTimerRunOut] = useState(false)

  useEffect(() => {
    if (timerRunOut) {
      downloadRecording()
    }
  }, [timerRunOut])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };
      setPermission(true)
    } catch (e) {
      console.log(e)
    }
  };

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorderRef.current.start();
    setRecording(true)
    setFinRecording(false)
  };

  const stopRecording = async () => {
    await mediaRecorderRef.current.stop();
    setRecording(false)
    setFinRecording(true)
  };

  const downloadRecording = async () => {
    setLoading(true)
    console.log("DOWNLOAD")

    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });
    const file = new File([blob], `recording-${Date.now()}.webm`, {
      type: 'video/webm',
    });

    console.log("BLOB:", blob)
    console.log("FILE:", file)

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`${form_id}/${question_no}/${userId}`, file);

    if (error) {
      setRecording(false)
      setFinRecording(false)
      setError(error.message)
      console.log("ERROR", error)
    } else {
      const res = await supabase.from("Answer").insert({
        question_no: question_no,
        form_id: form_id,
        answer: "",
        user_id: userId,
        user_email: email
      });
      setSubmitted(true)

      // Move to the next question
      await nextQuestionNav()
    }
  };

  const timerCallback = async () => {
    if (!submitted) {
      stopRecording();
      console.log("SET TIME START")
      setTimerRunOut(true)
      console.log("SET TIME FINISHED")
    }
  }


  // get permission
  if (!permission) {
    return (
      <div>
        <button className="border-[2px] px-3 py-1 font-bold text-2xl text-slate-100 hover:cursor-pointer" onClick={startCamera}>Refresh Camera</button>
      </div>
    )
  }


  return (
    <div>
      <h1 className='font-bold ml-4 text-5xl text-slate-100 '> <span>{question_no}.</span> {question}</h1>
      <video className='my-5' ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: 600 }} />
      <div className='my-10 flex gap-5'>
        <button className="border-[2px] px-3 py-1 text-slate-100 text-2xl font-bold hover:cursor-pointer" onClick={startCamera}>Start Camera / Give Permission</button>
        {!recording ? 
          <button className="border-[2px] px-3 py-1 text-slate-100 text-2xl font-bold hover:cursor-pointer" onClick={startRecording}>Start Recording</button> : 
          <button className="border-[2px] px-3 py-1 text-slate-100 text-2xl font-bold hover:cursor-pointer" onClick={stopRecording}>Stop Recording</button>
        }
        {
          finRecording && (
            <button className="border-[2px] px-3 py-1 text-slate-100 text-2xl font-bold hover:cursor-pointer" onClick={downloadRecording} disabled={recordedChunks.length === 0}>
              Submit
            </button>
          )
        }
      </div>
      {recording && (
          <Countdown timer={10} cb={timerCallback} />
        )
      }
    </div>
  );
}