import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Beautiful animation primitives for engineers and designers.';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // If no title is provided, default to 'Motion Components'
    const title = searchParams.get('title') || 'Motion Components';
    
    return new ImageResponse(
        (
            <div
                style={{
                    backgroundColor: '#ffffff',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '80px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                }}
            >
                <div style={{ color: '#737373', fontSize: 32, fontWeight: 500 }}>
                    Gidl
                </div>

                <div style={{
                    color: '#000000',
                    fontSize: 72,
                    lineHeight: 1.1,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <div>{title}</div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
