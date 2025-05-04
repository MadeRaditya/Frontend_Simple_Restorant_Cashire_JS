import React from 'react'

export default function CircleBackground() {
  return (
    <svg
        className="inset-0 -mt-2 blur-3xl"
        style={{ zIndex: -1 }}
        fill="none"
        viewBox="0 0 400 100"
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        >
        <g clipPath="url(#clip0_10_20)">
            <g filter="url(#filter0_f_10_20)">
            <path
                d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                fill="url(#gradient)"
            ></path>
            <path
                d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                fill="url(#gradient)"
            ></path>
            <path
                d="M320 400H400V78.75L106.2 134.75L320 400Z"
                fill="url(#gradient)"
            ></path>
            <path
                d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                fill="url(#gradient)"
            ></path>
            </g>
        </g>
        <defs>
            <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="720.666"
            id="filter0_f_10_20"
            width="720.666"
            x="-160.333"
            y="-160.333"
            >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"></feBlend>
            <feGaussianBlur result="effect1_foregroundBlur_10_20" stdDeviation="80.1666"></feGaussianBlur>
            </filter>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0000FF', stopOpacity: 1 }}></stop>
            <stop offset="100%" style={{ stopColor: '#800080', stopOpacity: 1 }}></stop>
            </linearGradient>
        </defs>
    </svg>
  )
}
