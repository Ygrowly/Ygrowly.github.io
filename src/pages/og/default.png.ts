import type { APIRoute } from 'astro'
import { defaultOgPng } from '@/lib/og'

export const prerender = true

export const GET: APIRoute = async () => {
  const png = await defaultOgPng({
    name: 'Ygrowly',
    tagline: 'AI Application · Python Backend · Agent Engineering'
  })
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}
