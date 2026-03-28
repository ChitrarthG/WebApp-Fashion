import React, { useState, useEffect, useCallback } from "react";
import "./Hero.css";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&fit=crop",
    title: "New In.",
    cta: "SHOP NOW",
    ctaHref: "#new-arrivals",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=1600&q=80&fit=crop",
    title: "Men's Edit.",
    cta: "SHOP NOW",
    ctaHref: "#men",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80&fit=crop",
    title: "Up to 50% Off",
    cta: "SHOP SALE",
    ctaHref: "#sale",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1600&q=80&fit=crop",
    title: "Kids Collection.",
    cta: "SHOP NOW",
    ctaHref: "#kids",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80&fit=crop",
    title: "Home & Living.",
    cta: "EXPLORE NOW",
    ctaHref: "#home-living",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&q=80&fit=crop",
    title: "Brands We Love.",
    cta: "DISCOVER",
    ctaHref: "#brands",
  },
];

const Hero = ({ sectionNumber = "01" }) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setTransitioning(false), 600);
  }, [transitioning]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <>
      <section className="hero-section" title={sectionNumber}>
        <div className="hero-carousel">
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide${i === current ? " hero-slide--active" : ""}`}
            aria-hidden={i !== current}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-slide-img"
              draggable="false"
            />
            {/* Text overlay */}
            <div className="hero-overlay">
              <h1 className="hero-overlay-title">{slide.title}</h1>
              <a href={slide.ctaHref} className="hero-overlay-cta">{slide.cta}</a>
            </div>
          </div>
        ))}

        {/* Prev / Next arrows */}
        <button
          className="hero-arrow hero-arrow--prev"
          onClick={prev}
          aria-label="Previous slide"
        >
          &#8249;
        </button>
        <button
          className="hero-arrow hero-arrow--next"
          onClick={next}
          aria-label="Next slide"
        >
          &#8250;
        </button>


        </div>
      </section>

      {/* Dot indicators on global background */}
      <div className="hero-dots" role="tablist" aria-label="Slide indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            className={`hero-dot${i === current ? " hero-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default Hero;
