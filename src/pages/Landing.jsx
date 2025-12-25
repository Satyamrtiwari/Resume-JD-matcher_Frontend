import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white">
      
      {/* HERO */}
      <div className="flex flex-col justify-center items-center text-center px-6 min-h-screen">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Find the Perfect Match{" "}
          <span className="text-purple-400">Instantly</span>
        </h1>

        <p className="max-w-2xl text-gray-300 text-lg mb-10">
          Resume–JD Matcher that helps recruiters evaluate candidates using
          semantic matching powered by machine learning.
        </p>

        <div className="flex gap-6 mb-14">
          <Link
            to="/register"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition rounded-xl text-lg shadow-lg"
          >
            Get Started →
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 border border-purple-400 hover:bg-purple-800 transition rounded-xl text-lg"
          >
            Sign In
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-10 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-400">95%</p>
            <p className="text-gray-400">Match Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">10K+</p>
            <p className="text-gray-400">Resumes Analyzed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-400">80%</p>
            <p className="text-gray-400">Time Saved</p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="px-10 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Resume–JD Matcher?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature title="Semantic Matching">
            Goes beyond keywords using embedding-based similarity.
          </Feature>

          <Feature title="Fast Screening">
            Instantly rank candidates based on job relevance.
          </Feature>

          <Feature title="Backend Powered">
            Built with Django + ML for production-grade reliability.
          </Feature>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, children }) {
  return (
    <div className="bg-gray-800/70 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-3 text-purple-400">
        {title}
      </h3>
      <p className="text-gray-300">{children}</p>
    </div>
  );
}
