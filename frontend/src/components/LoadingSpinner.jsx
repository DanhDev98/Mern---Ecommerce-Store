import { Loader } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen animate-spin text-pink-500 ">
      <Loader size={40} />
    </div>
  );
};

export default LoadingSpinner;
