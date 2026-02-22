'use client';

import { inter } from "./fonts";

const GlobalErrorMessage = () => {
  return (
    <html lang="en" className="h-[100vh]">
        <body className={`${inter.className} antialiased h-[100%] text-gray-700 dark:bg-[#1E1E1E] dark:text-gray-300`}>
            <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                Something unexpected happened
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                Please refresh the page or try again later.
                </p>
            </div>
            </div>
        </body>
    </html>
  );
};

export default GlobalErrorMessage;
