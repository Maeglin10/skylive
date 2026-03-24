import { ImageResponse } from 'next/og';
// Next.js 15 OG API
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'Skylive User';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: '#000000',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          border: '1px solid #9E398D'
        }}
      >
        <div style={{ fontWeight: 'black', marginBottom: '20px', color: '#9E398D' }}>SKYLIVE</div>
        <div style={{ fontSize: 80, fontWeight: 'bold' }}>@{username}</div>
        <div style={{ fontSize: 30, marginTop: '40px', color: '#939AA1', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Premium Live Streaming
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
