import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || 'Stream';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'white',
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          border: '20px solid #9E398D'
        }}
      >
        <div style={{ background: 'red', color: 'white', padding: '10px 30px', borderRadius: '50px', fontSize: 30, marginBottom: '40px', fontWeight: 'black', textTransform: 'uppercase' }}>LIVE NOW</div>
        <div style={{ fontSize: 80, fontWeight: 'black' }}>AeviaLive Session</div>
        <div style={{ fontSize: 30, marginTop: '40px', color: '#939AA1', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          JOIN THE CONVERSATION
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
