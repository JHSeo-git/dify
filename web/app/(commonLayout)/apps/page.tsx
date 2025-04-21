'use client'
import Apps from './Apps'
import { useEducationInit } from '@/app/education-apply/hooks'

const AppList = () => {
  useEducationInit()

  return (
    <div className="relative flex h-0 shrink-0 grow flex-col overflow-y-auto bg-background-body">
      <Apps />
    </div>
  )
}

export default AppList
