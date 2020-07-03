const CandidateLabel = ({ data, closeClicked }) => {
  return (
    <React.Fragment>
      <div
        className="bg-gray-100 border-t-4 border-orange-500 rounded-b text-gray-900 px-4 py-3 shadow-md m-2"
        role="alert"
      >
        <div className="flex">
          <div className="py-1" onClick={() => closeClicked(data)}>
            <svg
              className="fill-current h-6 w-6 text-red-800 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </div>
          <div>            
          <img
          className="w-10 h-10 rounded-full mr-4 text-center"
          src={data.photo}
          alt={data.altPhoto}
        />
            <p className="font-bold">{data.name}</p>
            <p className="text-sm">
            for {data.position}
            </p>
          
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CandidateLabel;
