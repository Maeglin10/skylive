import { Metadata } from "next";
import { CreatorProfileClient } from "@/components/creator/CreatorProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} (@${username}) | Skylive`,
    description: `Watch live streams and exclusive content from ${username} on Skylive. Support your favorite creator and join the community.`,
    openGraph: {
      title: `${username} on Skylive`,
      description: `Premium content and live sessions by ${username}.`,
      images: [`/api/og/creator?username=${username}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${username} | Skylive`,
      description: `Premium content and live sessions by ${username}.`,
    }
  };
}

export default async function CreatorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  return <CreatorProfileClient username={username} />;
}
