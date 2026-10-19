/** Retired auth URLs only redirect. Never exchange codes or retain OAuth query data. */
export function GET(request: Request) {
  return Response.redirect(new URL("/", request.url), 307);
}
