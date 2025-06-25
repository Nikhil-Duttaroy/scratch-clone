export default function DogSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="95"
      height="100"
      viewBox="0 0 95 100"
      version="1.1"
      xmlSpace="preserve"
    >
      <g>
        {/* Tail */}
        <g id="tail">
          <path
            d="M 18 75 Q 10 70 8 60 Q 6 50 12 52 Q 18 54 20 65 Q 22 76 18 75 Z"
            stroke="#001026"
            strokeWidth="1.2"
            fill="#C68642"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {/* Back Leg */}
        <path
          d="M35,85 Q30,95 20,95 Q15,95 18,90 Q21,85 28,83 Q35,81 35,85 Z"
          stroke="#001026"
          strokeWidth="1.2"
          fill="#C68642"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Body */}
        <g id="body-and-leg">
          <ellipse
            cx="50"
            cy="70"
            rx="25"
            ry="20"
            stroke="#001026"
            strokeWidth="1.2"
            fill="#C68642"
          />
          {/* Belly */}
          <ellipse
            cx="50"
            cy="78"
            rx="12"
            ry="7"
            fill="#FFF8E1"
            strokeWidth="1"
          />
        </g>
        {/* Front Leg */}
        <path
          d="M65,85 Q70,95 80,95 Q85,95 82,90 Q79,85 72,83 Q65,81 65,85 Z"
          stroke="#001026"
          strokeWidth="1.2"
          fill="#C68642"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Head */}
        <g id="head">
          {/* Head shape */}
          <ellipse
            cx="55"
            cy="35"
            rx="22"
            ry="20"
            stroke="#001026"
            strokeWidth="1.2"
            fill="#C68642"
          />
          {/* Face */}
          <ellipse
            cx="55"
            cy="40"
            rx="15"
            ry="12"
            fill="#FFF8E1"
            strokeWidth="1"
          />
          {/* Left Ear */}
          <path
            d="M38 20 Q30 10 40 8 Q50 6 45 20 Z"
            stroke="#001026"
            strokeWidth="1.2"
            fill="#8D5524"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Ear */}
          <path
            d="M72 20 Q80 10 70 8 Q60 6 65 20 Z"
            stroke="#001026"
            strokeWidth="1.2"
            fill="#8D5524"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Eyes */}
          <ellipse
            cx="48"
            cy="38"
            rx="2.5"
            ry="3"
            fill="#FFFFFF"
            stroke="#001026"
            strokeWidth="1.2"
          />
          <ellipse
            cx="62"
            cy="38"
            rx="2.5"
            ry="3"
            fill="#FFFFFF"
            stroke="#001026"
            strokeWidth="1.2"
          />
          {/* Pupils */}
          <ellipse
            cx="48"
            cy="39"
            rx="1"
            ry="1.2"
            fill="#001026"
          />
          <ellipse
            cx="62"
            cy="39"
            rx="1"
            ry="1.2"
            fill="#001026"
          />
          {/* Nose */}
          <ellipse
            cx="55"
            cy="44"
            rx="2"
            ry="1.2"
            fill="#001026"
          />
          {/* Mouth */}
          <path
            d="M53 46 Q55 48 57 46"
            stroke="#001026"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
