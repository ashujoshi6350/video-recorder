import { useState, useRef, useEffect, FC } from 'react';
import { RecordingStatus } from '../enums';
import { CameraPreview } from '../components/CameraPreview'; 
import { PermissionDeniedMessage } from '../components/PermissonDeniedMessage';

export const Home: FC = () => {
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>(RecordingStatus.NOT_RECORDING);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_RECORDING_DURATION = 1800; // hard limit of 30 minutes = 1800 seconds

    useEffect(() => {
        const startCameraPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMediaStream(stream);
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (error) {
            setPermissionDenied(true);
        }
        };

        startCameraPreview();

        return () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        };
    }, []);

    const handleStartRecording = () => {
        if (mediaStream) {
            startRecording();
        }
    };

    const startRecording = () => {
        const recorder = new MediaRecorder(mediaStream as MediaStream, { mimeType: 'video/webm' });
        recorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            a.href = url;
            a.download = 'recording.webm';
            a.click();
            URL.revokeObjectURL(url);
            chunksRef.current = [];
            setRecordingTime(0);
            setRecordingStatus(RecordingStatus.NOT_RECORDING);
        };
        mediaRecorderRef.current = recorder;
        recorder.start();
        setRecordingStatus(RecordingStatus.RECORDING);
        startTimer();
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setRecordingTime(prevTime => {
                if (prevTime >= MAX_RECORDING_DURATION) {
                    handleStopRecording();
                    alert(`Maximum recording duration reached (${MAX_RECORDING_DURATION} seconds).`);
                }
                return prevTime + 1
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaStream) {
            mediaRecorderRef.current.stop();
            stopTimer();
        }
    };

    const handlePauseRecording = () => {
        if (mediaRecorderRef.current && recordingStatus === RecordingStatus.RECORDING) {
            mediaRecorderRef.current.pause();
            stopTimer();
            setRecordingStatus(RecordingStatus.PAUSED);
        } else if (mediaRecorderRef.current && recordingStatus === RecordingStatus.PAUSED) {
            mediaRecorderRef.current.resume();
            startTimer();
            setRecordingStatus(RecordingStatus.RECORDING);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
        {permissionDenied ? (
            <PermissionDeniedMessage />
        ) : (
            mediaStream && (
            <CameraPreview
                videoRef={videoRef}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onPauseRecording={handlePauseRecording}
                recordingStatus={recordingStatus}
                recordingTime={recordingTime}
            />
            )
        )}
        </div>
    );
}
