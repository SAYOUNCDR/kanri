import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/reusables/Button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans select-none">
      <div className="absolute inset-0 z-0">
        <img
          src="/Landing.png"
          alt="Scenic landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-4 py-4 mx-auto mt-8 w-[80%] max-w-5xl rounded-2xl bg-white/40 backdrop-blur-md border border-white/30 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xl font-bold tracking-tight">Kanri</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-800">
          <button className="hover:text-black transition-colors">
            Product
          </button>
          <button className="hover:text-black transition-colors">
            Features
          </button>
          <button className="hover:text-black transition-colors">
            Company
          </button>
        </div>

        <Button onClick={() => navigate("/login")}>Login</Button>
      </nav>

      <main className="relative z-10 flex-grow flex flex-col justify-end items-center text-center px-4 w-full max-w-4xl mx-auto pb-10">
        <h1 className="text-4xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight ">
          Role-based task management
          <br />
          for teams
        </h1>

        <p className="text-zinc-800 text-sm md:text-sm mb-8 max-w-2xl mx-auto">
          Manage, assign, and track tasks across users with a simple admin
          dashboard.
          <br className="hidden md:block" />
          Kanri lets administrators assign tasks, monitor workload distribution,
          and track progress in one place.
        </p>

        <Button
          onClick={() => navigate("/login")}
          className="px-10 py-3.5 text-md"
        >
          Get started
        </Button>
      </main>
    </div>
  );
};

export default Landing;
