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
  imageUrl = "/images/burger.jpg",
  appUrl = window.location.origin
}) => {
  useEffect(() => {
    // Update page title
    document.title = title;
    
    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) ||
                 document.querySelector(`meta[name="${property}"]`);
      
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

    // Farcaster Frame tags
    updateMetaTag('fc:frame', 'vNext');
    updateMetaTag('fc:frame:image', imageUrl);
    updateMetaTag('fc:frame:button:1', 'Play Game');
    updateMetaTag('fc:frame:button:1:action', 'post');
    updateMetaTag('fc:frame:post_url', appUrl);

    // Advanced Farcaster Frame metadata for mini-apps
    const frameMetadata = {
      version: "next",
      imageUrl: imageUrl,
      button: {
        title: "Play Word Game",
        action: {
          type: "launch_frame",
          name: title,
          url: appUrl,
          splashImageUrl: imageUrl,
          splashBackgroundColor: "#667eea"
        }
      }
    };

    // Update or create the main frame meta tag
    let frameMeta = document.querySelector('meta[name="fc:frame"]');
    if (frameMeta) {
      frameMeta.setAttribute('content', JSON.stringify(frameMetadata));
    } else {
      frameMeta = document.createElement('meta');
      frameMeta.setAttribute('name', 'fc:frame');
      frameMeta.setAttribute('content', JSON.stringify(frameMetadata));
      frameMeta.setAttribute('data-rh', 'true');
      document.head.appendChild(frameMeta);
    }

  }, [title, description, imageUrl, appUrl]);

  return null; // This component doesn't render anything
};

export default FarcasterMeta;
