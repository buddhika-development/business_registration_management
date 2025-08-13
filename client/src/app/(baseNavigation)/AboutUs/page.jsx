import React from 'react'
import Hero from "@/components/layouts/AboutUsPage/Hero";
import AboutUsTitleSection from '@/components/layouts/AboutUsPage/AboutUsTitleSection';
import AboutUsContent from '@/components/layouts/AboutUsPage/AboutUsContent';

const page = () => {
  return (
    <div>
      <Hero />
      <AboutUsTitleSection />
      <AboutUsContent />
    </div>
  )
}

export default page