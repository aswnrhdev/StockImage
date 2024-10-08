import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../services/api'
import { setCredentials } from '../../store/slices/authSlice'
import { z } from 'zod';
import { IoMdImage } from "react-icons/io";

// Define the Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate form data
      loginSchema.parse(formData);
      
      // If validation passes, proceed with login
      const response = await login(formData.email, formData.password)
      dispatch(setCredentials({ token: response.data.token, user: response.data }))
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Set validation errors
        const errorMap: Partial<LoginFormData> = {};
        err.errors.forEach((error) => {
          if (error.path) {
            errorMap[error.path[0] as keyof LoginFormData] = error.message;
          }
        });
        setErrors(errorMap);
      } else {
        setErrors({ email: 'Invalid email or password' });
      }
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8 font-outfit"
      style={{
        backgroundImage: "url('public/youth-groups-with-pop-inspired-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-6 sm:p-10 bg-[#EEEEEE] rounded shadow-md">
        <h2 className="flex items-center justify-center gap-1">Stock Image <IoMdImage /></h2>
        <h2 className="mb-6 text-sm sm:text-base text-center">Login to access stock images.</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded focus:outline-none"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-[#DC5F00] rounded hover:bg-[#373A40] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base transition-colors duration-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm sm:text-base">
          <Link to="/reset-password" className="text-[#DC5F00] hover:underline">Forgot Password?</Link>
        </div>
        <p className="mt-4 text-center text-sm sm:text-base">
          Don't have an account? <Link to="/register" className="text-[#DC5F00] hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login