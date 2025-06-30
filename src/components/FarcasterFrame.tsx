import React from 'react';

interface FarcasterFrameProps {
  imageUrl: string;
  title: string;
  description: string;
  actionUrl: string;
}

const FarcasterFrame: React.FC<FarcasterFrameProps> = ({
  imageUrl,
  title,
  description,
  actionUrl,
}) => {
  // Generate the frame metadata that would be used in the HTML head
  const frameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': imageUrl,
    'fc:frame:post_url': actionUrl,
    'fc:frame:button:1': 'Play Game',
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
  };

  return (
    <div className="farcaster-frame">
      <div className="frame-preview">
        <h3>Farcaster Frame Preview</h3>
        <p>This is how your game will appear in Farcaster:</p>
        <div className="frame-card">
          <img src={imageUrl} alt={title} className="frame-image" />
          <div className="frame-content">
            <h4>{title}</h4>
            <p>{description}</p>
            <button className="frame-button">Play Game</button>
          </div>
        </div>
        
        <details className="frame-metadata">
          <summary>Frame Metadata (for developers)</summary>
          <pre>{JSON.stringify(frameMetadata, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
};

export default FarcasterFrame;
