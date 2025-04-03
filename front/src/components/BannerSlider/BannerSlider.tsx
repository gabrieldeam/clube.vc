"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./BannerSlider.module.css";

function getImageUrl(url: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  if (url.startsWith("http")) return url;
  return backendUrl + url;
}

interface BannerSliderProps {
  banners: string[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 10000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, banners.length]);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderWrapper}>
        {banners.map((banner, index) => (
          <div key={index} className={`${styles.banner} ${index === current ? styles.active : ""}`}>
            <Image
              src={getImageUrl(banner)}
              alt={`Banner ${index + 1}`}
              layout="responsive"
              width={16}
              height={9}
              className={styles.bannerImage}
            />
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button className={styles.btnNext} onClick={nextSlide}>
          Próximo
        </button>
        <button className={styles.btnPause} onClick={togglePause}>
          {isPaused ? "Retomar" : "Pausar"}
        </button>
      </div>
    </div>
  );
}
