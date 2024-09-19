import React from 'react'
// import daobg from "../../../assets/daobg.png";
import daobg1 from "../../../assets/daobg1.png";
import Container from '../Container/Container';

const TopComponent = ({ showButtons, showAll, setShowAll }) => {
    const className = "DAOs";

    return (
        <div
            className='mt-[90px]'
            style={{
                backgroundImage: `url("${daobg1}")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            <Container classes={`__filter w-100 mobile:h-[25vh] h-[17vh] big_phone:p-20 small_phone:p-10 p-4 flex flex-col items-start justify-center ${className}`}>
                <h1 className="mobile:text-5xl text-3xl p-3 text-white">DAOs</h1>

                {showButtons &&
                    <div
                        className={
                            className + "__buttons flex flex-row rounded-full"
                        }
                    >
                        <button
                            className={`px-4 py-0 mobile:text-lg text-sm text-white ${!showAll ? "" : "font-semibold bg-white bg-opacity-30 rounded-full"
                                }`}
                            onClick={() => setShowAll(true)}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-0 mobile:text-lg text-sm text-white ${showAll ? "" : "font-semibold bg-white bg-opacity-30 rounded-full"
                                }`}
                            onClick={() => setShowAll(false)}
                        >
                            Joined
                        </button>
                    </div>}
            </Container>
        </div>

    )
}

export default TopComponent