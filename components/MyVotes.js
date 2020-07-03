import Head from "next/head";
import CandidateShowVotes from "./CandidateShowVotes";

const MyVotes = ({ votes }) => {
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
          {" "}
          <h2> Voting done, see how you voted below!</h2>
          <div>
            {" "}
            {Object.keys(votes).map((vote) => {
              return <CandidateShowVotes data={votes[vote]} key={`lbl${vote}`} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVotes;
