import { Metadata } from "next";
import { LiveClient } from "@/components/live/LiveClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Live Stream ${id} | Skylive`,
    description: `Watch live stream on Skylive. Real-time interaction and exclusive content.`,
    openGraph: {
      title: `Live on Skylive`,
      images: [`/api/og/live?id=${id}`],
    }
  };
}

export default async function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <LiveClient id={id} />;
}
