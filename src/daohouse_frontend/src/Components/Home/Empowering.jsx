import React from 'react';
import Container from '../Container/Container';

const Empowering = () => {
  return (
    <div className="">
      <Container classes={'px-6 py-[2rem] md:py-[6rem] lg:py-[8rem] md:px-[8rem]'}>
        <div className="flex flex-col items-center">
          {/* Empowering Heading */}
          <h1 className="text-empowering-heading font-bold text-center font-mulish text-[#05212C] text-[20px] md:text-4xl lg:text-4xl xl:text-5xl leading-tight mb-2 md:mb-2">
            Empowering Decentralization
          </h1>
          {/* Description */}
          <p className="text-empowering-description text-center font-inter font-normal text-xs md:text-lg lg:text-md px-[15px] iphone_SE:px-[30px] small_phone:px-[50px] mobile:px-[110px] md:px-12 lg:px-32 xl:px-60 mt-0 md:mt-4 ">
            Unlock the true potential of decentralized governance with our platform. Easily
            create, join, and participate in DAOs tailored to your needs
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Empowering;
