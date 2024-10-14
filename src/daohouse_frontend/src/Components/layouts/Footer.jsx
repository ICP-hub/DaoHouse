import React from "react";
import { Link } from "react-router-dom";
import daolog from "../../../assets/gif/daolog.svg";
import Container from "../Container/Container";

const Footer = () => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <React.Fragment>
      <footer className="bg-[#ffffff]  h-auto small_phone:py-12   py-5 text-center  ">
        <Container>
          {/* Main Content */}
          {/* <div className="w-full flex flex-col md:flex-row items-center justify-between small_phone:mb-8 lg:gap-[270px] md:gap-[200px] gap-8 border border-red-300"> */}
          <div className="w-full flex flex-col md:flex-row md:px-8  px-20px items-center justify-between small_phone:mb-12 lg:gap-[200px] md:gap-[80px] lg:gap-8 md:gap-8 sm:gap-4">
            {/* Logo Section */}
            <Link to="/" onClick={handleLogoClick}>
              <img
                src={daolog}
                alt="DAO House"
                className="small_phone:w-32 w-20 mx-auto translate-y-0 translate-y-[28px] small_phone:mb-10 mb-6 lg:ml-12  md:justify-center md:mx-auto "
              />
            </Link>


            {/* Navigation Links */}
            <div className=" flex flex-row  translate-y-[22px] justify-center lg:mt-3  md:ml-12 md:mb-12  my-1 gap-6  small_phone:mb-12 " >
              <Link
                to="/"
                className="text-[#3D3D3D] small_phone:text-base text-sm font-inter font-normal hover:underline small_phone:mb-10"
              >
                Home
              </Link>
              <Link
                to="/social-feed"
                className="text-[#3D3D3D] small_phone:text-base text-sm font-inter font-normal hover:underline small_phone:mb-10"
              >
                Social Feed
              </Link>
              <Link
                to="/dao"
                className="text-[#3D3D3D] small_phone:text-base text-sm font-inter font-normal hover:underline small_phone:mb-10"
              >
                DAOs
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex  items-center translate-y-0 translate-y-[10px] small_phone:translate-y-[20px] gap-6 my-4 lg:mr-12 ">
              <svg className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain" width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5508_42685)">
                  <path d="M25.2407 0.527719C24.9432 0.264677 24.5834 0.0918571 24.1997 0.027801C23.816 -0.0362551 23.423 0.0108704 23.0628 0.164121L1.08224 9.42577C0.761826 9.56588 0.488027 9.80279 0.295412 10.1066C0.102797 10.4104 0 10.7674 0 11.1327C0 11.4979 0.102797 11.855 0.295412 12.1588C0.488027 12.4625 0.761826 12.6994 1.08224 12.8396L2.5022 13.4557C2.73632 13.5599 3.00017 13.5621 3.23583 13.4617C3.47148 13.3614 3.65966 13.1667 3.75905 12.9204C3.80781 12.7977 3.83308 12.6661 3.83342 12.5332C3.83376 12.4002 3.80915 12.2685 3.76102 12.1455C3.71288 12.0226 3.64216 11.9109 3.55292 11.8168C3.46367 11.7227 3.35766 11.6481 3.24096 11.5973L2.18559 11.1428L23.7824 2.05281C23.8156 2.03138 23.8538 2.02004 23.8927 2.02004C23.9316 2.02004 23.9698 2.03138 24.003 2.05281C24.0343 2.0808 24.058 2.11711 24.0715 2.15795C24.085 2.1988 24.0878 2.2427 24.0798 2.28511L20.1365 21.6568C20.1236 21.7258 20.0938 21.79 20.05 21.8432C20.0063 21.8963 19.9501 21.9365 19.8871 21.9598C19.8252 21.9856 19.7579 21.9937 19.6922 21.983C19.6264 21.9723 19.5645 21.9434 19.5129 21.8992L11.8375 15.5968L19.3498 7.60778C19.5103 7.43251 19.6052 7.20212 19.6172 6.95901C19.6291 6.7159 19.5572 6.47644 19.4148 6.28468C19.2723 6.09292 19.0689 5.96178 18.8418 5.91539C18.6148 5.869 18.3796 5.91047 18.1793 6.03219L7.16503 12.9002C7.0427 12.9584 6.93333 13.0429 6.84399 13.1484C6.75466 13.2539 6.68735 13.378 6.64642 13.5126C6.60548 13.6471 6.59184 13.7893 6.60636 13.9298C6.62088 14.0703 6.66325 14.206 6.73072 14.3282C6.7982 14.4503 6.88928 14.5562 6.99807 14.639C7.10687 14.7218 7.23096 14.7797 7.36232 14.8088C7.49368 14.838 7.62939 14.8377 7.76067 14.8082C7.89196 14.7787 8.01589 14.7205 8.12446 14.6373L12.7585 11.7589L10.5038 14.1727C10.2976 14.3768 10.1367 14.6263 10.0329 14.9034C9.92897 15.1806 9.88461 15.4785 9.90295 15.7758C9.92129 16.0731 10.0019 16.3624 10.1389 16.6231C10.276 16.8838 10.4661 17.1093 10.6957 17.2835L18.3712 23.495C18.7752 23.8232 19.2712 24.0008 19.7815 24C20.0533 23.9979 20.3226 23.9467 20.5779 23.8485C20.9444 23.71 21.2709 23.4747 21.5263 23.1652C21.7817 22.8558 21.9572 22.4824 22.0362 22.081L25.9507 2.72951C26.0338 2.32923 26.0116 1.91268 25.8865 1.52471C25.7614 1.13673 25.5381 0.792032 25.2407 0.527719Z" fill="#3D3D3D" />
                </g>
                <defs>
                  <clipPath id="clip0_5508_42685">
                    <rect width="26" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <svg className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0391 10.08L24.2188 0H21.875L13.9844 8.64L7.8125 0H0L9.60938 13.44L0 24H2.34375L10.6641 14.88L17.1875 24H25L15.0391 10.08ZM3.47656 1.6H6.60156L21.4844 22.4H18.3594L3.47656 1.6Z" fill="#3D3D3D" />
              </svg>
              {/* <img
              src={likedin}
              alt="LinkedIn"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            /> */}
              <svg className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2277 0H1.77335C0.793875 0 0 0.7696 0 1.71947V22.2797C0 23.2296 0.794142 24 1.77335 24H22.2277C23.2072 24 24 23.2293 24 22.2797V1.71947C24 0.769867 23.2072 0 22.2277 0ZM7.27608 20.0896H3.64991V9.25387H7.27608V20.0896ZM5.46326 7.7736H5.43899C4.22298 7.7736 3.4347 6.94187 3.4347 5.9008C3.4347 4.83867 4.24618 4.0296 5.48619 4.0296C6.72647 4.0296 7.48942 4.8384 7.51342 5.9008C7.51342 6.94213 6.72674 7.7736 5.46326 7.7736ZM20.3477 20.0896H16.7226V14.2923C16.7226 12.8352 16.1972 11.8413 14.8863 11.8413C13.8834 11.8413 13.2881 12.512 13.0268 13.1592C12.9297 13.3907 12.906 13.7139 12.906 14.0371V20.0893H9.28144C9.28144 20.0893 9.3289 10.2699 9.28144 9.2536H12.9063V10.7899C13.3876 10.0517 14.2474 8.99867 16.1727 8.99867C18.5586 8.99867 20.3477 10.5464 20.3477 13.8763V20.0896ZM12.8828 10.8243C12.8892 10.8141 12.8977 10.8016 12.9063 10.7899V10.8243H12.8828Z" fill="#474747" />
              </svg>
              {/* 
            <img
              src={discord1}
              alt="Discord"
              className="small_phone:w-8 w-6 small_phone:h-8 h-6 object-contain"
            /> */}
              <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.77635 0C6.96342 0 4.51256 1.06342 4.07286 1.27594C3.63315 1.48846 3.1451 2.15188 2.59131 3.24681C2.03677 4.34174 1.59178 5.62172 0.868758 7.50452C0.146495 9.38731 -0.0219829 13.0171 0.00219325 14.125C0.0263694 15.2329 0.144984 16.0983 1.20647 16.7537C2.2672 17.4082 3.20554 18.0934 4.19298 18.5055C5.18118 18.9177 5.8551 19.2142 6.31293 18.8021C6.77077 18.39 7.07222 17.6684 7.07222 17.6684C7.07222 17.6684 7.50588 17.0244 6.68691 16.6381C5.86794 16.251 5.45845 15.9803 5.49396 15.5811C5.53023 15.182 5.58991 14.963 5.79465 15.0147C5.9994 15.0664 6.48217 15.9933 8.33693 16.4183C10.1917 16.8433 11.9996 16.7795 11.9996 16.7795C11.9996 16.7795 13.8083 16.8442 15.6631 16.4183C17.5178 15.9933 17.9998 15.0664 18.2046 15.0147C18.4093 14.963 18.469 15.182 18.5053 15.5803C18.5415 15.9803 18.1321 16.251 17.3131 16.6381C16.4941 17.0244 16.9278 17.6684 16.9278 17.6684C16.9278 17.6684 17.2292 18.3892 17.6871 18.8021C18.1441 19.2142 18.8188 18.9177 19.8063 18.5055C20.7937 18.0934 21.7328 17.409 22.7935 16.7537C23.855 16.0983 23.9736 15.2329 23.9978 14.125C24.022 13.018 23.8535 9.38731 23.1305 7.50452C22.4082 5.62172 21.9625 4.34174 21.4079 3.24681C20.8549 2.15188 20.3661 1.48846 19.9271 1.27513C19.4874 1.06342 17.0358 0 16.2229 0C15.41 0 15.1697 0.60605 15.1697 0.60605L14.8864 1.27594C14.8864 1.27594 12.9825 0.888874 12.0125 0.888065C11.0424 0.888065 9.11359 1.27594 9.11359 1.27594L8.83028 0.605242C8.83028 0.605242 8.59003 0 7.77635 0ZM7.86474 8.03865H7.89496C9.08035 8.03865 10.0406 9.14812 10.0406 10.5162C10.0406 11.885 9.08035 12.9937 7.89496 12.9937C6.70957 12.9937 5.74932 11.885 5.74932 10.5162C5.74857 9.16105 6.69144 8.05723 7.86474 8.03865ZM16.105 8.03865H16.1353C17.3086 8.05723 18.2507 9.16186 18.2507 10.5162C18.2507 11.885 17.2904 12.9937 16.105 12.9937C14.9189 12.9937 13.9594 11.885 13.9594 10.5162C13.9594 9.14812 14.9189 8.03865 16.105 8.03865Z" fill="#3D3D3D" />
              </svg>


            </div>
          </div>

          {/* Footer Bottom */}
          <div className="bg-[#ffffff] py-4 flex justify-center items-center">
            <p className="text-black font-inter font-normal md:text-base">
              All rights reserved. &copy; {new Date().getFullYear()}, DAO House.
            </p>
          </div>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
