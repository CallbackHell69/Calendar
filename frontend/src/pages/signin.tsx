import { useTheme } from "@/components/theme-provider";

import { useEffect, useState } from "react";
import { RiGoogleFill } from "@remixicon/react";
import Particles from "@/components/ui/particles";
import { backend_url } from "@/constant";
const Signin = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <div className="h-[80vh] flex lg:flex-row flex-col lg:items-center gap-2">
      <div className="lg:w-[400px] h-[200px] lg:h-full relative ">
        <div className="absolute p-10">
          <p className="font-custom font-semibold text-black rotate-[-45deg] font-first">
            Clandy
          </p>
        </div>
        <video
          loop
          autoPlay
          muted
          src="https://cdn.dribbble.com/uploads/48292/original/30fd1f7b63806eff4db0d4276eb1ac45.mp4?1689187515"
          style={{
            width: "100%",
            objectFit: "cover",
            height: "100%",
            borderRadius: "40px",
          }}
        />
      </div>
      <div className="relative h-full lg:flex-1  flex items-center justify-center">
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={80}
          color={color}
          refresh
        />
        <div className="z-9 border bg-gray-200 dark:bg-white/10 relative flex flex-col font-another  gap-4 lg:w-1/2 w-full  p-10 md:m-0 mx-4 rounded-2xl">
          <div className="border-b pb-3 flex flex-col gap-2">
            <p className="text-center font-semibold text-2xl font-first">
              Welcome to Clandy
            </p>
            <p className="text-sm font-medium text-center text-gray-500 font-first">
              Your time, seamlessly organized
            </p>
          </div>

          <a
            href={backend_url + "/auth/google"}
            className="bg-green-600 hover:bg-green-500 font-medium font-first rounded-xl py-2  flex items-center justify-center gap-1 text-center"
            type="submit"
          >
            Get started with <RiGoogleFill />
          </a>
          <p className="text-gray-500 font-first text-center">
            Give the required permission to get started with clandy 👀.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
