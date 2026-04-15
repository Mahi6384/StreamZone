import React from "react";
import { Helmet } from "react-helmet-async";
import ExperienceFeed from "../components/ExperienceFeed";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>InsightHire — Real Interview Experiences &amp; Questions</title>
        <meta name="description" content="Browse real interview experiences shared by candidates at Google, Amazon, Meta, Microsoft and more. See actual questions asked, preparation tips, and outcomes." />
      </Helmet>
      <ExperienceFeed />
    </div>
  );
};

export default Home;
