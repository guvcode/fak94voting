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
        <div className="text-center mt-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            Hello {member.data.firstName} {member.data.lastName}
          </span>
          <h2> You have already voted, see how you voted below!</h2>
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
