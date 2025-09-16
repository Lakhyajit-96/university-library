"use client";
import React from "react";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";

const BookVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <IKVideo 
        path={videoUrl} 
        controls={true} 
        className="rounded-xl"
        style={{ width: '645px', height: '396px' }}
      />
    </ImageKitProvider>
  );
};
export default BookVideo;
