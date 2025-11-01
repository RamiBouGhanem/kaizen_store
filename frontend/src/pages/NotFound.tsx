import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-neutral-950 text-white text-center p-6">
      <motion.h1
        className="text-8xl font-extrabold mb-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        404
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Oops! This product or page is not in our store.
      </motion.p>

      <motion.p
        className="text-sm text-white/70 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Maybe it’s time to check out the latest Kaizen collection!
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          to="/shop"
          className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          <FaShoppingBag className="mr-2" />
          Visit Shop
        </Link>
      </motion.div>

      <motion.p
        className="mt-10 text-xs text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} KAIZEN. All rights reserved.
      </motion.p>
    </div>
  );
};

export default NotFoundPage;