import {logOut} from "../lib/helper"

const ButtomMenu = ({ member }) => {
  const handleLogout = async () => {
     logOut (member.data.email);
  };
  return (
    <React.Fragment>
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6 mb-5">
        <p className="font-bold titlecase text-gray-200">
          Logged in as - {member.data.firstName} {member.data.lastName}
        </p>
        <div className="w-full block lg:flex lg:items-stretch lg:w-auto ">
          <div className="text-sm lg:flex-grow lg:float-right">
            {member.data.role && member.data.role.includes("Admin") ? (
              <a
                href="/admin/electoralcommittee"
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-yellow-500 hover:bg-gray-700 mt-4 mr-4 lg:mt-0"
              >
                Manage Electoral Committee
              </a>
            ) : null}
            {member.data.role && member.data.role.includes("Electoral") ? (
              <a
                href="/admin/managevoters"
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-yellow-500 hover:bg-gray-700 mt-4 mr-4 lg:mt-0"
              >
                Manage Voters
              </a>
            ) : null}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleLogout(member.data.email)}
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};
export default ButtomMenu;
