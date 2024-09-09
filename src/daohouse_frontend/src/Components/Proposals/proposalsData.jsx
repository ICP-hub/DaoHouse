export const proposalsArray = [
  {
    id: 1,
    username: "John Doe",
    userImage: "https://placehold.co/64x64",
    statusColor: "bg-blue-200 text-blue-800",
    submittedOn: "04/04/24 5:32:11 AM",
    expiresOn: "04/04/24 5:32:11 AM",
    votesRequired: 15,
    comments: 5,
    shares: 7,
    voters: 3,
    status:"In Progress",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim",
    ],
    timeLeft: "6d 8h 35m 12s left",
  },
  {
    id: 2,
    username: "Jane Smith",
    userImage: "https://placehold.co/64x64",
    statusColor: "bg-green-200 text-green-800",
    submittedOn: "04/04/24 6:45:22 AM",
    expiresOn: "04/04/24 6:45:22 AM",
    votesRequired: 20,
    comments: 8,
    shares: 10,
    voters: 5,
    status:"Approved",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim",
    ],
    timeLeft: "1d 4h 22m 18s left",
  },
  {
    id: 3,
    username: "Jane Smith",
    userImage: "https://placehold.co/64x64",
    statusColor: "bg-green-200 text-green-800",
    submittedOn: "04/04/24 6:45:22 AM",
    expiresOn: "04/04/24 6:45:22 AM",
    votesRequired: 20,
    comments: 8,
    shares: 10,
    voters: 5,
    status:"Rejected",
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim",
    ],
    timeLeft: "1d 4h 22m 18s left",
  },
  {
    id: 4,
    username: "Jane Smith",
    userImage: "https://placehold.co/64x64",
    status:"Rejected",
    statusColor: "bg-green-200 text-green-800",
    submittedOn: "04/04/24 6:45:22 AM",
    expiresOn: "04/04/24 6:45:22 AM",
    votesRequired: 20,
    comments: 8,
    shares: 10,
    voters: 5,
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim",
    ],
    timeLeft: "1d 4h 22m 18s left",
  },
  {
    id: 5,
    username: "Jane Smith",
    userImage: "https://placehold.co/64x64",
    status:"Rejected",
    statusColor: "bg-green-200 text-green-800",
    submittedOn: "04/04/24 6:45:22 AM",
    expiresOn: "04/04/24 6:45:22 AM",
    votesRequired: 20,
    comments: 8,
    shares: 10,
    voters: 5,
    description: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim",
    ],
    timeLeft: "1d 4h 22m 18s left",
  },
];


export const sectionsData = [
  // { title: 'Transfer', input1: "Amount", input2: "Receiver" },
  // { title: 'Cast Vote', input1: "In Favour", input2: "Against" }
];


export const gridItems = [
  { label: "Submitted On:", value: "04/04/24", time: "5:32:11 AM" },
  { label: "Expires On:", value: "04/04/24 ", time: "5:32:11 AM" },
  { label: "Votes Require", value: "12"
     }
];

export const buttons = [
  {
      icon: (
          <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <path
                  d="M3.11111 9.22293H12.8889V8.34456H3.11111V9.22293ZM3.11111 6.58781H12.8889V5.70943H3.11111V6.58781ZM3.11111 3.95269H12.8889V3.07431H3.11111V3.95269ZM16 15L13.2649 12.2972H1.43556C1.02667 12.2972 0.685333 12.162 0.411556 11.8914C0.137778 11.6209 0.000592593 11.2833 0 10.8787V1.41857C0 1.01452 0.137185 0.677227 0.411556 0.406687C0.685926 0.136148 1.02726 0.000585583 1.43556 0H14.5644C14.9733 0 15.3147 0.135562 15.5884 0.406687C15.8622 0.677812 15.9994 1.01511 16 1.41857V15ZM1.43556 11.4189H13.6444L15.1111 12.8629V1.41857C15.1111 1.28389 15.0542 1.16004 14.9404 1.04702C14.8267 0.934005 14.7013 0.877789 14.5644 0.878374H1.43556C1.29926 0.878374 1.17393 0.93459 1.05956 1.04702C0.945185 1.15945 0.888296 1.2833 0.888889 1.41857V10.8787C0.888889 11.0134 0.945778 11.1372 1.05956 11.2502C1.17333 11.3632 1.29867 11.4195 1.43556 11.4189Z"
                  fill="black"
              />
          </svg>
      ),
      text: "5 Comments",
  },
  {
      icon: (
          <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <path
                  d="M16 1L1 5.85294L6.73529 8.5L12.9118 4.08824L8.5 10.2647L11.1471 16L16 1Z"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              />
          </svg>
      ),
      text: "7 Share",
  },
  {
      icon: (
          <svg
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <path
                  d="M10.1104 15H1.88964C1.38848 15 0.907841 14.8012 0.553464 14.4473C0.199087 14.0935 0 13.6135 0 13.1131V12.4889C0 9.49331 2.69161 7.05469 6 7.05469C9.30839 7.05469 12 9.4918 12 12.4889V13.1131C12 13.6135 11.8009 14.0935 11.4465 14.4473C11.0922 14.8012 10.6115 15 10.1104 15ZM6 7.81096C3.10809 7.81096 0.755858 9.90918 0.755858 12.4904V13.1146C0.755858 13.4149 0.87531 13.7028 1.08794 13.9152C1.30056 14.1275 1.58895 14.2468 1.88964 14.2468H10.1104C10.4111 14.2468 10.6994 14.1275 10.9121 13.9152C11.1247 13.7028 11.2441 13.4149 11.2441 13.1146V12.4889C11.2441 9.90918 8.89191 7.81096 6 7.81096ZM6 5.92332C5.41335 5.92347 4.83983 5.7499 4.35198 5.42455C3.86413 5.09921 3.48385 4.63672 3.25925 4.09556C3.03464 3.5544 2.9758 2.95889 3.09016 2.38433C3.20451 1.80978 3.48694 1.28199 3.90171 0.867718C4.31648 0.453447 4.84497 0.171301 5.42033 0.056964C5.9957 -0.0573734 6.5921 0.0012332 7.1341 0.225372C7.67611 0.449511 8.13938 0.829113 8.46532 1.31617C8.79126 1.80323 8.96523 2.37587 8.96523 2.96166C8.96463 3.74683 8.65206 4.49967 8.09612 5.05494C7.54018 5.61021 6.78631 5.92252 6 5.92332ZM6 0.755511C5.56281 0.755362 5.1354 0.884686 4.77183 1.12713C4.40826 1.36957 4.12487 1.71423 3.9575 2.11752C3.79012 2.52081 3.74629 2.96461 3.83155 3.39277C3.9168 3.82094 4.12731 4.21424 4.43645 4.52293C4.74559 4.83162 5.13946 5.04182 5.56826 5.12695C5.99705 5.21208 6.44149 5.16831 6.84537 5.00118C7.24925 4.83405 7.59442 4.55107 7.83721 4.18803C8.08001 3.82499 8.20952 3.39821 8.20937 2.96166C8.20877 2.37674 7.97581 1.81594 7.5616 1.40234C7.14739 0.988736 6.58578 0.75611 6 0.755511Z"
                  fill="black"
              />
          </svg>
      ),
      text: "3 Voters",
  },
];
