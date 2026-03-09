const FilmGrain = () => (
  <>
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.65"
            numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
          <feBlend in="SourceGraphic" in2="grey" mode="overlay" />
        </filter>
      </defs>
    </svg>
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 0.035,
        filter: "url(#grain-filter)",
        width: "100%",
        height: "100%",
      }}
    />
  </>
);

export default FilmGrain;
