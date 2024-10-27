import { RainbowButton } from "@/components/ui/rainbow-button";
import Ripple from "@/components/ui/ripple";
import { RiGithubFill } from "@remixicon/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
const Home = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <div className="relative flex h-[90vh] w-full flex-col items-center justify-center gap-5 md:gap-10 overflow-hidden  rounded-xl md:shadow-xl px-2">
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="z-10 font-first uppercase whitespace-pre-wrap text-center text-4xl md:text-5xl font-semibold  tracking-tighter "
      >
        Your time, seamlessly organized.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="z-10 font-first text-gray-500 whitespace-pre-wrap text-center font-medium md:text-2xl  tracking-tighter  md:w-8/12"
      >
        Effortlessly manage your schedule and stay connected with a single login
        – sync, organize, and conquer your day with ease!
      </motion.p>
      <RainbowButton>
        <Link
          to=""
          className="flex items-center font-first gap-3 font-semibold "
        >
          <RiGithubFill size={30} />
        </Link>
      </RainbowButton>
      <Ripple />
    </div>
  );
};

export default Home;
