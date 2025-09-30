// Custom image loader to bypass Next.js optimization for specific domains
export default function customImageLoader({ src }: { src: string }) {
  return src;
}
