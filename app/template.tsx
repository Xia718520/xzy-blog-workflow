import React from 'react'

import { MiniTerminal } from '~/components/mini-terminal'

// 全站外壳模板：每次路由切换重建，挂载迷你终端等全局玩具
export default function Template({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      {children}
      <MiniTerminal />
    </>
  )
}
