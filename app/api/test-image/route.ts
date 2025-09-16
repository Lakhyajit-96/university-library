import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    console.log('Testing image URL:', imageUrl);
    
    // Test if the image URL is accessible
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    return NextResponse.json({
      url: imageUrl,
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type')
    });
  } catch (error) {
    console.error('Error testing image:', error);
    return NextResponse.json({ 
      error: 'Failed to test image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
