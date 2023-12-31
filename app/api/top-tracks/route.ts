import { Term } from "@/app/context/term-context";
import { getTopTracks } from "@/lib/spotify";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const term = searchParams.get('term')
  const limit = searchParams.get('limit')

  const DEFAULT = 50
  const newLimit = limit === null ? DEFAULT : +limit

  const response = await getTopTracks(term as Term, newLimit)
  const { items } = await response.json()

  const tracks = items.map((track: any) => ({
    // @ts-ignore
    artist: track.artists.map(artist => artist.name).join(', '),
    songUrl: track.external_urls.spotify,
    title: track.name,
    albumImageUrl: track.album.images[1].url,
    term,
    track_id: track.id
  }))

  return NextResponse.json(tracks, {
    status: 200,
    headers: {
      'content-type': 'application/json',
    }
  })
}