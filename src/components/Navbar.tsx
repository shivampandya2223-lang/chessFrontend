import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { logout, isLoggedIn } from "../utils/auth";
import { useState } from "react";
import { RiGroupFill } from "react-icons/ri";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [showBtn, setShowBtn] = useState(false);

  const handleClick = () => {
    if (isLoggedIn()) {
      setShowBtn(!showBtn);
    } else {
      navigate("/loginPage");
    }
  };

  const handleLogout = () => {
    logout();
    setShowBtn(false);
  };

  return (
    <div className="w-screen h-14 absolute top-0 left-0 flex z-10 bg-linear-to-l from-purple-400/20 to-purple-200/60">
      <div className="flex h-full w-full justify-between pr-4 pl-4 text-center items-center">
        <div>Chess</div>
        <div className="flex items-center gap-4">
          <div>
            <RiGroupFill className="text-2xl flex" />
          </div>
          <div>{username}</div>
          <div className="h-10 w-10 rounded-full flex items-center justify-center">
            <button
              onClick={handleClick}
              className="w-full h-full hover:cursor-pointer rounded-full"
            >
              <CgProfile className="h-full w-full text-black" />
            </button>
          </div>
          {showBtn && (
            <div>
              <button
                className="bg-red-500 p-2 rounded-xl text-white hover:cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
