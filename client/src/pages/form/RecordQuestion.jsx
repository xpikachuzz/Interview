import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../createClient';

const RecordQuestion = ({formId, userId, questionId}) => {
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

  console.log(`${formId}/${userId}/${questionId}`)
  const downloadRecording = async () => {
    console.log("INITIAL BLOB")
    const blob = new Blob(recordedChunks, {
      type: 'video/webm',
    });
    console.log("INITIAL FILE")
    const file = new File([blob], `recording-${Date.now()}.webm`, {
      type: 'video/webm',
    });

    // Upload to Supabase
    console.log("UPLOADING TO SUPABASE")
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`${formId}/${questionId}/${userId}`, file);
    console.log("CHECKING RESULT")
    if (error) {
      console.error('Upload error:', error.message);
    } else {
      console.log('Uploaded to:', data.path);
    }
  };

 console.log(recordedChunks) 

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: 600 }} />
      <div className='my-10 flex gap-5'>
        <button className="border-[1px] px-2 py-0.5" onClick={startCamera}>Refresh Camera</button>
        <button className="border-[1px] px-2 py-0.5" onClick={startRecording}>Start Recording</button>
        <button className="border-[1px] px-2 py-0.5" onClick={stopRecording}>Stop Recording</button>
        <button className="border-[1px] px-2 py-0.5" onClick={downloadRecording} disabled={recordedChunks.length === 0}>
          Download
        </button>
      </div>
    </div>
  );
};

export default RecordQuestion;
