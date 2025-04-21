'use client'
import type { FC } from 'react'
import classNames from '@/utils/classnames'

type LogoProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: FC<LogoProps> = ({ width = 512, height = 512, className = '' }) => {
  // SVG 코드를 데이터 URL로 인코딩
  const svgCode = `
    <svg width="${width}" height="${height}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6a0dad;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#9370DB;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="256" cy="256" r="240" fill="url(#gradient)" />
      <text x="100" y="280" font-family="Arial, sans-serif" font-size="140" font-weight="bold" fill="white">AX</text>
      <text x="100" y="350" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white">Playground</text>
    </svg>
  `.trim()

  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    svgCode,
  )}`

  return (
    <img
      src={svgDataUrl}
      width={width}
      height={height}
      className={classNames(className)}
      alt="AX Playground Logo"
    />
  )
}

export default Logo
