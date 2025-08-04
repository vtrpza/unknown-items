'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  thumbnailUrl?: string;
}

interface MediaCarouselProps {
  media: MediaItem[];
}

export function MediaCarousel({ media }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const hasMultiple = media.length > 1;

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const toggleMute = () => {
    setIsVideoMuted(!isVideoMuted);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted">
      <div className="relative aspect-video">
        {currentMedia.type === 'IMAGE' ? (
          <Image
            src={currentMedia.url}
            alt="Post media"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : currentMedia.type === 'VIDEO' ? (
          <video
            src={currentMedia.url}
            controls
            muted={isVideoMuted}
            className="w-full h-full object-cover"
            poster={currentMedia.thumbnailUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Media not supported
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons for multiple media */}
        {hasMultiple && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Video controls */}
        {currentMedia.type === 'VIDEO' && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            onClick={toggleMute}
          >
            {isVideoMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Media counter */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnail navigation for multiple media */}
      {hasMultiple && (
        <div className="flex gap-1 p-2 bg-muted/50">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative w-12 h-12 rounded overflow-hidden border-2 transition-all',
                index === currentIndex
                  ? 'border-primary'
                  : 'border-transparent hover:border-primary/50'
              )}
            >
              {item.type === 'IMAGE' ? (
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
