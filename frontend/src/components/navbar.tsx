import { RiCalendar2Line } from "@remixicon/react";
import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router-dom";
import { RainbowButton } from "./ui/rainbow-button";
import { BorderBeam } from "./ui/border-beam";
import { useContext } from "react";
import { con } from "@/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { backend_url } from "@/constant";
import axios from "axios";
const Navbar = () => {
  const data = useContext(con);
  const handleLogout = async () => {
    try {
      await axios.get(backend_url + "/logout", { withCredentials: true });
      data.setUser({ name: "", email: "", image: "" });
      data.setIsLoggedIn(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex items-center border  rounded-xl py-4 px-4 mx-5 relative">
      <BorderBeam size={50} duration={60} delay={9} />
      <div className="flex items-center gap-3">
        <RiCalendar2Line className="text-gray-500" size={30} />
        <Link to="/" className="text-2xl font-semibold font-first">
          Clandy
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        {!data.isLoggedIn ? (
          <RainbowButton>
            <Link to="/signin" className="font-first font-semibold">
              Get Started
            </Link>
          </RainbowButton>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="font-first">
                <Button>Profile</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-first">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <img
                    src={data.user.image}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <p>{data.user.name}</p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <p className="text-gray-500">{data.user.email}</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-end">
                  <Button
                    className="bg-red-600 hover:bg-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Log out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
