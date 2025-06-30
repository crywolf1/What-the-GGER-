import { useEffect } from 'react';

interface FarcasterMetaProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  appUrl?: string;
  splashBackgroundColor?: string;
}

const FarcasterMeta: React.FC<FarcasterMetaProps> = ({
  title = "Word Guessing Game",
  description = "Guess the 6-letter word from the image clues! Fun word puzzle game.",
  imageUrl = "https://what-the-gger.vercel.app/images/ggger.png",
  appUrl = "https://what-the-gger.vercel.app",
  splashBackgroundColor = "#F2B149"
}) => {
  useEffect(() => {
    // Update page title
    document.title = title;
    
    // Update or create Open Graph meta tags
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

    // Farcaster Frame metadata - Mini App format (using name attribute like your working example)
    const frameMetadata = {
      version: "next",
      imageUrl: imageUrl,
      button: {
        title: title,
        action: {
          type: "launch_frame",
          name: title,
          url: appUrl,
          splashImageUrl: imageUrl,
          splashBackgroundColor: splashBackgroundColor
        }
      }
    };

    // Update or create the main frame meta tag using name attribute
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

  }, [title, description, imageUrl, appUrl, splashBackgroundColor]);

  return null; // This component doesn't render anything
};

export default FarcasterMeta;
