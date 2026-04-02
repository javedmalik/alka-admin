import Image from "next/image";
import Link from "next/link";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const error = params.error;

  let errorMessage = "";
  let errorType = "";

  if (error === "validation") {
    errorMessage = "Please enter valid login details.";
    errorType = "validation";
  } else if (error === "credentials") {
    errorMessage = "Invalid email or password.";
    errorType = "credentials";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl animate-fadeInUp">
          <div className="overflow-hidden rounded-2xl bg-white/80 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-3xl sm:rounded-3xl">
            <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
              
              {/* Left Panel - Login Form */}
              <div className="relative flex items-center bg-gradient-to-br from-white via-white to-blue-50/30 p-6 sm:p-8 md:p-10 lg:p-12">
                {/* Decorative Elements */}
                <div className="absolute left-0 top-0 h-32 w-32 rounded-br-[100px] bg-gradient-to-br from-blue-500/10 to-orange-500/10" />
                <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-[100px] bg-gradient-to-tl from-blue-500/10 to-orange-500/10" />
                
                <div className="relative z-10 w-full max-w-md mx-auto">
                  {/* Logo Section */}
                  <div className="mb-8 sm:mb-10 md:mb-12 text-center">
                    <div className="inline-flex items-center justify-center gap-3">
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                        <Image
                          src="/images/alka_logo.png"
                          alt="ALKA Logo"
                          width={40}
                          height={40}
                          className="h-10 w-10 sm:h-12 sm:w-12 object-contain brightness-0 invert"
                        />
                      </div>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          ALKA Admin
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Admin Dashboard
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-sm text-gray-600">
                      Sign in to access your admin dashboard
                    </p>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className={`mb-6 rounded-xl border px-4 py-3 text-sm animate-slideIn ${
                      errorType === "credentials" 
                        ? "border-red-200 bg-red-50 text-red-700" 
                        : "border-yellow-200 bg-yellow-50 text-yellow-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form action={loginAction} className="space-y-6">
                    <div className="group">
                      <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600 group-focus-within:text-blue-600 transition-colors">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="admin@alka.com"
                          className="w-full rounded-xl border border-gray-200 bg-white/50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600 group-focus-within:text-blue-600 transition-colors">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
                          </svg>
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-gray-200 bg-white/50 pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span>Remember me</span>
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Sign In
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 pt-6 text-center border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      © 2024 ALKA Foundation. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Panel - Hero Section */}
              <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 lg:flex items-center justify-center p-8 lg:p-12">
                {/* Animated Background Patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-300 rounded-full blur-3xl animate-blob animation-delay-2000" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-blob animation-delay-4000" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white">
                  <div className="mb-8 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Image
                        src="/images/alka_logo.png"
                        alt="ALKA Logo"
                        width={60}
                        height={60}
                        className="h-14 w-14 object-contain brightness-0 invert"
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Admin Dashboard
                  </h2>
                  
                  <p className="text-blue-100 text-base lg:text-lg mb-8 max-w-md mx-auto">
                    Manage campaigns, volunteers, donations, and more from a single, intuitive interface.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-xs text-blue-200">Campaigns</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-xs text-blue-200">Volunteers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold">50K+</div>
                      <div className="text-xs text-blue-200">Donors</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold">₹2Cr+</div>
                      <div className="text-xs text-blue-200">Raised</div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  {/* <div className="absolute bottom-0 left-8 text-left">
                    <p className="text-blue-200 text-xs">
                      Secure Admin Access
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}