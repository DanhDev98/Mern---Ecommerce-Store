import { Link } from "react-router-dom";
import { Flower, House, Lock, LogIn, LogOut, ShoppingCart, UserPlus } from "lucide-react";
const Navbar = () => {
  const user = false
  const isAdmin = false
  return (
    <header className="fixed top-0 w-full bg-pink-400 opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800 " >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center space-x-2 drop-shadow-lg  ">
          <Flower className="size-6 mr-1" /> ChinChin Fashion
        </Link>

        <nav className="flex flex-wrap items-center gap-4">
          <Link to={"/"} className="flex flex-nowrap items-center font-medium  group "><House className="size-5  group-hover:text-pink-950 mr-1" />
            <span className="hidden sm:inline font-medium   group-hover:text-pink-950">Home</span>
          </Link>
          {user && (
            <Link to={"/cart"} className="relative group flex flex-nowrap items-center">
              <ShoppingCart className=" mr-1 group-hover:text-pink-950 size-5 inline-block " />
              <span className="hidden sm:inline font-medium   group-hover:text-pink-950">Cart</span>
              <span className="absolute sm:-top-2 sm:right-11 -top-2 right-4 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs group-hover:bg-green-700 transition duration-300 ease-in-out">
                3
              </span>
            </Link>
          )}

          {isAdmin && (
            <Link to={"/"} className="flex flex-nowrap items-center font-medium  group duration-300 bg-green-600 rounded-md px-3 py-1" >
              <Lock className="mr-1 group-hover:text-pink-950 size-5 inline-block " />
              <span className="hidden sm:inline font-medium   group-hover:text-pink-950" >Dashboard</span>
            </Link>
          )}
          {user ? (
            <Link to={"/logout"} className="flex flex-nowrap items-center font-medium  group uration-300 bg-red-600 rounded-md px-3 py-1 ">
              <LogOut className="size-5  group-hover:text-pink-950 mr-1" />
              <span className="hidden sm:inline font-medium   group-hover:text-pink-950" >Logout</span>
            </Link>) : (
            <>
              <Link to={"/login"} className="flex flex-nowrap items-center font-medium  group uration-300 bg-blue-600 rounded-md px-3 py-1 ">
                <LogIn className="size-5  group-hover:text-pink-950 mr-1" />
                <span className="hidden sm:inline font-medium   group-hover:text-pink-950" >Login</span>
              </Link>
              <Link to={"/signup"} className="flex flex-nowrap items-center font-medium  group uration-300 bg-green-600 rounded-md px-3 py-1 ">
                <UserPlus className="size-5  group-hover:text-pink-950 mr-1" />
                <span className="hidden sm:inline font-medium   group-hover:text-pink-950" >SignUp</span>
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;
