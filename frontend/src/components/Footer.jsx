import React from "react";

const Footer = () => {
  return (
    <footer className=" position-fixed footer flex justify-between items-center p-4 bg-neutral text-neutral-content mt-10">
      {/* Left: Socials */}
      <div className="items-center grid-flow-col">
        <p className="font-semibold text-lg">© 2025 StreamZone</p>
        <div className="flex gap-4 ml-6">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-github text-xl hover:text-white" />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-linkedin text-xl hover:text-white" />
          </a>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-x-twitter text-xl hover:text-white" />
          </a>
        </div>
      </div>

      {/* Right: Contact button */}
      <div className="grid-flow-col gap-4 md:place-self-end justify-self-end">
        <a href="/contact">
          <button className="btn btn-outline btn-sm">Contact Me</button>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
