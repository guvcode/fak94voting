import Head from "next/head";
import CandidateShowVotes from "./CandidateShowVotes";
import Cookies from "js-cookie";

const MyVotes = ({ votes, member }) => {
  const handleLogout = async () => {
    Cookies.remove("token");
    window.location.pathname = `/`;
  };

  return (
    <div>
      <Head>
        <title>Voting Summary</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className="container mx-auto">
        <div className=" mt-4">
          <div
            className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  class="fill-current h-6 w-6 text-teal-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">
                  Hello {member.data.firstName} {member.data.lastName}
                </p>
                <p className="text-sm">
                  Please see how you voted below.<br />Thank you!
                </p>
              </div>
            </div>
          </div>
          <div>
            {" "}
            {Object.keys(votes).map((vote) => {
              return (
                <CandidateShowVotes data={votes[vote]} key={`lbl${vote}`} />
              );
            })}
            <div className="text-center mt-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                type="button"
                onClick={() => handleLogout()}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVotes;
