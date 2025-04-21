'use client'
import type { FC } from 'react'
import classNames from '@/utils/classnames'
import Logo from './Logo'

type LogoSiteProps = {
  className?: string;
}

const LogoSite: FC<LogoSiteProps> = ({ className }) => {
  return (
    <Logo
      width={22.651}
      height={24.5}
      className={classNames('block w-[22.651px] h-[24.5px]', className)}
      alt="logo"
    />
  )
}

export default LogoSite
