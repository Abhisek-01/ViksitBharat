import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub:1,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Viksit Bharat
        </p>

        <AnimatedTitle
          title="Empo<b>wering</b>ver Citizens to <br />Shape Their City’s <b>F</b>uture "
          containerClass="mt-5 !text-black text-center"
        /> 

        <div className="about-subtext">
          <p>Imagine a city where every voice is heard, every issue is tracked, 
            and every resolution is visible.</p>
          <p className="text-gray-500">
            
This platform makes that vision a reality — by giving citizens the power to report local issues instantly, track their progress in real-time, and hold systems accountable.
It’s not just an app — it’s a movement to make governance open, participatory, and impactful.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.png"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
