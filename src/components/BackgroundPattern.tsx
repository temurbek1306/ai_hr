export default function BackgroundPattern() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #f0fdfa 70%, #f8fafc 100%)' }}>
            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 z-0 opacity-[0.5]"
                style={{
                    backgroundImage: `radial-gradient(#d1fae5 1px, transparent 1px)`,
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 100%)'
                }}
            />

            {/* Ambient emerald orb — top left */}
            <div className="absolute top-[-15%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-emerald-100/80 to-green-50/40 blur-[120px]" />

            {/* Ambient teal orb — bottom right */}
            <div className="absolute bottom-[-15%] right-[-5%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tl from-teal-100/70 to-cyan-50/30 blur-[120px]" />

            {/* Soft top fade */}
            <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-white/60 to-transparent z-[2]" />
        </div>
    )
}
