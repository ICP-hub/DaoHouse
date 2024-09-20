import React from 'react';
import Container from '../Container/Container';

const Empowering = () => {
  return (
    <div className="bg-[#dadee4]">
      <Container classes={'px-6 py-[3rem] md:py-[8rem] md:px-[8rem]'}>
        <div className="flex flex-col items-center">
          {/* Empowering Heading */}
          <h1 className="text-empowering-heading text-center font-mulish font-medium text-[32px] md:text-2xl lg:text-4xl xl:text-5xl leading-tight mb-0 md:mb-2">
            Empowering
          </h1>
          {/* Decentralization Heading */}
          <h1 className="text-empowering-heading text-center font-mulish font-medium text-[32px] md:text-2xl lg:text-4xl xl:text-5xl leading-tight mb-0 md:mb-2">
            Decentralization
          </h1>
          {/* Description */}
          <p className="text-empowering-description text-center font-inter font-normal text-sm md:text-base lg:text-lg mt-0 md:mt-4 mb-12">
            Unlock the true potential of decentralized governance with our platform. Easily
            <br />
            create, join, and participate in DAOs tailored to your needs
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Empowering;
