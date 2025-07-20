import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideData {
  id: number;
  image: string;
  alt: string;
  caption: string;
  location: string;
}

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: SlideData[] = [
    {
      id: 1,
      image: "/images/students%201.jpg",
      alt: "Focused student taking exam",
      caption: "Excellence in Education",
      location: "Preparing for BECE Success",
    },
    {
      id: 2,
      image: "/images/slider%20image%202.jpg", 
      alt: "Students actively participating in class",
      caption: "Interactive Learning",
      location: "Engaging Classroom Experience",
    },
    {
      id: 3,
      image: "/images/slider%20image%201.webp",
      alt: "Happy student with backpack",
      caption: "Confident Learners",
      location: "Ready for the Future",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div
      className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Caption */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {slide.caption}
              </h3>
              <p className="text-sm md:text-base opacity-90">
                {slide.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause Indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-emerald animate-pulse" : "bg-white/50"}`}
        />
      </div>
    </div>
  );
}
