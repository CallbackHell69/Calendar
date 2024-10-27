import { Link } from "react-router-dom";
import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiTwitterXFill,
} from "@remixicon/react";
const Footer = () => {
  return (
    <div className="font-first flex md:flex-row flex-col md:items-center mx-5 border-t py-3">
      <div>
        <Link to="/" className="text-2xl font-semibold">
          Clandy 🇮🇳
        </Link>
        <p className="text-gray-500"> Your time, seamlessly organized.</p>
      </div>
      <div className="flex-1 flex flex-col items-end gap-3">
        <div className="flex items-center gap-2">
          <RiGithubFill />
          <RiLinkedinBoxFill />
          <RiTwitterXFill />
        </div>
        <p className="text-gray-500">Made with ❤️ By Arpit Blagan</p>
      </div>
    </div>
  );
};

export default Footer;
