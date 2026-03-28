import React, { useState } from "react";
import "./VideoSection.css";

/**
 * To update videos: replace `youtubeId` with any public YouTube video ID.
 * Poster images are Unsplash fashion photos (free, no attribution required for demo).
 */
const videos = [
  {
    id: "v1",
    youtubeId: "0yTrb8KDHNA",          // Indian fashion lookbook — replace with your campaign video
    title: "SS26 Campaign",
    subtitle: "Spring Summer 2026 — New Collection",
    poster: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=900&q=80&fit=crop",
    wide: true,                          // spans full height on left
  },
  {
    id: "v2",
    youtubeId: "tLp5sEGpqGg",           // Indian fashion show — replace with your video
    title: "Women's Edit",
    subtitle: "Kurtas, Dresses & More",
    poster: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80&fit=crop",
    wide: false,
  },
  {
    id: "v3",
    youtubeId: "mMnJqefXqfs",           // Menswear lookbook — replace with your video
    title: "Men's Essentials",
    subtitle: "Shirts, Bottoms & Casuals",
    poster: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80&fit=crop",
    wide: false,
  },
];

function VideoTile({ video }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => setPlaying(true);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setPlaying(false);
  };

  return (
    <div className={`vs-tile${video.wide ? " vs-tile--wide" : ""}`}>
      {playing ? (
        /* Fullscreen modal overlay */
        <div className="vs-modal-overlay" onClick={handleOverlayClick}>
          <div className="vs-modal-box">
            <button className="vs-modal-close" onClick={() => setPlaying(false)} aria-label="Close video">
              ✕
            </button>
            <iframe
              className="vs-iframe"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
            />
          </div>
        </div>
      ) : null}

      {/* Thumbnail card */}
      <div className="vs-thumb" onClick={handlePlay} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handlePlay()}
      >
        <img src={video.poster} alt={video.title} className="vs-poster" loading="lazy" />

        {/* Gradient overlay */}
        <div className="vs-gradient" />

        {/* Play button */}
        <div className="vs-play-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Caption */}
        <div className="vs-caption">
          <div className="vs-caption-title">{video.title}</div>
          <div className="vs-caption-sub">{video.subtitle}</div>
        </div>
      </div>
    </div>
  );
}

export default function VideoSection({ sectionNumber = '04' }) {
  const [wide] = useState(videos.filter((v) => v.wide));
  const [narrow] = useState(videos.filter((v) => !v.wide));

  return (
    <section className="video-section" title={sectionNumber}>
      <div className="vs-header">
        <h2 className="vs-title">Watch The Look</h2>
        <p className="vs-sub">Get inspired by our latest campaigns and style edits</p>
      </div>

      <div className="vs-grid">
        {/* Left — wide tile */}
        {wide.map((v) => (
          <VideoTile key={v.id} video={v} />
        ))}

        {/* Right — stacked narrow tiles */}
        <div className="vs-stack">
          {narrow.map((v) => (
            <VideoTile key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
