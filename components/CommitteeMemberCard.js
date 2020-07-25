import Switch from "react-switch";
import React, { useState, useEffect, useContext } from "react";
import { titleCase } from "title-case";

const CommitteeMemberCard = ({ data, admin, serverUrl }) => {
  const [isElectoral, setIsElectoral] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateServer, setUpdateServer] = useState(false);

  useEffect(() => {
    setIsElectoral(data.role ? data.role.includes("Electoral") : false);
    setIsAdmin(data.role ? data.role.includes("Admin") : false);
  }, [data]);

  useEffect(() => {
    if (!updateServer) return;

    let role = "";

    isAdmin ? (role = "Admin") : (role = "");
    isElectoral ? (role = role.concat("|Electoral")) : (role = role.concat(""));

    fetch(`${serverUrl}/api/member/updaterole`, {
      method: "POST",
      body: JSON.stringify({
        role,
        id: data._id,
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

  const handleIsElectoralChange = () => {
    setIsElectoral(!isElectoral);
    setUpdateServer(true);
  };

  const handleIsAdminChange = () => {
    setIsAdmin(!isAdmin);
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
            <p className="font-bold titlecase">
              {data.firstName} {data.lastName}
            </p>
            <p className="text-sm"> {data.email}</p>
          </div>{" "}
        </div>{" "}
        <hr className="mb-4" />
        <div className="ml-25">
          <label>
            <p>Electoral Cmte</p>
            <Switch
              onChange={() => handleIsElectoralChange()}
              checked={isElectoral}
              className="react-switch"
              height={24}
              disabled={admin.data._id == data._id || data.specialStatus}
            />
          </label>
          <label>
            <p>Is Admin</p>
            <Switch
              onChange={() => handleIsAdminChange()}
              checked={isAdmin}
              className="react-switch"
              height={24}
              disabled={data.specialStatus}
            />
          </label>

          {errorMessage.length > 0 ? <p className="text-red-700 font-bold">* Update failed</p> : null}
        </div>
      </div>
    </React.Fragment>
  );
};
export default CommitteeMemberCard;
