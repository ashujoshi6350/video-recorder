import { FC } from "react";
import { RecordingStatus } from "../enums";
import { RecordingControls } from "./RecordingControls";
import { formatTime } from "../utils";

export const CameraPreview: FC<{
    videoRef: any;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onPauseRecording: () => void;
    recordingStatus: RecordingStatus;
    recordingTime: number;
  }> = ({ videoRef, onStartRecording, onStopRecording, onPauseRecording, recordingStatus, recordingTime }) => (
    <div className="relative media-block">
      <video ref={videoRef} autoPlay playsInline muted={true} />
      <RecordingControls
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPauseRecording={onPauseRecording}
        recordingStatus={recordingStatus}
      />
      {recordingStatus !== RecordingStatus.NOT_RECORDING && <div className="absolute bottom-4 left-4 text-white">
        Recording Time: {formatTime(recordingTime)}
      </div>}
    </div>
);
