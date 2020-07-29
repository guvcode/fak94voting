import React, { useState, useEffect } from "react";
import Head from "next/head";
import fetch from "isomorphic-fetch";
import { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import useSWR from "swr";
import Cookies from "js-cookie";
import ErrorAlert from "../components/ErrorAlert";

const Home = ({ serverUrl, userIp }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [token, setToken] = useState("");
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [pageError, setPageError] = useState("");

  const handleSubmit = async () => {
    fetch(`${serverUrl}/api/member/tokencheck`, {
      method: "POST",
      body: JSON.stringify({ emailAddress, token, userIp }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setPageError(res.error);
        } else {
          const { tokenValid, userFound, userId } = res.data;
          if (userId) {
            Cookies.set("shcf49-tk", userId, { expires: 0.5 });
            Cookies.set("shcf49-ac", "bew", { expires: 0.5 });
            window.location.pathname = `voting/member`;
          } else
            setPageError(
              "An error occured verifying this token, please contact admin!"
            );
        }
      })
      .catch((err) => {
        setPageError(err);
      });
  };

  const handleNext = async (e) => {
    fetch(`${serverUrl}/api/member/emailcheck`, {
      method: "POST",
      body: JSON.stringify({ emailAddress }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        const { tokenSent, userFound } = res.data;
        if (userFound) {
          setPageError("");
          setShowTokenForm(tokenSent && userFound);
        } else {
          setPageError(
            "We are unable to verify provided email, please contact the electoral committee"
          );
        }
      })
      .catch((err) => {
        setPageError(err);
      });
  };

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

      <div className="container mx-auto ">
        <div className="flex items-center justify-center h-screen">
          <div className="w-full max-w-xs">
            {pageError.length > 0 ? (
              <ErrorAlert title={"Login Error"} message={pageError} />
            ) : null}
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <h2 className="block text-orange-700 text-lg font-bold mb-12">
                  FCHS 94 Voting Platform
                </h2>
                <hr />
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Registered Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="userEmail"
                  type="email"
                  placeholder="Enter your email address"
                  onChange={(e) => setEmailAddress(e.target.value.trim())}
                  value={emailAddress}
                  required
                  disabled={showTokenForm}
                />
              </div>
              {showTokenForm ? (
                <React.Fragment>
                  {" "}
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter Token
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="userToken"
                    type="text"
                    placeholder="Enter token from Whatsapp"
                    onChange={(e) => setToken(e.target.value.trim())}
                    value={token}
                    required
                  />
                </React.Fragment>
              ) : null}
              {showTokenForm ? (
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                    type="button"
                    onClick={() => handleSubmit()}
                  >
                    Submit
                  </button>

                  <a
                    className="text-center block border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
                    href="/"
                  >
                    Cancel
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => handleNext()}
                  >
                    Next
                  </button>
                </div>
              )}
            </form>
           
          </div>
        </div>
      </div>
    </div>
  );
};

Home.getInitialProps = async ({ req, query }) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { origin } = absoluteUrl(req);
  return {
    serverUrl: origin,
    userIp: ip,
  };
};

export default Home;
