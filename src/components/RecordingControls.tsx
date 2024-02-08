import { FC } from "react";
import { RecordingStatus } from "../enums";

export const RecordingControls: FC<{
    onStartRecording: () => void;
    onStopRecording: () => void;
    onPauseRecording: () => void;
    recordingStatus: RecordingStatus;
  }> = ({ onStartRecording, onStopRecording, onPauseRecording, recordingStatus }) => (
    <>
      {recordingStatus === RecordingStatus.NOT_RECORDING && (
        <button onClick={onStartRecording} className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-md">
          Start Recording
        </button>
      )}
      {recordingStatus !== RecordingStatus.NOT_RECORDING && (
        <>
          <button onClick={onStopRecording} className="absolute bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-md">
            Stop Recording
          </button>
          <button onClick={onPauseRecording} className="absolute bottom-4 right-64 bg-yellow-500 text-white py-2 px-4 rounded-md">
            {recordingStatus === RecordingStatus.RECORDING ? 'Pause Recording' : 'Resume Recording'}
          </button>
        </>
      )}
    </>
);
