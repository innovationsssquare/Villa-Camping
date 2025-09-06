"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, X, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"



export default function VideoDialog({
  isOpen,
  onClose,
  videoUrl,
  title,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handlePlayPause = () => {
    const video = document.getElementById("property-video")
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    const video = document.getElementById("property-video") 
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleFullscreen = () => {
    const video = document.getElementById("property-video") 
    if (video) {
      if (!isFullscreen) {
        video.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-full p-0 bg-black border-none">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Video Title */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-lg backdrop-blur-sm">
            <h3 className="font-medium">{title}</h3>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video">
            <video
              id="property-video"
              className="w-full h-full object-cover"
              controls={false}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={handlePlayPause}
                  >
                    <Play className={`w-5 h-5 ${isPlaying ? "hidden" : "block"}`} />
                    <div className={`w-5 h-5 ${isPlaying ? "block" : "hidden"}`}>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-5 bg-white"></div>
                        <div className="w-1.5 h-5 bg-white"></div>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={handleFullscreen}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
