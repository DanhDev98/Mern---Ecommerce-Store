import { motion } from 'framer-motion';
import { useState } from 'react';
import { Key, Loader, Mail, User, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
const SignUpPage = () => {
  const loading = false
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="flex flex-col justify-center  py-12 sm:px-6 lg:px-8">
      <motion.div
        className='sm:mx-auto sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className='mt-6 text-center text-3xl font-extrabold text-white'> Create your account</h2>
      </motion.div>
      <motion.div
        className='mt-8 sm:mx-auto sm:mx-full sm:w-full sm:max-w-md'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-x-6 space-y-3  '>
            <div className='mr-0 mb-4'>
              <label htmlFor="name" className='block mb-1 text-sm font-medium text-gray-300'>Fullname</label>
              <div className='mt-1 relative rounded-md shadow-sm w-full block'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <User className='h-5 w-5 text-white' aria-hidden="true" />
                </div>
                <input id='name'
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='block w-full box-border pl-10 px-3 py-2 border border-gray-600
                   bg-gray-700 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  placeholder='Danhdev'
                />
              </div>
            </div>

            {/* // Email */}
            <div className='mr-0 mb-4'>
              <label htmlFor="email" className='block mb-1 text-sm font-medium text-gray-300'>Email</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-white' aria-hidden="true" />
                </div>
                <input id='email'
                  name='email' type='email'
                  autoComplete='email' required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='block box-border w-full pl-10 px-3 py-2 border border-gray-600
                   bg-gray-700 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  placeholder='example@gmail.com'
                />
              </div>
            </div>
            {/* password */}
            <div className='mr-0 mb-4'>
              <label htmlFor="password" className='block mb-1 text-sm font-medium text-gray-300'>Password</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Key className='h-5 w-5 text-white' aria-hidden="true" />
                </div>
                <input id='password'
                  name='password' type='password'
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='block box-border w-full pl-10 px-3 py-2 border border-gray-600
                   bg-gray-700 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  placeholder='••••••'
                />
              </div>
            </div>

            <div className='mr-0 mb-4'>
              <label htmlFor="confirmpassword" className='block mb-1 text-sm font-medium text-gray-300'>Confirm Password</label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Key className='h-5 w-5 text-white' aria-hidden="true" />
                </div>
                <input id='confirmpassword'
                  type='password'
                  required
                  value={formData.confirmpassword}
                  onChange={(e) => setFormData({ ...formData, confirmpassword: e.target.value })}
                  className='block box-border w-full pl-10 px-3 py-2 border border-gray-600
                   bg-gray-700 rounded-md shadow-sm  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  placeholder='••••••'
                />
              </div>
            </div>

            <button className='w-full mt-5 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400'
              type='submit'
              disabled={loading}

            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden='true' />Loading ...
                </>) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden='true' />Sign Up
                </>
              )}
            </button>


          </form>
          <p className='mt-8 text-center text-sm text-gray-400'>
            Already have an account?{" "}
            <Link to="/login" className='font-medium text-pink-400 hover:text-gray-300'>
              Login here
            </Link>
          </p>

        </div>

      </motion.div >
    </div >
  )
};

export default SignUpPage;
