import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to the Car Management App
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        Manage your cars efficiently and effortlessly.
      </p>
      <div className="mt-6 space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Register
        </Link>
        <Link
          to="/dashboard"
          className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
