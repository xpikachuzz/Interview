import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../createClient';

export const VideoAnswer = ({ question, question_no, form_id, setLoading, setError, userId, nextQuestionNav }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
  })


  const startCamera = async () => {
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
  };

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const downloadRecording = async () => {
    setLoading(true)

    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });
    const file = new File([blob], `recording-${Date.now()}.webm`, {
      type: 'video/webm',
    });

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`${form_id}/${question_no}/${userId}`, file);
    if (error) {
      setError(error.message)
    } else {
      // Move to the next question
      await nextQuestionNav()
      console.log('Uploaded to:', data.path);
    }
  };


  return (
    <div>
      <h1 className='text-3xl font-bold ml-4'> <span>{question_no}.</span> {question}</h1>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: 600 }} />
      <div className='my-10 flex gap-5'>
        <button className="border-[1px] px-2 py-0.5" onClick={startCamera}>Refresh Camera</button>
        <button className="border-[1px] px-2 py-0.5" onClick={startRecording}>Start Recording</button>
        <button className="border-[1px] px-2 py-0.5" onClick={stopRecording}>Stop Recording</button>
        <button className="border-[1px] px-2 py-0.5" onClick={downloadRecording} disabled={recordedChunks.length === 0}>
          Submit
        </button>
      </div>
    </div>
  );
}