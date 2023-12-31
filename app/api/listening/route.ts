import { NextResponse, type NextRequest } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const response = await getNowPlaying();

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({
      isPlaying: false
    }, {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }

  const song = await response.json();

  if (song.item === null) {
    return NextResponse.json({
      isPlaying: false
    }, {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[1].url;
  const songUrl = song.item.external_urls.spotify;

  return NextResponse.json({
    isPlaying,
    title,
    artist,
    album,
    albumImageUrl,
    songUrl
  }, {
    status: 200,
    headers: {
      'content-type': 'application/json',
    }
  })
}
