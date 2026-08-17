import { motion } from 'framer-motion'

/**
 * StudyNest Scholarly Owl Mascot Component
 * Supports multiple contextual states with consistent character design:
 * - 'default' / 'reading': Owl holding open book
 * - 'tutor' / 'ai': Owl with graduation cap and thought sparkle
 * - 'studying': Owl with notebook & pencil
 * - 'focus': Cozy owl resting in a study nest
 * - 'break': Sleeping owl with zZz
 * - 'celebrate': Happy celebratory owl with stars
 * - 'streak': Owl holding glowing study flame
 * - 'achievement': Owl with gold trophy/medal
 * - 'tree': Owl on knowledge branch
 * - 'empty': Curious owl
 */
export default function MascotOwl({
  state = 'default',
  size = 'md',
  className = '',
  animate = true
}) {
  const sizeMap = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
    '2xl': 'w-64 h-64'
  }

  const dim = sizeMap[size] || size

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${dim} ${className}`}>
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        animate={animate ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="owlBody" x1="100" y1="60" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8D5B3A" />
            <stop offset="1" stopColor="#5E3821" />
          </linearGradient>
          <linearGradient id="owlBelly" x1="100" y1="100" x2="100" y2="175" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF8ED" />
            <stop offset="1" stopColor="#F6E7D2" />
          </linearGradient>
          <linearGradient id="capBlue" x1="100" y1="20" x2="100" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1C4B82" />
            <stop offset="1" stopColor="#343b1b" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FCD34D" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="nestGrad" x1="100" y1="140" x2="100" y2="195" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A0693B" />
            <stop offset="1" stopColor="#5C381E" />
          </linearGradient>
          <linearGradient id="bookBlue" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#3971b8" />
            <stop offset="1" stopColor="#343b1b" />
          </linearGradient>
        </defs>

        {/* NEST BASE (For 'focus', 'default', 'empty', or 'tree' states) */}
        {(state === 'focus' || state === 'empty' || state === 'tree') && (
          <g id="nest-base">
            <ellipse cx="100" cy="170" rx="72" ry="24" fill="url(#nestGrad)" />
            {/* Twig textures */}
            <path d="M35 168 C60 185, 140 185, 165 168" stroke="#4A2A14" strokeWidth="4" strokeLinecap="round" />
            <path d="M42 162 C75 178, 125 178, 158 162" stroke="#6B3F1D" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M30 174 C70 190, 130 190, 170 174" stroke="#87532B" strokeWidth="3" strokeLinecap="round" />
            {/* Green Nest Leaves */}
            <path d="M28 165 C20 155, 30 148, 38 156 C34 165, 28 165, 28 165 Z" fill="#c8d69b" />
            <path d="M172 165 C180 155, 170 148, 162 156 C166 165, 172 165, 172 165 Z" fill="#c8d69b" />
          </g>
        )}

        {/* TREE BRANCH (For 'tree' state) */}
        {state === 'tree' && (
          <g id="tree-branch">
            <path d="M10 178 C60 172, 140 172, 190 178" stroke="#654321" strokeWidth="12" strokeLinecap="round" />
            <circle cx="170" cy="155" r="14" fill="#c8d69b" />
            <circle cx="185" cy="162" r="10" fill="#78C67D" />
            <circle cx="25" cy="162" r="12" fill="#c8d69b" />
            <polygon points="100,18 104,28 114,29 106,36 109,46 100,40 91,46 94,36 86,29 96,28" fill="#f6e6a5" />
          </g>
        )}

        {/* MAIN OWLET BODY */}
        <ellipse cx="100" cy="115" rx="55" ry="58" fill="url(#owlBody)" />

        {/* OWLET BELLY */}
        <ellipse cx="100" cy="126" rx="38" ry="42" fill="url(#owlBelly)" />
        {/* Soft belly feather markings */}
        <path d="M92 118 Q100 124 108 118" stroke="#D1B898" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M85 132 Q100 140 115 132" stroke="#D1B898" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M90 146 Q100 152 110 146" stroke="#D1B898" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* WINGS */}
        {state === 'celebrate' ? (
          /* Raised Wings for celebration */
          <g id="wings-celebrate">
            <path d="M50 115 C30 85, 35 60, 52 75 C60 90, 62 115, 50 115 Z" fill="#754828" />
            <path d="M150 115 C170 85, 165 60, 148 75 C140 90, 138 115, 150 115 Z" fill="#754828" />
          </g>
        ) : (
          /* Rested / Holding Wings */
          <g id="wings-normal">
            <ellipse cx="52" cy="120" rx="14" ry="32" transform="rotate(15 52 120)" fill="#754828" />
            <ellipse cx="148" cy="120" rx="14" ry="32" transform="rotate(-15 148 120)" fill="#754828" />
          </g>
        )}

        {/* EYES & FACE */}
        {state === 'break' ? (
          /* Sleeping Eyes (Happy curves) */
          <g id="sleeping-eyes">
            <path d="M68 95 Q80 108 92 95" stroke="#343b1b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M108 95 Q120 108 132 95" stroke="#343b1b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* ZZZ Floating */}
            <text x="145" y="70" fill="#3971b8" fontSize="18" fontWeight="800" fontFamily="Poppins">Z</text>
            <text x="160" y="55" fill="#c8d69b" fontSize="14" fontWeight="800" fontFamily="Poppins">z</text>
            <text x="172" y="42" fill="#f6e6a5" fontSize="11" fontWeight="800" fontFamily="Poppins">z</text>
          </g>
        ) : (
          /* Awake Big Scholarly Eyes with Eye Rings */
          <g id="awake-eyes">
            {/* Left Eye White & Ring */}
            <circle cx="78" cy="94" r="22" fill="#FFFFFF" stroke="#D9C3A5" strokeWidth="3" />
            <circle cx="78" cy="94" r="14" fill="#343b1b" />
            <circle cx="73" cy="89" r="5" fill="#FFFFFF" />
            <circle cx="83" cy="98" r="2.5" fill="#FFFFFF" />

            {/* Right Eye White & Ring */}
            <circle cx="122" cy="94" r="22" fill="#FFFFFF" stroke="#D9C3A5" strokeWidth="3" />
            <circle cx="122" cy="94" r="14" fill="#343b1b" />
            <circle cx="117" cy="89" r="5" fill="#FFFFFF" />
            <circle cx="127" cy="98" r="2.5" fill="#FFFFFF" />

            {/* Scholarly Spectacles Frame */}
            <circle cx="78" cy="94" r="23" stroke="#343b1b" strokeWidth="3.5" fill="none" />
            <circle cx="122" cy="94" r="23" stroke="#343b1b" strokeWidth="3.5" fill="none" />
            <path d="M101 94 Q100 88 99 94" stroke="#343b1b" strokeWidth="3.5" fill="none" />
          </g>
        )}

        {/* BEAK */}
        <polygon points="100,102 92,94 108,94" fill="#F59E0B" />

        {/* LITTLE ORANGE FEET */}
        {state !== 'focus' && state !== 'empty' && (
          <g id="feet">
            <ellipse cx="85" cy="172" rx="9" ry="6" fill="#F59E0B" />
            <ellipse cx="115" cy="172" rx="9" ry="6" fill="#F59E0B" />
          </g>
        )}

        {/* GRADUATION CAP (mortarboard) */}
        <g id="grad-cap">
          <polygon points="100,32 158,50 100,66 42,50" fill="url(#capBlue)" stroke="#0E2C54" strokeWidth="1.5" />
          <ellipse cx="100" cy="66" rx="28" ry="9" fill="#343b1b" />
          <circle cx="100" cy="49" r="4" fill="#f6e6a5" />
          {/* Gold Tassel */}
          <path d="M100 49 Q132 54 138 72" stroke="#f6e6a5" strokeWidth="3" fill="none" />
          <polygon points="138,72 134,84 142,84" fill="#f6e6a5" />
        </g>

        {/* CONTEXT ACCESSORIES */}
        {/* State: 'default' / 'reading' / 'focus' -> Open Book */}
        {(state === 'default' || state === 'reading' || state === 'focus') && (
          <g id="open-book">
            {/* Book Cover */}
            <path d="M60 142 Q100 148 100 162 Q100 148 140 142 L136 172 Q100 178 100 188 Q100 178 64 172 Z" fill="url(#bookBlue)" />
            {/* Book Pages */}
            <path d="M63 140 Q100 145 100 159 Q100 145 137 140 L134 168 Q100 173 100 184 Q100 173 66 168 Z" fill="#FFFFFF" />
            {/* Text lines */}
            <line x1="72" y1="148" x2="94" y2="151" stroke="#3971b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="72" y1="156" x2="92" y2="159" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="106" y1="151" x2="128" y2="148" stroke="#3971b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="108" y1="159" x2="128" y2="156" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* State: 'streak' -> Flame */}
        {state === 'streak' && (
          <g id="streak-flame">
            <path d="M100 140 C85 152, 85 168, 100 178 C115 168, 115 152, 100 140 Z" fill="url(#goldGrad)" />
            <path d="M100 150 C92 158, 92 168, 100 174 C108 168, 108 158, 100 150 Z" fill="#EF4444" />
          </g>
        )}

        {/* State: 'tutor' / 'ai' -> Sparkles & Speech Bubble */}
        {(state === 'tutor' || state === 'ai') && (
          <g id="tutor-sparkles">
            <polygon points="160,35 163,43 171,46 163,49 160,57 157,49 149,46 157,43" fill="#f6e6a5" />
            <polygon points="35,45 37,51 43,53 37,55 35,61 33,55 27,53 33,51" fill="#3971b8" />
          </g>
        )}

        {/* State: 'achievement' -> Trophy / Medal */}
        {state === 'achievement' && (
          <g id="trophy-badge">
            <circle cx="100" cy="155" r="16" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2" />
            <polygon points="100,145 103,152 110,153 105,158 106,165 100,161 94,165 95,158 90,153 97,152" fill="#FFFFFF" />
          </g>
        )}

        {/* State: 'celebrate' -> Stars around */}
        {state === 'celebrate' && (
          <g id="celebrate-confetti">
            <circle cx="35" cy="65" r="4" fill="#c8d69b" />
            <circle cx="165" cy="65" r="4" fill="#f6e6a5" />
            <circle cx="175" cy="110" r="3" fill="#3971b8" />
            <circle cx="25" cy="110" r="3" fill="#EF4444" />
            <polygon points="160,25 163,33 171,36 163,39 160,47 157,39 149,36 157,33" fill="#f6e6a5" />
            <polygon points="40,25 43,33 51,36 43,39 40,47 37,39 29,36 37,33" fill="#3971b8" />
          </g>
        )}
      </motion.svg>
    </div>
  )
}
