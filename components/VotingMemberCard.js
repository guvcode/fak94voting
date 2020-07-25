import Switch from "react-switch";
import React, { useState, useEffect, useContext } from "react";
import { addBasePath } from "next/dist/next-server/lib/router/router";

const VotingMemberCard = ({ data, admin, serverUrl, electionYear }) => {
  const [canVote, setCanVote] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateServer, setUpdateServer] = useState(false);

  useEffect(() => {
    const canVote =
      data.votingRights &&
      data.votingRights.find((x) => x.year == electionYear && x.canVote);
    setCanVote(canVote ? true : false);
  }, [data]);

  useEffect(() => {
    if (!updateServer) return;

    let role = "";

    fetch(`${serverUrl}/api/member/updatevotingstatus`, {
      method: "POST",
      body: JSON.stringify({
        canVote,
        id: data._id,
        votingYear: electionYear,
        changedBy: admin.data.firstName.concat(" ").concat(admin.data.lastName),
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        const doc = res.data;
        if (doc) {
          setErrorMessage("");
        } else {
          setErrorMessage("res.error");
        }
      })
      .catch((err) => {
        setErrorMessage("err");
      });
  }, [updateServer]);

  const handleCanVote = () => {
    setCanVote(!canVote);
    setUpdateServer(true);
  };

  return (
    <React.Fragment>
      <div
        className="bg-gray-100 border-t-4 border-orange-500 rounded-b text-gray-900 px-4 py-3 shadow-md m-2"
        role="alert"
      >
        <div className="flex">
          <div>
            <p className="font-bold">
              {data.firstName} {data.lastName}
            </p>
            <p className="text-sm"> {data.email}</p>
          </div>{" "}
        </div>{" "}
        <hr className="mb-4" />
        <div className="ml-25">
          <label>
            <p>Can Vote</p>
            <Switch
              onChange={() => handleCanVote()}
              checked={canVote}
              className="react-switch"
              height={24}
              disabled={admin.data._id == data._id || data.specialStatus}
            />
          </label>
          {errorMessage.length > 0 ? (
            <p className="text-red-700 font-bold">* Update failed</p>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
};
export default VotingMemberCard;
