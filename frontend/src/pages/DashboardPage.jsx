import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { motion } from "motion";
import AnalyticsChart from "../components/AnalyticsChart";
import ProductList from "../components/ProductList";
import CreateProductForm from "../components/CreateProductForm";
const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const DashboardPage = () => {
  const [active, setActive] = useState("create");
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden ">
      <div className="relative z-10 container mx-auto px-4 py-16 ">
        <motion.h1
          className="text-4xl font-bold mb-8 text-pink-500 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tabs.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                active === tab.id
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-pink-500"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {active === "create" && <CreateProductForm />}
        {active === "products" && <ProductList />}
        {active === "analytics" && <AnalyticsChart />}
      </div>
    </div>
  );
};

export default DashboardPage;
