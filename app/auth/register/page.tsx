"use client";

import { useState } from "react";
import Sidebox from "../component/sidebox";
import Link from "next/link";
import { RegisterError } from "@/app/utils/types";
import axios from "@/app/libs/axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/app/context/AuthContext";

export default function Register()
{
    const router = useRouter();
    const { login } = useAuth();

    const schema = z.object({
        name: z.string().min(2, "Please enter name"),
        email: z.string().email("Please enter valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        password_confirmation: z.string(),
    }).refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState<RegisterError | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Reset errors
        setError({ name: [], email: [], password: [], password_confirmation: [] });

        const result = schema.safeParse({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setError({
                name: fieldErrors.name || [],
                email: fieldErrors.email || [],
                password: fieldErrors.password || [],
                password_confirmation: fieldErrors.password_confirmation || []
            });
            setIsLoading(false);
            return; 
        }

        try {
            const response = await axios.post("/api/register", result.data);

            if (response.status === 200 || response.status === 201) {
                const token = response.data.token;
                
                login(token);

                console.log("Secure token stored in memory!", token);

                router.push("/dashboard");
            }
            
        } catch (err: any) {
            const errData = err.response?.data;
            
            if (errData?.errors) {
                setError(errData.errors);
            } else {
                setError({ 
                    name: [], 
                    email: ["An unexpected error occurred during registration."], 
                    password: [], 
                    password_confirmation: [] 
                });
            }
        } finally {
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
                            <div className="card overflow-hidden m-0">
                                <div className="row justify-content-center g-0">
                                    
                                    <Sidebox />

                                    <div className="col-lg-6">
                                        <div className="p-lg-5 p-4">
                                            <div>
                                                <h5 className="text-primary">Register Account</h5>
                                            </div>

                                            <div className="mt-4">
                                                <form onSubmit={handleSubmit}>

                                                    <div className="mb-3">
                                                        <label htmlFor="name" className="form-label">Name <span className="text-danger">*</span></label>
                                                        <input type="text" className="form-control" value={name} onChange={(e) => {setName(e.target.value)}} id="name" placeholder="Enter name"  />
                                                        {error?.name && (
                                                            <span className="text-danger">{ error.name }</span>
                                                        )}
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></label>
                                                        <input type="email" className="form-control" value={email} onChange={(e) => {setEmail(e.target.value)}} id="useremail" placeholder="Enter email address"  />
                                                        {error?.email && (
                                                            <span className="text-danger">{ error.email }</span>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="password-input">Password</label>
                                                        <div className="position-relative auth-pass-inputgroup">
                                                            <input type="password" className="form-control pe-5 password-input" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Enter password" id="password-input" aria-describedby="passwordInput"  />
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                            {error?.password && (
                                                                <span className="text-danger">{ error.password }</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="password-input">Confirm Password</label>
                                                        <div className="position-relative auth-pass-inputgroup">
                                                            <input 
                                                                type="password" 
                                                                className="form-control" 
                                                                value={passwordConfirmation}
                                                                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                                                                minLength={8}
                                                            />
                                                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon" type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                                                            {error?.password_confirmation && (
                                                                <span className="text-danger">{ error.password_confirmation }</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* <div id="password-contain" className="p-3 bg-light mb-2 rounded">
                                                        <h5 className="fs-13">Password must contain:</h5>
                                                        <p id="pass-length" className="invalid fs-12 mb-2">Minimum <b>8 characters</b></p>
                                                        <p id="pass-lower" className="invalid fs-12 mb-2">At <b>lowercase</b> letter (a-z)</p>
                                                        <p id="pass-upper" className="invalid fs-12 mb-2">At least <b>uppercase</b> letter (A-Z)</p>
                                                        <p id="pass-number" className="invalid fs-12 mb-0">A least <b>number</b> (0-9)</p>
                                                    </div> */}

                                                    <div className="mt-4">
                                                        <button className="btn btn-success w-100" type="submit" disabled={isLoading}>{isLoading ? "Signing up..." : "Register"}</button>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="mt-5 text-center">
                                                <p className="mb-0">Already have an account ? <Link href="/login" className="fw-semibold text-primary text-decoration-underline"> Signin</Link> </p>
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