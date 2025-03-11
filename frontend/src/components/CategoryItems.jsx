import React from "react";
import { Link } from "react-router-dom";

const CategoryItems = ({ cate }) => {
  return (
    <div className="relative overflow-hidden h-96 w-full rounded-lg group">
      <Link to={"/category" + cate.href}>
        <div className="w-full h-full cursor-pointer">
          <div className="inset-0 absolute bg-gradient-to-b from-transparent to-gray-900 opacity-90 z-10">
            <img
              src={cate.imageUrl}
              alt={cate.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 "
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <h3 className="text-pink-500 text-2xl font-bold mb-2">
                {cate.name}
              </h3>
              <p className="text-pink-500 text-sm">Explore {cate.name} </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItems;
