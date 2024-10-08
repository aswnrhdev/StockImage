import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/api'
import { setCredentials } from '../../store/slices/authSlice'
import { IoMdImage } from "react-icons/io";
import { z } from 'zod';

// Define the Zod schema for form validation
const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
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
            registerSchema.parse(formData);

            // If validation passes, proceed with registration
            const response = await register(formData.name, formData.email, formData.password)
            dispatch(setCredentials({ token: response.data.token, user: response.data }))
            navigate('/dashboard')
        } catch (err) {
            if (err instanceof z.ZodError) {
                // Set validation errors
                const errorMap: Partial<RegisterFormData> = {};
                err.errors.forEach((error) => {
                    if (error.path) {
                        errorMap[error.path[0] as keyof RegisterFormData] = error.message;
                    }
                });
                setErrors(errorMap);
            } else {
                setErrors({ email: 'Registration failed. Please try again.' });
            }
        }
    }

    return (
        <>
            <div
                className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: "url('public/youth-groups-with-pop-inspired-background.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="w-full max-w-md p-6 sm:p-10 bg-[#EEEEEE] rounded shadow-md font-outfit">
                    <h2 className="flex items-center justify-center gap-1">Stock Image <IoMdImage /></h2>
                    <h2 className="mb-6 text-sm sm:text-base text-center">Register now for stock images.</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 border rounded focus:outline-none"
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
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
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full px-3 py-2 border rounded focus:outline-none"
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-[#DC5F00] font-semibold rounded hover:bg-[#373A40] focus:outline-none duration-500 transition-colors text-sm sm:text-base"
                        >
                            Register
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm sm:text-base">
                        Already have an account? <Link to="/" className="text-[#DC5F00] hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Register