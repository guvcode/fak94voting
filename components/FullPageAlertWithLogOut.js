import ErrorAlert from "./ErrorAlert";
import Head from "next/head";
import { logOut } from "../lib/helper";
import ButtomMenu from "./ButtomMenu";

const FullPageErrorAlert = ({ title, message, member }) => {
  const handleLogout = async () => {
    logOut(member.data.email);
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

      <div className="container mx-auto m-10">
        <ButtomMenu member={member} />
        <ErrorAlert title={title} message={message} />
      </div>
    </div>
  );
};
export default FullPageErrorAlert;
