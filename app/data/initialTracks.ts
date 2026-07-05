export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  isLocal?: boolean;
}

export const initialTracks: Track[] = [
  {
    id: "t1",
    title: "Melodi Pengantar Tidur",
    artist: "Piano Klasik",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "t2",
    title: "Desir Angin Malam",
    artist: "Lofi Ambient",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "t3",
    title: "Bintang Teduh",
    artist: "Sleep Meditation",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];
