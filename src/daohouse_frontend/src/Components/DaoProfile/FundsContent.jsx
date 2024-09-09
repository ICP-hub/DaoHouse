import userImage1 from "../../../assets/userImage1.png";
import userImage2 from "../../../assets/userImage2.png";
import userImage3 from "../../../assets/userImage3.png";
import IncomingImg from "../../../assets/Incoming.png";
import OutgoingImg from "../../../assets/Outgoing.png";

const FundsContent = () => {
  const Transactions = [
    {
      userKey: 1,
      userImage: userImage1,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Incoming",
      date: "01/01/24",
      action: "+1",
    },
    {
      userKey: 2,
      userImage: userImage2,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Incoming",
      date: "01/01/24",
      action: "+1",
    },
    {
      userKey: 3,
      userImage: userImage3,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Outgoing",
      date: "01/01/24",
      action: "-1",
    },
    {
      userKey: 4,
      userImage: userImage1,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Incoming",
      date: "01/01/24",
      action: "+1",
    },
    {
      userKey: 5,
      userImage: userImage2,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Outgoing",
      date: "01/01/24",
      action: "-1",
    },
    {
      userKey: 6,
      userImage: userImage3,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Outgoing",
      date: "01/01/24",
      action: "-1",
    },
    {
      userKey: 7,
      userImage: userImage1,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Incoming",
      date: "01/01/24",
      action: "+1",
    },
    {
      userKey: 8,
      userImage: userImage2,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Outgoing",
      date: "01/01/24",
      action: "-1",
    },
    {
      userKey: 9,
      userImage: userImage3,
      userName: "Username.user",
      userEmail: "Username.user",
      type: "Incoming",
      date: "01/01/24",
      action: "+1",
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h1 className="lg:text-[24px] md:text-[18px] text-[16px] font-bold">
          Funds
        </h1>
        <button
          onClick={() => {
            Navigate("/create-proposal");
          }}
          className="flex justify-center items-center text-[16px] relative w-[220px] h-[50px] bg-white rounded-full  hidden lg:block"
          style={{
            boxShadow:
              "0px 0.26px 1.22px 0px #0000000A, 0px 1.14px 2.53px 0px #00000010, 0px 2.8px 5.04px 0px #00000014, 0px 5.39px 9.87px 0px #00000019, 0px 9.07px 18.16px 0px #0000001F, 0px 14px 31px 0px #00000029",
          }}
        >
          <span className="absolute text-[35px] font-thin left-5 bottom-[1px] ">
            +
          </span>
          <span className="ml-6">Create Proposals</span>
        </button>
      </div>
      <div className="bg-[#F4F2EC] rounded-[10px] mt-4 md:mb-16 mb-12">
        <div className="flex items-center md:p-5 p-4">
          <span className="md:text-[20px] text-[16px] font-normal text-[#05212C]">
            Current Balance
          </span>
        </div>
        <div className="w-full border-t  border-[#0000004D]"></div>
        <div className="px-4 py-4">
          <div className="bg-white rounded-[10px] py-5">
            <div>
              <h1 className="lg:text-[24px] md:text-[18px] text-[16px] font-bold text-[#05212C] md:ml-5 ml-2 mb-4 xl:ml-[5%]">
                Transactions
              </h1>
              <div className="flex justify-start md:gap-[5%] items-center md:ml-5 mx-2 mb-5 lg:text-[18px] md:text-[14px] text-[12px] text-[#05212C] font-semibold xl:ml-[5%]">
                <span className="md:w-[200px] w-[130px] pl-1">AccountID</span>
                <span className="md:w-[180px] w-[60px] flex justify-center">
                  Type
                </span>
                <span className="md:w-[180px] w-[70px] flex justify-center">
                  Date
                </span>
                <span className="md:w-[150px] w-[60px] flex justify-center">
                  Action
                </span>
              </div>
              <div className="w-full border-t  border-[#97C3D3]"></div>
              <div className="w-full py-2 xl:ml-[4%]">
                {Transactions.map((transaction) => (
                  <div
                    key={transaction.userKey}
                    className="flex flex-row items-center justify-start md:gap-[5%] md:px-4 px-2 py-2 text-[#05212C] md:text-[16px] text-[12px] font-normal"
                  >
                    <div className="flex md:gap-3 gap-2 md:w-[200px] w-[130px]">
                      <img
                        src={transaction.userImage}
                        alt={`User ${transaction.userName}`}
                        className="md:w-10 md:h-10 w-[29px] h-[29px]"
                      />
                      <div className="flex flex-col">
                        <span>{transaction.userName}</span>
                        <span className="text-[#B3B2B2] md:text-[12px] text-[9px]">
                          {transaction.userEmail}
                        </span>
                      </div>
                    </div>
                    <span className="flex justify-center items-center gap-3 md:w-[180px] w-[60px]">
                      {transaction.type === "Incoming" ? (
                        <img
                          src={IncomingImg}
                          className="md:w-8 md:h-8 w-[22px] h-[22px]"
                          alt="Incoming"
                        />
                      ) : (
                        <img
                          src={OutgoingImg}
                          className="md:w-8 md:h-8 w-[22px] h-[22px]"
                          alt="Outgoing"
                        />
                      )}
                      <span className="hidden md:block">
                        {transaction.type}
                      </span>
                    </span>
                    <span className="flex justify-center md:w-[180px] w-[70px]">
                      {transaction.date}
                    </span>
                    <span className="flex justify-center md:w-[150px] w-[60px]">
                      {transaction.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundsContent;
