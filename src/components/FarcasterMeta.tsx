import { useEffect } from 'react';

interface FarcasterMetaProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  appUrl?: string;
}

const FarcasterMeta: React.FC<FarcasterMetaProps> = ({
  title = "Word Guessing Game",
  description = "Guess the 6-letter word from the image clues! Fun word puzzle game.",
  imageUrl = "https://what-the-gger.vercel.app/images/ggger.png",
  appUrl = "https://what-the-gger.vercel.app"
}) => {
  useEffect(() => {
    // Update page title
    document.title = title;
    
    // Update or create meta tags with proper property attribute
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', imageUrl);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', appUrl);

    // Farcaster Frame tags - proper format
    updateMetaTag('fc:frame', 'vNext');
    updateMetaTag('fc:frame:image', imageUrl);
    updateMetaTag('fc:frame:image:aspect_ratio', '1.91:1');
    updateMetaTag('fc:frame:button:1', 'Play Word Game');
    updateMetaTag('fc:frame:button:1:action', 'post');
    updateMetaTag('fc:frame:post_url', `${appUrl}/api/frame`);

    // Open Frames tags for mini-app support
    updateMetaTag('of:version', 'vNext');
    updateMetaTag('of:accepts:farcaster', 'vNext');
    updateMetaTag('of:image', imageUrl);

  }, [title, description, imageUrl, appUrl]);

  return null; // This component doesn't render anything
};

export default FarcasterMeta;
