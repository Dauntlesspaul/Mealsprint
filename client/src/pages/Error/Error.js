import React from 'react';
import './Error.scss';
import { Link } from 'react-router-dom';


function ErrorPage() {
  


  return (
      <div className=" bg-[white] z-50 overflow-hidden w-full min-h-screen grid place-items-center fixed top-0 bottom-0 ">
        <div className="bg-white p-3 lg:w-[700px] grid place-items-center shadow-md w-11/12 h-[50%]">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="text-2xl mt-4">Oops! The page you're looking for doesn't exist.</p>
          <p className="mt-2">It might have been moved or deleted.</p>
          <Link to="/" className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300">
            Go Back Home
          </Link>
        </div>
      </div>
  );
}

export default ErrorPage;
