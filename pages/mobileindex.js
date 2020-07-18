import React, { useState, useEffect } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import absoluteUrl from "next-absolute-url";
import FullPageErrorAlert from "../components/FullPageErrorAlert";
import Cookies from "js-cookie";

const Mobileindex = ({ userFound, emailUsed }) => {
  useEffect(() => {
    if (userFound) {
      Cookies.set("shcf49-em", emailUsed, { expires: 0.5 });
      Router.push("/mobiletokencheck");
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Home (Mobile)</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="container mx-auto ">
        <div className="flex items-center justify-center h-screen">
          <div className="w-full max-w-xs">
            <div className="mb-4">
              <h2 className="block text-orange-700 text-lg font-bold mb-12">
                {!userFound ? (
                  <FullPageErrorAlert
                    title={"Access Exception"}
                    message={
                      "You have not been validated to use this platform yet. Please contact the electoral committee"
                    }
                  />
                ) : (
                  <h2>Please wait.....</h2>
                )}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Mobileindex.getInitialProps = async ({ req, query }) => {
  const email = query.emailaddress;
  const { origin } = absoluteUrl(req);

  const emailCheckInfo = await fetch(`${origin}/api/member/emailcheck`, {
    method: "POST",
    body: JSON.stringify({ emailAddress: email }),
    headers: { "Content-Type": "application/json" },
  });
  const emailCheckInfoJson = await emailCheckInfo.json();

  return {
    userFound: emailCheckInfoJson.data.userFound,
    emailUsed: email,
  };
};

export default Mobileindex;
