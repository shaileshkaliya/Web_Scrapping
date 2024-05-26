import React from "react";
import Navbar from "./Navbar";

function About() {
  return (
    <div className="flex flex-col gap-8">
      <Navbar />
      {/* <div className='w-full p-4 shadow h-full'>
            <p className='text-lg'>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore sit nemo animi. Assumenda modi blanditiis at mollitia quam vitae vero ipsam! Quidem dolores ullam aut minus qui velit expedita ipsa.
            </p>
        </div> */}
      <div class="container mx-auto p-8">
        <div class="bg-white shadow-md rounded-lg p-6">
          <h1 class="text-3xl font-bold mb-4">About Us</h1>
          <p class="text-lg mb-6">
            Welcome to our website! I am Shailesh Kaliya, a dedicated student
            from the CSE (AIML) department at Pimpri Chinchwad College of
            Engineering, Pune. This platform has been developed as a part of my
            certification project for cloud and NLP by Quantiphi Pvt Ltd.
          </p>

          <h2 class="text-2xl font-bold mb-4">Our Mission</h2>
          <p class="text-lg mb-6">
            Our mission is to provide efficient and accurate data scraping and
            analysis tools. This website is designed to help users extract
            valuable insights from various online sources, leveraging the latest
            advancements in cloud computing and natural language processing.
          </p>

          <h2 class="text-2xl font-bold mb-4">Who We Are</h2>
          <p class="text-lg mb-6">
            As a passionate learner and developer, I have created this website
            to demonstrate my skills and knowledge in the field of data scraping
            and analysis. The project showcases my ability to apply theoretical
            concepts to real-world applications, providing practical solutions
            for data extraction and interpretation.
          </p>

          <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
          <p class="text-lg mb-6">
            We value your feedback and suggestions. If you have any comments or
            would like to get in touch, please feel free to contact me at{" "}
            <a href="mailto:Shaileshkaliya124@gmail.com" class="text-blue-500">
              Shaileshkaliya124@gmail.com
            </a>
            . Your input is essential for the continuous improvement and success
            of this project.
          </p>

          <p class="text-lg">
            Thank you for visiting our website, and we hope you find our tools
            and resources helpful!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
