import { forwardRef, useImperativeHandle, useRef } from "react";

export type AudioPlayerHandle = {
    play: () => void
    stop: () => void
};

interface AudioPlayerProps {
    audioURL: string
}
  
export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
    ({ audioURL }, ref) => {
      const audioRef = useRef<HTMLAudioElement>(null)
      // Expose methods to parent
      useImperativeHandle(ref, () => ({
        play: () => {
          audioRef.current?.play()
        },
        stop: () => {
            audioRef.current?.pause()
            audioRef.current!.currentTime = 0
        }
      }))
  
      return <audio ref={audioRef} src={audioURL} />
    }
);