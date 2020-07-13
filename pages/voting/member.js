import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import Cookies from "js-cookie";

import CandidateGroup from "../../components/CandidateGroup";
import CandidateLabel from "../../components/CandidateLabel";
import MyVotes from "../../components/MyVotes";
import ErrorAlert from "../../components/ErrorAlert";
import FullPageErrorAlert from "../../components/FullPageErrorAlert";
//import useAuth, { ProtectRoute } from "../../contexts/auth";

const fetcher = async (...args) => {
  const res = await fetch(...args);
  return res.json();
};

const electionYear = 2020;

const MemberVoting = ({
  pollInfo,
  member,
  contestants,
  positions,
  serverUrl,
  token,
  myVotes,
}) => {
  const [results, setResults] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [fetchedVotes, setFetchedVotes] = useState(
    myVotes && myVotes.data && myVotes.data.selection
  );

  useEffect(() => {
    if (!token) {
      Router.push("/none");
      return null;
    }
  });

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

  //if (pollInfo && pollInfo.data.)

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
    fetch(`${serverUrl}/api/member/vote`, {
      method: "POST",
      body: JSON.stringify({
        userId: token,
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

  const handleLogout = async () => {
    Cookies.remove("token");
    window.location.pathname = `/`;
  };

  const showVoteButton = (selections) => {
    return positions.data.length == Object.keys(selections).length;
  };

  if (!member) {
    //&& !member.data
    return (
      <FullPageErrorAlert
        title={"Hey friend, we need to fix this"}
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
        title={"Hey friend, we need to fix this"}
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
                  title={"Hey friend, we need to fix this"}
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
  );
};

MemberVoting.getInitialProps = async ({ res, req, query }) => {
  let token = req.headers.cookie
  //console.log("token is - " + token);
  debugger;

  if (!token || token == "undefined") {
    res.writeHead(301, {
      Location: "/",
    });
    res.end();
  }
  token = token.replace("token=", "");

  const { origin } = absoluteUrl(req);
  const pollInfo = await fetch(`${origin}/api/pollinfo/${electionYear}`);
  const jsonPollInfo = await pollInfo.json();

  const contestants = await fetch(`${origin}/api/contestants/${electionYear}`);
  const jsonContestants = await contestants.json();

  const resPosition = await fetch(`${origin}/api/positions/${electionYear}`);
  const jsonPosition = await resPosition.json();

  const myVotes = await fetch(`${origin}/api/member/myvote`, {
    headers: { cookie: token },
  });
  const jsonMyVotes = await myVotes.json();

  const memberInfo = await fetch(`${origin}/api/member/info`, {
    headers: { cookie: token },
  });
  const jsonMemberInfo = await memberInfo.json();

  debugger;
  return {
    pollInfo: jsonPollInfo,
    member: jsonMemberInfo,
    contestants: jsonContestants,
    positions: jsonPosition,
    serverUrl: origin,
    token: token,
    myVotes: jsonMyVotes,
  };
};
export default MemberVoting;
