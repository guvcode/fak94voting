import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";

import CandidateGroup from "../../../components/CandidateGroup";
import CandidateLabel from "../../../components/CandidateLabel";
import MyVotes from "../../../components/MyVotes";
import ErrorAlert from "../../../components/ErrorAlert";
import FullPageErrorAlert from "../../../components/FullPageErrorAlert";

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

const electionYear = 2020;

const MemberVoting = ({
  member,
  contestants,
  positions,
  serverUrl,
  userId,
  myVotes,
}) => {
  const [results, setResults] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [fetchedVotes, setFetchedVotes] = useState(
    myVotes.data && myVotes.data.selection
  );

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

  const hasVotingRights = (member) => {
    if (!member.data.votingRights) return false;

    const votingRightsCurrentYear = member.data.votingRights.filter(
      (x) => x.year == electionYear
    );
    if (votingRightsCurrentYear.length < 1) return false;
    if (!votingRightsCurrentYear[0].canVote) return false;

    return true;
  };

  const voteClicked = () => {
    const finalResults = { ...results };
    // debugger;
    fetch(`${serverUrl}/api/vote`, {
      method: "POST",
      body: JSON.stringify({
        userId: userId.memberid,
        selection: finalResults,
        electionYear: electionYear,
        votedWhen: Date.now(),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Voting successful:", res);
        setFetchedVotes(finalResults);
      })
      .catch((err) => {
        console.error("Voting ERROR:", err);
        setErrorMessage(err);
        setShowError(true);
      });
  };

  const showVoteButton = (selections) => {
    return positions.data.length == Object.keys(selections).length;
  };

  if (!member.data) {
    return (
      <FullPageErrorAlert
        title={"Something went wrong"}
        message={
          "We are unable to get your membership information, please contact the electoral committee"
        }
      />
    );
  }

  if (fetchedVotes) return <MyVotes votes={fetchedVotes} member={member} />;

  if (!hasVotingRights(member))
    return (
      <FullPageErrorAlert
        title={"Something went wrong"}
        message={
          "Your access to vote has not yet been confirmed, please contact the electoral committee!"
        }
      />
    );

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
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  Hello {member.data.firstName} {member.data.lastName}
                </span>
                <p>Your selections Will Appear Below</p>
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
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 mb-5"
                  onClick={() => voteClicked()}
                >
                  Vote Now!
                </button>
              ) : null}

              {showError ? (
                <ErrorAlert
                  title={"Something went wrong"}
                  message={errorMessage}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="mb-8"></div>
        <div>
          <div>
            {positions.data.map((position) => {
              {
                let selection = contestants.data.filter(function (contestant) {
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
          </div>
        </div>
      </div>
    </div>
  );
};

MemberVoting.getInitialProps = async ({ req, query }) => {
  const memberid = { ...query };
  const { origin } = absoluteUrl(req);

  const contestants = await fetch(`${origin}/api/contestants/${electionYear}`);
  const jsonContestants = await contestants.json();

  const resPosition = await fetch(`${origin}/api/positions/${electionYear}`);
  const jsonPosition = await resPosition.json();

  const myVotes = await fetch(`${origin}/api/myvote/${memberid.memberid}`);
  const jsonMyVotes = await myVotes.json();

  const memberInfo = await fetch(`${origin}/api/member/${memberid.memberid}`);
  const jsonMemberInfo = await memberInfo.json();

  return {
    member: jsonMemberInfo,
    contestants: jsonContestants,
    positions: jsonPosition,
    serverUrl: origin,
    userId: memberid,
    myVotes: jsonMyVotes,
  };
};
export default MemberVoting;
