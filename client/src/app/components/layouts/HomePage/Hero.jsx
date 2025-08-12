import Image from 'next/image';
import React from 'react';
import MainTitle from '../../ui/Title/MainTitle';
import MainLinkButton from '../../ui/Buttons/MainLinkButton';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative h-[600px] md:h-[800px]">

      {/* ========================================= */}
      {/* Background image */}
      {/* ========================================= */}
      <Image
        src="/home-hero.png"
        alt="Welcome to Department of Company registration"
        fill
        priority
        className="object-cover object-center"
        />

      {/* ========================================= */}
      {/* Content section over the image, anchored to bottom-center */}
      {/* ========================================= */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-11/12 lg:w-1/2 h-[360px] bg-white/60 rounded-t-3xl z-10 flex flex-col items-center justify-center gap-10 backdrop-blur-md">
        <MainTitle 
          title={"Welcome to the Department of the Registrar"}
          className={"text-base-text text-shadow-sm"}
        />

        {/* ==================================== */}
        {/* user action section */}
        {/* ==================================== */}
        <div className='flex flex-col items-center gap-4 text-white'>
          <MainLinkButton 
            text={"Register Your Business"}
            link={"/BusinessRegister"}
          />

          <Link href='NameChecker' className='text-base-text/60 text-center font-semibold'>
            Check Your Business Name Availability
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
