import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../../services/api';
import { z } from 'zod';
import { IoMdImage } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";

// Define Zod schemas for form validation
const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
    otp: z.string().length(4, "OTP must be 4 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const OTPInput: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
    const inputRefs = [
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
        React.useRef<HTMLInputElement>(null),
    ];

    const handleChange = (index: number, digit: string) => {
        if (digit.length <= 1 && /^\d*$/.test(digit)) {
            const newValue = value.substr(0, index) + digit + value.substr(index + 1);
            onChange(newValue);
            if (digit !== '' && index < 3) {
                inputRefs[index + 1].current?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && value[index] === '') {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div className="flex justify-between">
            {[0, 1, 2, 3].map((index) => (
                <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl border rounded focus:outline-none"
                />
            ))}
        </div>
    );
};

const ResetPassword: React.FC = () => {
    const [emailFormData, setEmailFormData] = useState<EmailFormData>({ email: '' });
    const [resetFormData, setResetFormData] = useState<ResetPasswordFormData>({
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Partial<EmailFormData & ResetPasswordFormData>>({});
    const [timer, setTimer] = useState(600); // 10 minutes in seconds
    const navigate = useNavigate();

    useEffect(() => {
        let interval: number | undefined;
        if (step === 2 && timer > 0) {
            interval = window.setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailFormData({ ...emailFormData, [e.target.name]: e.target.value });
    };

    const handleResetFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetFormData({ ...resetFormData, [e.target.name]: e.target.value });
    };

    const navigateHome = () => {
        navigate('/')
    }

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            emailSchema.parse(emailFormData);
            await requestPasswordReset(emailFormData.email);
            setStep(2);
            setErrors({});
            setTimer(600); // Reset timer to 10 minutes
        } catch (err) {
            if (err instanceof z.ZodError) {
                setErrors(err.flatten().fieldErrors);
            } else {
                setErrors({ email: 'Failed to send OTP. Please try again.' });
            }
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (timer === 0) {
            setErrors({ otp: 'OTP has expired. Please request a new one.' });
            return;
        }
        try {
            resetPasswordSchema.parse(resetFormData);
            await resetPassword(emailFormData.email, resetFormData.otp, resetFormData.newPassword);
            navigate('/');
        } catch (err) {
            if (err instanceof z.ZodError) {
                setErrors(err.flatten().fieldErrors);
            } else {
                setErrors({ newPassword: 'Failed to reset password. Please try again.' });
            }
        }
    };

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
                <h2 className="mb-6 text-sm sm:text-base text-center">Reset Your Password</h2>
                {step === 1 ? (
                    <form onSubmit={handleRequestOTP} className="space-y-4 sm:space-y-6">
                        <div>
                            {/* <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Please enter your registered stock image email below</label> */}
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={emailFormData.email}
                                onChange={handleEmailChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-semibold text-white bg-[#DC5F00] rounded hover:bg-[#373A40] focus:outline-none text-sm sm:text-base transition-colors duration-500"
                        >
                            Request OTP
                        </button>
                        <p className="flex items-center cursor-pointer" onClick={navigateHome}>
                            Return to Home <IoHomeOutline className="ml-2" />
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
                        <div className='pr-'>
                            <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-700">OTP:</label>
                            <OTPInput value={resetFormData.otp} onChange={(value) => setResetFormData({ ...resetFormData, otp: value })} />
                            {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-red-500">Time remaining: {formatTime(timer)}</p>
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">New Password:</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={resetFormData.newPassword}
                                onChange={handleResetFormChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none"
                                required
                            />
                            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={resetFormData.confirmPassword}
                                onChange={handleResetFormChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none"
                                required
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-semibold text-white bg-[#DC5F00] rounded hover:bg-[#373A40] focus:outline-none text-sm sm:text-base transition-colors duration-500"
                            disabled={timer === 0}
                        >
                            Reset Password
                        </button>
                    </form>
                )}
                {step === 2 && timer === 0 && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                setStep(1);
                                setErrors({});
                            }}
                            className="text-[#DC5F00] hover:underline"
                        >
                            Request new OTP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;