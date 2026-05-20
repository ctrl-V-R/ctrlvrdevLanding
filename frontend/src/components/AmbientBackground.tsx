import React from 'react'

export default function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top-left indigo bloom */}
      <div className="orb-1 absolute -top-48 -left-32 h-[560px] w-[560px] rounded-full bg-indigo-500/10 blur-[120px]" />
      {/* Right-center violet bloom */}
      <div className="orb-2 absolute top-1/3 -right-32 h-[440px] w-[440px] rounded-full bg-violet-500/10 blur-[110px]" />
      {/* Bottom-center cyan bloom */}
      <div className="orb-3 absolute -bottom-24 left-[30%] h-[380px] w-[380px] rounded-full bg-cyan-500/8 blur-[100px]" />
    </div>
  )
}
