import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-14  absolute top-0 left-0 flex z-10 bg-linear-to-l from-purple-400/20 to-purple-200/60">
      <div className="flex h-full w-full justify-between pr-4 pl-4 text-center items-center">
        <div>Chess</div>
        <div>
          <div className="h-10 w-10 rounded-full  flex items-center justify-center">
            <button
              onClick={() => navigate("/loginPage")}
              className="w-full h-full hover:cursor-pointer rounded-full  "
            >
              <CgProfile className="h-full w-full text-black " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
