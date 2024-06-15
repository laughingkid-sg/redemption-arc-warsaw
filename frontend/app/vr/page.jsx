import React from "react";

const VR = () => {
  return (
    <section className="w-full h-full flex flex-col items-center">
      <div className="text-2xl font-bold mt-5">Taylor Swift Eras Tour 360 Livestream</div>
      <div>Put on your VR headset and experience the concert in the comfort of your own home!</div>
      <iframe
        src="https://www.youtube.com/embed/_DdeQybDzAo?si=FtaNeVZ6qd1GZjpr"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen="true"
        className="w-2/3 aspect-video mt-5"
      />
      {/* <video className="w-2/3 aspect-video mt-20" controls preload="none">
        <source src="/videos/tswift-vr.mp4" type="video/mp4" />
      </video> */}
    </section>
  );
};

export default VR;
