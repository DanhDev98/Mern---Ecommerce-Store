import { ShoppingCart } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import toast from "react-hot-toast"
import { useCartStore } from "../store/useCartStore"


const ProductCard = ({ product }) => {
    const { user } = useAuthStore()
    const { addToCart } = useCartStore()
    console.log(product)
    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please Login To Add Cart", { id: "login" })
        } else {
            addToCart(product)
        }
    }

    return (
        <div className='flex  w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
            <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
                <img className='object-cover w-full' src={product.image} alt='product image' />
            </div>

            <div className='mt-4 px-5 pb-5 '>
                <h5 className='text-lg font-semibold tracking-tight text-white text-center'>{product.name}</h5>
                <div className='mt-2 mb-5 flex items-center justify-center '>
                    <p>
                        <span className='text-xl font-bold text-emerald-400  '>{product.price} VND</span>
                    </p>
                </div>
                <button
                    className='flex cursor-pointer items-center w-full justify-center rounded-lg bg-pink-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-300'
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={22} className='mr-2' />
                    Add to cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard