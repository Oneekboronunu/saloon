import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 15,
          background: '#0B0B0B',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C8A24D',
          borderRadius: '8px',
          border: '1.5px solid #C8A24D',
          fontWeight: 800,
          fontFamily: 'serif',
          letterSpacing: '0.5px',
        }}
      >
        GC
      </div>
    ),
    {
      ...size,
    }
  );
}
