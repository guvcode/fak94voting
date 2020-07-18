import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import Cookies from "js-cookie";

import ErrorAlert from "../../components/ErrorAlert";
import FullPageErrorAlert from "../../components/FullPageErrorAlert";
import ButtomMenu from "../../components/ButtomMenu";
import VotingMemberCard from "../../components/VotingMemberCard";

const ManageVoters = ({ member, serverUrl, token, electionYear }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (member.data.role) {
      if (!member.data.role.includes("Electoral")) {
        // Router.push("/");
        Router.back();
        return null;
      }
    } else {
      Router.back();
      return null;
    }
  });

  useEffect(() => {
    if (search.length < 3) {
      setSearchResult([]);
      return;
    }

    fetch(`${serverUrl}/api/member/search`, {
      method: "POST",
      body: JSON.stringify({ search }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        const { doc } = res.data;
        if (doc) {
          setErrorMessage("");
          setSearchResult(doc);
        } else {
          setErrorMessage(res.error);
        }
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  }, [search]);

  const handleSearch = async (search) => {
    if (search.length == 0) {
      setSearchResult([]);
      return;
    }
  };

  return (
    <div>
      <Head>
        <title>Electoral Committee - Manage Voters</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="container mx-auto">
      <ButtomMenu member={member} />
        <div className="border-b-4 border-orange-500 rounded-lg shadow-lg p-5">
          <div className="flex flex-row items-center">
            <div className="flex-1">
              <h2 className="text-center font-bold text-orange-700 mr-2">MANAGE VOTERS</h2>

            </div>
          </div>
        </div>
        <div>
          {errorMessage.length > 0 ? (
            <ErrorAlert
              title={"Hey friend, we need to fix this"}
              message={errorMessage}
            />
          ) : null}

          <form className="mt-10">
          <p className="ml-4 mr-4">Type name or email to search</p>
            <div className="flex items-center border-b border-b-2 border-gray-500 py-2">              
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none ml-4 mr-4"
                type="text"
                placeholder="Enter name or email"
                aria-label="Name Search"
                onChange={(e) => {
                  setSearch(e.target.value.trim());
                  //handleSearch(e.target.value.trim());
                }}
              />
            </div>
          </form>
          <div className="flex flex-wrap mb-4">
            {searchResult.length > 0 &&
              searchResult.map((result) => <VotingMemberCard data={result} admin={member}  serverUrl={serverUrl} electionYear={electionYear} key={result._id}/>)}
          </div>
        </div>

      </div>
    </div>
  );
};

ManageVoters.getInitialProps = async ({ res, req, query }) => {
  const alltoken = req.headers.cookie.split(";");
  let token = alltoken.find((token) => token.includes("shcf49-tk="));

  if (!token || token == "undefined") {
    res.writeHead(301, {
      Location: "/",
    });
    res.end();
  }
  token = token.replace("shcf49-tk=", "").trim();

  const electionYear =  process.env.VOTINGYEAR;

  const { origin } = absoluteUrl(req);
  const memberInfo = await fetch(`${origin}/api/member/info`, {
    headers: { cookie: token },
  });
  const jsonMemberInfo = await memberInfo.json();

  return {
    member: jsonMemberInfo,
    serverUrl: origin,
    token: token,
    electionYear: electionYear
  };
};
export default ManageVoters;
