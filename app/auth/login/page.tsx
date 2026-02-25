"use client"
import axios from "@/app/libs/axios";
import Sidebox from "../component/sidebox"
import { useState } from "react";
import { useRouter } from "next/navigation";
import {z} from "zod";
import { LoginError } from "@/app/utils/types";

export default function Login()
{
    const router = useRouter();

    const schema = z.object({
        email: z.string().email("Please enter valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<LoginError>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e: React.FormEvent) =>{
        e.preventDefault();
        setIsLoading(true);
        setError({})

        const result = schema.safeParse({
            email,
            password,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setIsLoading(false);

            setError({
                email: fieldErrors.email,
                password: fieldErrors.password,
            });

            return; // stop submission
        }

        try{
            await axios.get('/sanctum/csrf-cookie');

            const response = await axios.post("/api/login", result.data);
            if (response.status === 200) {
                document.cookie = "is_logged_in=1; path=/";
                router.push("/dashboard");
            }
            
        }catch(err: any){
            const errData = err.response?.data;
            setError(errData.errors);
        }finally {
            setIsLoading(false);
        }
        
    }

    return(
        <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
            <div className="bg-overlay"></div>
            <div className="auth-page-content overflow-hidden pt-lg-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card overflow-hidden">
                                <div className="row g-0">
                                    <Sidebox />

                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4">
                                            <div>
                                                <h5 className="text-primary">Welcome Back !</h5>
                                            </div>

                                            <div className="mt-4">
                                                <form onSubmit={handleSubmit}>

                                                    <div className="mb-3">
                                                        <label htmlFor="username" className="form-label">Username</label>
                                                        <input type="text" className="form-control" value={email} onChange={(e) => {setEmail(e.target.value)}} id="username" placeholder="Enter username" />
                                                        {error?.email && (
                                                            <span className="text-danger">{ error.email }</span>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="float-end">
                                                            <a href="auth-pass-reset-cover.html" className="text-muted">Forgot password?</a>
                                                        </div>
                                                        <label className="form-label" htmlFor="password-input">Password</label>
                                                        <div className="position-relative auth-pass-inputgroup mb-3">
                                                            <input type="password" className="form-control pe-5 password-input"  value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Enter password" id="password-input" />
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                        </div>
                                                        {error?.password && (
                                                            <span className="text-danger">{ error.password }</span>
                                                        )}
                                                    </div>

                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                        <label className="form-check-label" htmlFor="auth-remember-check">Remember me</label>
                                                    </div>

                                                    <div className="mt-4">
                                                        <button className="btn btn-success w-100" type="submit" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</button>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="mt-5 text-center">
                                                <p className="mb-0">Don&apos;t have an account ? <a href="auth-signup-cover.html" className="fw-semibold text-primary text-decoration-underline"> Signup</a> </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}