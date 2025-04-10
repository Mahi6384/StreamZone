// src/components/Videos.jsx
import React from "react";

const videos = [
  {
    id: 1,
    title: "Title 1",
    creator: "FullStack Proj",
    thumbnail: "https://dummyimage.com/320x180/cccccc/000000&text=No+Thumbnail",
  },
  {
    id: 2,
    title: "Title 2",
    creator: "StreamZone",
    thumbnail: "https://dummyimage.com/320x180/cccccc/000000&text=No+Thumbnail",
  },
  {
    id: 3,
    title: "Title 3",
    creator: "CodeWithMahi",
    thumbnail: "https://dummyimage.com/320x180/cccccc/000000&text=No+Thumbnail",
  },
  // add more dummy videos here
];

const Videos = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div
          key={video.id}
          className="card bg-base-100 shadow-md hover:scale-105 transition-transform"
        >
          <figure>
            <img src={video.thumbnail} alt={video.title} className="w-full" />
          </figure>
          <div className="card-body p-4">
            <h2 className="card-title text-base">{video.title}</h2>
            <p className="text-sm text-gray-500">{video.creator}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Videos;
