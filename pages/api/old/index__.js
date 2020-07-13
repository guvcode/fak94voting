import React, { useState, useEffect } from "react";
import Head from "next/head";
import fetch from "isomorphic-fetch";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import useSWR from "swr";

import CandidateGroup from "../../../components/CandidateGroup";
import CandidateLabel from "../../../components/CandidateLabel";
import MyVotes from "../../../components/MyVotes";

const Home = ({ contestants, positions, serverUrl, userId, myVotes }) => {
  const [results, setResults] = useState([]);
  const [fetchedVotes, setFetchedVotes] = useState(myVotes.selection);

  const candidateClicked = (selection) => {
    const data = { ...results };
    data[selection.position] = selection;
    setResults(data);
  };

  const closeClicked = (selection) => {
    const newResults = { ...results };
    delete newResults[selection.position];
    setResults(newResults);
  };

  const voteClicked = () => {
    const finalResults = { ...results };
    fetch(`${serverUrl}/api/vote`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        selection: finalResults,
        votedWhen: Date.now,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Voting successful:", res);
        setFetchedVotes (finalResults);
      })
      .catch((err) => {
        console.error("Voting ERROR:", err);
      });
  };

  const showVoteButton = (selections) => {
    return positions.length == Object.keys(selections).length;
  };
  if (fetchedVotes) return  <MyVotes votes={fetchedVotes} />
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="container mx-auto">
        <div className="border-b-4 border-orange-500 rounded-lg shadow-lg p-5">
          <div className="flex flex-row items-center">
            <div className="flex-1">
              <h5 className="font-bold uppercase text-gray-600 mb-3">
                Your selection
              </h5>
              <div className="flex flex-wrap mb-4">
                {Object.keys(results).map((key) => {
                  return (
                    <CandidateLabel
                      closeClicked={closeClicked}
                      data={results[key]}
                      key={`lbl${key}`}
                    />
                  );
                })}
              </div>
              {showVoteButton(results) ? (
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4"
                  onClick={() => voteClicked()}
                >
                  Vote Now!
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="mb-8"></div>
        <div>
          <div>
            {positions.map((position) => {
              {
                let selection = contestants.filter(function (contestant) {
                  return contestant.position == position;
                });
                return (
                  <React.Fragment key={`frg${position}`}>
                    <h3 className="m-4">Candidates for {position}</h3> <br />
                    <div
                      className="flex flex-wrap mb-4"
                      key={position}
                      key={`div${position}`}
                    >
                      <CandidateGroup
                        candidates={selection}
                        candidateClicked={candidateClicked}
                        key={`grp${position}`}
                      />
                    </div>
                  </React.Fragment>
                );
              }
            })}
            ;
          </div>
        </div>
      </div>
    </div>
  );
};

Home.getInitialProps = async ({ req, query }) => {
  const userId = { ...query };
  const { origin } = absoluteUrl(req);

  const res = await fetch(`${origin}/api/data`);
  const json = await res.json();

  const resPosition = await fetch(`${origin}/api/positions`);
  const jsonPosition = await resPosition.json();

  const myVote = await fetch(`${origin}/api/myvote`, {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const jsonMyVote = await myVote.json();

  return {
    contestants: json,
    positions: jsonPosition,
    serverUrl: origin,
    userId: userId,
    myVotes: jsonMyVote,
  };
};

export default Home;
