import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import ProductCardItem from "../components/ProductCardItem"


const PeopleAlsoBought = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axiosInstance.get("/products/recommendPro");
                setRecommendations(res.data);
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRecommendations();
    }, [])
    return (
        <div className='mt-8'>
            <h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
            <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg: grid-col-4'>
                {recommendations.map((product) => (
                    <ProductCardItem key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default PeopleAlsoBought