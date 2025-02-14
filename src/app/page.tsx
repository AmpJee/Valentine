"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Star, Sparkle, Music, Camera } from 'lucide-react';
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

const GiftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <rect x="3" y="8" width="18" height="14" rx="2"></rect>
    <path d="M12 8V22"></path>
    <path d="M19 12H5"></path>
    <path d="M7 8c0-3 2-4 5-4s5 1 5 4"></path>
  </svg>
);

const ValentineCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  interface Heart {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
  }
  const WebcamComponent = () => <Webcam />;

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGift, setShowGift] = useState(false);

  // Create audio element
  const [audio] = useState(new Audio('/Violette Wautier - ENVY (Official Lyric Video).mp3'));
  const videoConstraints = {
    width: 120,
    height: 120,
    facingMode: "user"
  };
  // Video element ref for webcam stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Create a ref for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webcamRef = React.useRef<Webcam>(null);

  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;
      console.log(imageSrc);
      setImageSrc(imageSrc);

    },
    [webcamRef]
  );
  useEffect(() => {
    // Initialize the audio only on the client side
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('/Violette Wautier - ENVY (Official Lyric Video).mp3');
      audioRef.current.loop = true;
    }
  }, []);

  // Start webcam automatically when the card opens
  useEffect(() => {
    if (isOpen && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.muted = true;
            videoRef.current.play();
          }
        })
        .catch(err => console.error("Error accessing webcam:", err));
    }
  }, [isOpen]);

  // Capture an image from the video feed
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
      }
      // Optionally, stop the stream if you no longer need the live preview:
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle music playback
  useEffect(() => {
    if (isPlaying) {
      audio.currentTime = 8;
      audio.play();

      audio.loop = true;
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [isPlaying, audio]);

  const addHeart = () => {
    const newHeart = {
      id: Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 20 + 10,
      rotation: Math.random() * 360,
    };
    setHearts(prev => [...prev, newHeart]);
  };
 // Function to copy styles & save card as an image with Tailwind applied
 const saveCardAsImage = async () => {
  if (!cardRef.current) return;

  // Clone the element & apply computed styles
  const clone = cardRef.current.cloneNode(true) as HTMLElement;
  const computedStyles = window.getComputedStyle(cardRef.current);


  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = computedStyles.width;
  clone.style.height = computedStyles.height;
  clone.style.padding = computedStyles.padding;
  clone.style.margin = computedStyles.margin;
  clone.style.border = computedStyles.border;
  clone.style.backgroundColor = "#F7CFD8"
  clone.style.fontFamily = computedStyles.fontFamily;
  clone.style.fontSize = computedStyles.fontSize;
  clone.style.color = computedStyles.color;
  clone.style.textAlign = computedStyles.textAlign;
  clone.style.lineHeight = computedStyles.lineHeight;
  clone.style.letterSpacing = computedStyles.letterSpacing;
  clone.style.boxShadow = computedStyles.boxShadow;
  clone.style.borderRadius = computedStyles.borderRadius;
  clone.style.zIndex = "9999";
  clone.style.overflow = "hidden";


  document.body.appendChild(clone); // Append temporarily for styling

  const canvas = await html2canvas(clone, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
  });

  document.body.removeChild(clone); // Remove clone after capture

  // Convert to PNG & Download
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "valentine_card.png";
  link.click();
};


  const toggleGift =() => {
 
    setShowGift(!showGift);
  };

  return (
    <div className="w-screen h-screen max-w-lg mx-auto p-4">
      <div
        className={`relative bg-gradient-to-br from-pink-100 via-pink-50 to-white rounded-2xl shadow-2xl transition-all duration-1000 ease-in-out cursor-pointer overflow-hidden border-4 border-pink-200
          ${isOpen ? 'h-[45rem]' : 'h-80'}`}
        onClick={() => {
          setIsOpen(true);
          addHeart();
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-4 left-4">
          <Star className="text-pink-400 animate-pulse" />
        </div>
        <div className="absolute top-4 right-4">
          <Sparkle className="text-pink-400 animate-pulse" />
        </div>

        {/* Floating hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="absolute animate-bounce"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              transform: `rotate(${heart.rotation}deg)`,
            }}
          >
            <Heart
              size={heart.size}
              className="text-red-500 fill-red-500"
            />
          </div>
        ))}

        {/* Card content */}
        
        <div  ref={cardRef}  className="absolute inset-0 flex flex-col h-full items-center justify-center p-6 text-center">
          {!isOpen ? (
            <div className="space-y-4 animate-pulse">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-pink-300">
                <img
                  src={"/IMG.jpg"}
                  alt="Your special someone"
                  className="w-full h-full object-cover"
                />

              </div>
              <h2 className="text-2xl font-bold text-red-600">Tap to Open ❤️</h2>
              <p className="text-gray-600 font-cursive">A love note just for you...</p>
            </div>
          ) : (
            <div className={`space-y-2 transition-opacity duration-1000 ${showMessage ? 'opacity-100' : 'opacity-0'} flex flex-col  items-center justify-center`}>
              {showWebcam ? (
                <Webcam
                  audio={false}
                  height={120}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-full border-4 border-pink-300 w-40 h-40 mt-10 mb-2"
                  videoConstraints={videoConstraints}
                />
              ) : (
                <img
                  src={imageSrc || "/IMG.jpg"}
                  alt="Your special someone"
                  className="w-40 h-40 object-cover rounded-full border-4 border-pink-300 mt-10 mb-2"
                />
              )}

              <h1 className="text-3xl font-bold text-red-600 font-cursive">Happy Valentine's Day!</h1>
              <div className="space-y-4 text-gray-700">
                <p className="text-xl">
                  To my dearest love, you make every day feel like Valentine's Day! ✨
                </p>
                <p className="text-lg">
                  Your smile brightens my world, your love fills my heart, and your presence makes life beautiful.
                </p>
                <p className="text-2xl font-bold text-red-500 mt-4">
                  I Love You Forever! ❤️
                </p>
              </div>

              {/* Interactive footer section */}
              <div className="mt-8 space-y-6">
                <div className="flex justify-center space-x-8">
                  {/* Music button */}
                  <button
                    className={`p-3 rounded-full transition-all duration-300 ${isPlaying ? 'bg-pink-400 text-white' : 'bg-pink-100 hover:bg-pink-200'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                  >
                    <Music className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} />
                  </button>

                  {/* Camera button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (showWebcam) {
                        const capturedImage = webcamRef.current ? webcamRef.current.getScreenshot() : null;
                        setImageSrc(capturedImage);
                        setShowWebcam(false);

                        
                      } else {
                        setShowWebcam(true);
                      }
                    }}
                    className="p-3 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-pink-600" />
                  </button>

                  {/* Gift button */}
                  <button
                    className={`p-3 rounded-full transition-all duration-300 ${showGift ? 'bg-pink-400 text-white' : 'bg-pink-100 hover:bg-pink-200'}`}
                    onClick={  ()=>{
                      toggleGift();
                      saveCardAsImage();
                    }

                    }
                  >
                    <GiftIcon />
                  </button>
                </div>

                {/* Gift message */}
                <div>
                  {showGift && (
                    <div className="animate-fadeIn bg-pink-50 p-4 rounded-lg shadow-md">
                      <p className="text-pink-600">🎁 Special surprise coming soon! 🎁</p>
                    </div>
                  )}
                </div>



                <div className="text-sm text-gray-500 my-5">
                  <p className="animate-bounce">Keep tapping for more love! 💕</p>
                  <p className="mt-2 text-xs">Made with love for you ❤️</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValentineCard;