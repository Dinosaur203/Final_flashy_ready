import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Music } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  tracks: Track[];
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string; // In a real app, this would be actual audio URLs
}

const MusicPlayer: React.FC = () => {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Demo playlists with royalty-free music concepts
  const playlists: Playlist[] = [
    {
      id: 'focus',
      name: 'Deep Focus',
      description: 'Ambient sounds and minimal beats for intense study sessions',
      cover: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=300',
      tracks: [
        { id: '1', title: 'Gentle Rain', artist: 'Nature Sounds', duration: '3:24', url: '' },
        { id: '2', title: 'Forest Whispers', artist: 'Ambient Collective', duration: '4:12', url: '' },
        { id: '3', title: 'Ocean Waves', artist: 'Calm Studios', duration: '5:01', url: '' },
        { id: '4', title: 'Mountain Breeze', artist: 'Serenity Now', duration: '3:45', url: '' }
      ]
    },
    {
      id: 'chill',
      name: 'Study Chill',
      description: 'Relaxed lo-fi beats perfect for reading and note-taking',
      cover: 'https://images.pexels.com/photos/4088013/pexels-photo-4088013.jpeg?auto=compress&cs=tinysrgb&w=300',
      tracks: [
        { id: '5', title: 'Coffee Shop', artist: 'Lo-Fi Collective', duration: '2:58', url: '' },
        { id: '6', title: 'Rainy Day Study', artist: 'Chill Beats', duration: '3:33', url: '' },
        { id: '7', title: 'Library Vibes', artist: 'Study Music Co', duration: '4:07', url: '' },
        { id: '8', title: 'Peaceful Piano', artist: 'Instrumental Moods', duration: '3:22', url: '' }
      ]
    },
    {
      id: 'classical',
      name: 'Classical Focus',
      description: 'Timeless classical pieces that enhance concentration',
      cover: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=300',
      tracks: [
        { id: '9', title: 'Bach Variations', artist: 'Classical Ensemble', duration: '4:28', url: '' },
        { id: '10', title: 'Mozart Sonata', artist: 'Piano Masters', duration: '5:15', url: '' },
        { id: '11', title: 'Chopin Nocturne', artist: 'Romantic Period', duration: '3:41', url: '' },
        { id: '12', title: 'Debussy Dreams', artist: 'Impressionist Works', duration: '4:03', url: '' }
      ]
    },
    {
      id: 'nature',
      name: 'Nature Sounds',
      description: 'Pure nature recordings for maximum tranquility',
      cover: 'https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?auto=compress&cs=tinysrgb&w=300',
      tracks: [
        { id: '13', title: 'Thunderstorm', artist: 'Weather Sounds', duration: '6:12', url: '' },
        { id: '14', title: 'Crackling Fire', artist: 'Cozy Sounds', duration: '8:00', url: '' },
        { id: '15', title: 'Bird Songs', artist: 'Dawn Chorus', duration: '4:35', url: '' },
        { id: '16', title: 'Flowing Stream', artist: 'Water Sounds', duration: '7:18', url: '' }
      ]
    }
  ];

  const playPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0]);
      if (autoplay) {
        setIsPlaying(true);
      }
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    if (autoplay) {
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      // In a real app, you would pause the actual audio here
      console.log('Pausing:', currentTrack.title);
    } else {
      setIsPlaying(true);
      // In a real app, you would play the actual audio here
      console.log('Playing:', currentTrack.title);
      
      // Simulate audio progress for demo
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 180) { // 3 minutes demo duration
            clearInterval(interval);
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(currentPlaylist.tracks[prevIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className="space-y-6">
      {/* Music Attribution Notice */}
      <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-inter font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Study Music Collection
            </h3>
            <p className="font-inter text-sm text-blue-800 dark:text-blue-200">
              This is a demo music player. All music would be sourced from{' '}
              <a 
                href="https://freemusicarchive.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Free Music Archive
              </a>{' '}
              and other royalty-free sources in a real implementation.
            </p>
          </div>
        </div>
      </Card>

      {/* Player Controls */}
      {currentTrack && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white">
                  {currentTrack.title}
                </h3>
                <p className="font-inter text-gray-600 dark:text-gray-300">
                  {currentTrack.artist} • {currentTrack.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={SkipBack}
                onClick={previousTrack}
              />
              <Button
                size="sm"
                icon={isPlaying ? Pause : Play}
                onClick={togglePlay}
              />
              <Button
                variant="outline"
                size="sm"
                icon={SkipForward}
                onClick={nextTrack}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3 mt-4">
            <span className="text-sm font-inter text-gray-600 dark:text-gray-300">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(currentTime / 180) * 100}%` }}
              />
            </div>
            <span className="text-sm font-inter text-gray-600 dark:text-gray-300">
              3:00
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon={isMuted ? VolumeX : Volume2}
              onClick={toggleMute}
            />
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-sm font-inter text-gray-600 dark:text-gray-300 w-8">
              {isMuted ? 0 : volume}%
            </span>
          </div>
          
          {isPlaying && (
            <div className="text-center mt-4">
              <p className="text-sm font-inter text-primary-600 dark:text-primary-400">
                ♪ Now playing: {currentTrack?.title} ♪
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Settings */}
      <Card>
        <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Player Settings
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-inter font-medium text-gray-900 dark:text-white">
              Auto-play playlists
            </h4>
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
              Automatically start playing when selecting a playlist
            </p>
          </div>
          <Button
            variant={autoplay ? 'primary' : 'outline'}
            onClick={() => setAutoplay(!autoplay)}
          >
            {autoplay ? 'On' : 'Off'}
          </Button>
        </div>
      </Card>

      {/* Playlists */}
      <div>
        <h2 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
          Study Playlists
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {playlists.map((playlist) => (
            <Card key={playlist.id} hover>
              <div className="flex space-x-4">
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-20 h-20 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {playlist.name}
                  </h3>
                  <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {playlist.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-xs text-gray-500 dark:text-gray-400">
                      {playlist.tracks.length} tracks
                    </span>
                    <Button
                      size="sm"
                      icon={Play}
                      onClick={() => playPlaylist(playlist)}
                    >
                      Play
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Track List */}
              {currentPlaylist?.id === playlist.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {playlist.tracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => playTrack(track)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                          currentTrack?.id === track.id 
                            ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                            : ''
                        }`}
                      >
                        <div>
                          <p className="font-inter font-medium text-sm">{track.title}</p>
                          <p className="font-inter text-xs text-gray-600 dark:text-gray-400">
                            {track.artist}
                          </p>
                        </div>
                        <span className="font-inter text-xs text-gray-500 dark:text-gray-400">
                          {track.duration}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Music Attribution */}
      <Card>
        <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Music Attribution & Sources
        </h3>
        <div className="space-y-3 text-sm font-inter text-gray-600 dark:text-gray-300">
          <p>
            All music featured in StudySync is sourced from royalty-free collections and is properly attributed:
          </p>
          <ul className="space-y-2 pl-4">
            <li>• Nature sounds and ambient tracks from public domain collections</li>
            <li>• Lo-fi beats from Creative Commons licensed artists</li>
            <li>• Classical pieces from public domain recordings</li>
            <li>• Original compositions created specifically for study environments</li>
          </ul>
          <p>
            Visit{' '}
            <a 
              href="https://freemusicarchive.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Free Music Archive
            </a>{' '}
            to discover more royalty-free music for your studies.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MusicPlayer;