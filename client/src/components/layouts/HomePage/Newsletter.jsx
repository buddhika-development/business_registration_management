import React from "react";

const Newsletter = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          Join Our <span className="text-indigo-600">Newsletter</span>
        </h3>

        <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
          Stay updated with the latest business registration news, policy changes,
          and helpful tips — straight to your inbox.
        </p>

        
        <form action="#" method="post" className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-2 w-full max-w-xl mx-auto">
          <input
            type="email"
            placeholder="example@gmail.com"
            className="col-span-3"
            required
          />
          <button
            type="submit"
            className="btn"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
