import React from 'react'
import Hero from "@/components/layouts/AboutUsPage/Hero";
import AboutUsSection from '@/components/layouts/AboutUsPage/AboutUsSection';
import AboutUsContent from '@/components/layouts/AboutUsPage/AboutUsContent';

const page = () => {
  return (
    <div>
      <Hero />

      <div className='flex flex-col gap-8'>
        <AboutUsSection />
        <AboutUsContent />
      </div>
    </div>
  )
}

export default page