const ErrorAlert = ({ title, message }) => {
  return (
    <React.Fragment>
      <div role="alert mt-10">
        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
          {title}
        </div>
        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>{message}.</p>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ErrorAlert;
