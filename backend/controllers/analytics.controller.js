import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDay = new Date();
    const startDay = new Date(endDay.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySaleData = await getDailySaleData(startDay, endDay);

    res.json({ analyticsData, dailySaleData });
  } catch (error) {
    console.log("error from getAnalytics", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAnalyticsData = async () => {
  const totalProducts = await Product.countDocuments({});
  const totalUsers = await User.countDocuments({});
  const saleData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const { totalSales, totalRevenue } = saleData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

const getDailySaleData = async (startDay, endDay) => {
  try {
    const dailySaleData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDay, $lte: endDay },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const daysArray = getDaysArray(startDay, endDay);

    return daysArray.map((day) => {
      const data = dailySaleData.find((item) => item._id === day);
      return {
        date: day,
        totalSales: data?.totalSales || 0,
        totalRevenue: data?.totalRevenue || 0,
      };
    });
  } catch (error) {
    console.log("error from getDailySaleData", error.message);
    throw new Error("Failed to get daily sale data");
  }
};

const getDaysArray = (startDay, endDay) => {
  const dates = [];
  let currentDate = new Date(startDay);
  while (currentDate <= endDay) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
