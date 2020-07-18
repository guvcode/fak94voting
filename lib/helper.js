import Cookies from "js-cookie";

export const logOut = async (email) => {
  Cookies.remove("shcf49-tk");
  const accessType = Cookies.get("shcf49-ac");
  Cookies.remove("shcf49-ac");
  accessType == "elibom"
    ? (window.location.href = `/mobileindex?emailaddress=${email}`)
    : (window.location.pathname = `/`);
};
