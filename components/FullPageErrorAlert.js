import ErrorAlert from "./ErrorAlert";
import Head from "next/head";

const FullPageErrorAlert = ({ title, message }) => {
  return (
    <div>
      <div className="container mx-auto m-10">
        <ErrorAlert title={title} message={message} />
      </div>
    </div>
  );
};
export default FullPageErrorAlert;
