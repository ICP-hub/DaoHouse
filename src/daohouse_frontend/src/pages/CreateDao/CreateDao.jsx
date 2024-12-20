import React, { Fragment, useEffect, useRef, useState } from "react";
import "./CreateDao.scss";
import { FaCircleCheck } from "react-icons/fa6";
import Step1 from "../../Components/Dao/Step1";
import Step2 from "../../Components/Dao/Step2";
import Step3 from "../../Components/Dao/Step3";
import Step4 from "../../Components/Dao/Step4";
import Step5 from "../../Components/Dao/Step5";
import Step6 from "../../Components/Dao/Step6";
import TopComponent from "../../Components/Dao/TopComponent";
import { useAuth } from "../../Components/utils/useAuthClient";
import { Principal } from "@dfinity/principal";
import toast from 'react-hot-toast';
import Container from "../../Components/Container/Container";
import LoginModal from "../../Components/Auth/LoginModal";
import { useNavigate } from "react-router-dom";

const CreateDao = () => {
  const className = "CreateDAO";
  const [activeStep, setActiveStep] = useState(0);
  const { backendActor, isAuthenticated, login, signInNFID } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false)
  const navigate = useNavigate();
  const [data, setData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {
      imageURI: "",
    },
  });

  useEffect(() => {
    setShowLoginModal(!isAuthenticated);
  }, [isAuthenticated]);


  const handleLogin = async () => {
    setLoading(true);
    try {
      await login("ii");
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFIDLogin = async () => {
    setLoading(true);
    try {
      await login("nfid");
      window.location.reload();
    } catch (error) {
      console.error('NFID login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    if (!isAuthenticated) {
      navigate("/");
    }
  };


  useEffect(() => {
    return () => {
      localStorage.removeItem('step1Data');
      localStorage.removeItem('step2Data');
      localStorage.removeItem('step3Data');
      localStorage.removeItem('inputData');
      localStorage.removeItem('step5Quorum');
      localStorage.removeItem('isPrivate');
      localStorage.removeItem('step6Data');

      setData({
        step1: {},
        step2: {},
        step3: {},
        step4: {},
        step5: {},
        step6: {
          imageURI: "",
        },
      });
    };
  }, []);

  useEffect(() => {
    const clearDataOnUnload = () => {
      localStorage.removeItem('step1Data');
      localStorage.removeItem('step2Data');
      localStorage.removeItem('step3Data');
      localStorage.removeItem('councilMembers');
      localStorage.removeItem('step4Data');
      localStorage.removeItem('inputData');
      localStorage.removeItem('step5Quorum');
      localStorage.removeItem('isPrivate');
      localStorage.removeItem('step6Data');
    };

    window.addEventListener('beforeunload', clearDataOnUnload);

    return () => {
      window.removeEventListener('beforeunload', clearDataOnUnload);
    };
  }, []);


  const handleDaoClick = async () => {
    setLoadingNext(true);
    const { step1, step2, step3, step4, step5, step6 } = data;
    const council = step4.voting?.Council;
    const councilArray = Object.entries(council)
      .filter(([permission, hasPermission]) => hasPermission)
      .map(([permission]) => permission);

    const allMembers = new Set();

    // Add council members
    const councilMembers = step3.council || [];
    councilMembers.forEach(member => allMembers.add(Principal.fromText(member).toText()));

    // Add members from each group

    const principalMembers = Array.from(allMembers).map(member => Principal.fromText(member));

    const proposalEntry = step5.map(q => ({
      place_name: q.name,
      min_required_thredshold: BigInt(q.vote),
    }));

    const membersArray = Array.from(data.members_permissions) || [];
    const allDaoUsers = step3.members.map(member => Principal.fromText(member));

    const daoPayload = {
      dao_name: step1.DAOIdentifier || "my dao hai",
      purpose: step1.Purpose || "my proposal hai",
      link_of_document: "my link.org",
      cool_down_period: step1.SetUpPeriod || 3,
      members: principalMembers || [Principal.fromText("aaaaa-aa")],
      members_permissions: membersArray || ["just", "pesmi"],
      token_name: step2.TokenName || "GOLD Token",
      token_symbol: step2.TokenSymbol || "TKN",
      linksandsocials: ["just send f"],
      required_votes: parseInt(step2.VotesRequired, 10) || 3,
      image_content: step6.image_content ? Array.from(new Uint8Array(step6.image_content)) :
        Array.from(new Uint8Array()),
      image_title: step6.image_title || "this is just my title",
      image_content_type: step6.image_content_type || "just image content bro",
      image_id: step6.image_id || "12",
      dao_groups: data.dao_groups,
      proposal_entry: proposalEntry,
      ask_to_join_dao: data.ask_to_join_dao,
      token_supply: Number(step2.TokenSupply) || 4,
      all_dao_user: allDaoUsers
    };


    try {
      const response = await backendActor.create_dao(daoPayload);
      if (response.Err) {
        toast.error(`${response.Err}`);
        toast.error(`Failed to create Dao`);
        setLoadingNext(false)
      } else {
        setLoadingNext(false);
        toast.success("DAO created successfully");
        clearLocalStorage();
        setTimeout(() => {
          window.location.href = '/dao';
        }, 500);
      }
    } catch (error) {
      setLoadingNext(false);
      console.error("Error creating DAO:", error);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('step1Data');
    localStorage.removeItem('step2Data');
    localStorage.removeItem('step3Data');
    localStorage.removeItem('councilMembers');
    localStorage.removeItem('inputData');
    localStorage.removeItem('step5Data');
    localStorage.removeItem('step6Data');
  };

  const Step1Ref = useRef(null);
  const Step4Ref = useRef(null);

  const Form = () => {
    switch (activeStep) {
      case 0:
        return <Step1 setData={setData} data={data.step1 || {}} setActiveStep={setActiveStep} />;
      case 1:
        return <Step2 setData={setData} data={data.step2} setActiveStep={setActiveStep} />;
      case 2:
        return <Step3 setData={setData} data={data.step3} setActiveStep={setActiveStep} Step1Ref={Step1Ref} Step4Ref={Step4Ref} />;
      case 3:
        return <Step4 data={data} setData={setData} setActiveStep={setActiveStep} />;
      case 4:
        return <Step5 data={data} setData={setData} setActiveStep={setActiveStep} />;
      case 5:
        return <Step6 data={data} setData={setData} setActiveStep={setActiveStep} handleDaoClick={handleDaoClick} loadingNext={loadingNext} setLoadingNext={setLoadingNext} clearLocalStorage={clearLocalStorage} />;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <TopComponent showButtons={false} />
      <div className={className + " bg-[#c8ced3] mobile:py-8 py-4 mobile:px-5 px-5"}>
        <Container>
          <div className={className + "__label py-2 mobile:px-2 mobile:mx-2 w-full mx-[-2px] small_phone:px-4 desktop:mx-[-16px] md:mx-2 big_phone:mx-1 tablet:px-12 tablet:mx-2 lg:px-20 laptop:px-[72px] desktop:px-32"}>
            <div className="phone:text-4xl text-2xl flex flex-row items-center gap-4">
              Create DAO
              <div className="flex flex-col items-start">
                <div className="phone:w-32 w-12 border-t-2 border-black"></div>
                <div className="phone:w-14 w-7 mobile:mt-2 mt-1 border-t-2 border-black"></div>
              </div>
            </div>
          </div>
        </Container>
        {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={handleModalClose} onLogin={handleLogin}
          onNFIDLogin={handleNFIDLogin} loading={loading} />}
        <Container>
          <div className={className + "__steps overflow-x-scroll small_phone:px-4 mobile:px-4 mobile:py-4 py-2 big_phone:px-4 tablet:px-12 lg:px-20 desktop:px-24 mobile:gap-20 gap-6 flex flex-row w-full mobile:items-center justify-between"}>
            {steps.map(({ step, name }, index) => (
              <div key={index} ref={index >= 3 ? Step4Ref : Step1Ref} className={"flex mobile:flex-row flex-col  py-4 items-center gap-2 " + `${activeStep >= index ? "opacity-100" : "opacity-50"}`}>
                {index >= activeStep ? (
                  <div className={"border border-[#007a7b] " + (activeStep === index ? "bg-[#007a7b] text-white font-semibold" : "bg-white text-[#007a7b]") + " rounded-[2rem] mobile:min-w-7 min-w-5 mobile:h-7 h-5 flex items-center justify-center"}>
                    <p className="text-center mobile:text-base text-xs">{step}</p>
                  </div>
                ) : (
                  <FaCircleCheck className="mobile:text-2xl text-[1.2rem] text-[#0E3746]" />
                )}
                <span className="text-nowrap mobile:text-base text-xs">{name}</span>
              </div>
            ))}
          </div>
        </Container>
        <Container>
          <div className="form-wrapper w-full small_phone:px-4 mobile:px-4 big_phone:mx-0 big_phone:px-0 tablet:mx-[-2px] tablet:px-16 desktop:px-20  py-4 ">
            {Form()}
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default CreateDao;

const steps = [
  { step: 1, name: "Basic Info" },
  { step: 2, name: "Token Info" },
  { step: 3, name: "Add members & Groups" },
  { step: 4, name: "Permissions" },
  { step: 5, name: "Quorum" },
  { step: 6, name: "DAO Asset" },
];
