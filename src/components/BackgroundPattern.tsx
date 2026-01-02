export default function BackgroundPattern() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-white">
            {/* Subtle Noise Texture overlay for premium feel */}
            <div
                className="absolute inset-0 opacity-[0.4] mix-blend-overlay z-[1]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* High-end Dot Grid Pattern */}
            <div
                className="absolute inset-0 z-0 opacity-[0.6]"
                style={{
                    backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
                }}
            />

            {/* Aurora / Spotlight Effect - Extremely subtle */}
            <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-indigo-50/50 to-purple-50/50 blur-[130px] opacity-60" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-gradient-to-tl from-blue-50/50 to-cyan-50/50 blur-[130px] opacity-60" />

            {/* Top Light Accent */}
            <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white to-transparent z-[2]" />
        </div>
    )
}
