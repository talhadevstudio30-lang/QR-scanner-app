import React, { Suspense } from "react";
import About_Header from "./About-Header";
import Mission_Loader from "./Shadow-Loaders/Mission-Loader";
const About_Mission = React.lazy(() => import('./About-Mission'));
const About_Infrastructure = React.lazy(() => import('./About-Infrastructure'));

const About = () => {
  return (
    <div className="text-gray-900">

      {/* HERO */}
      <About_Header />

      {/* MISSION CARD */}
      <Suspense fallback={<Mission_Loader />}>
        <About_Mission />
      </Suspense>

      {/* CORE INFRASTRUCTURE */}
      <Suspense>
        <About_Infrastructure/>
      </Suspense>

    </div>
  );
};

export default About;