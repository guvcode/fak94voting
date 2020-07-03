const CandidateShowVotes = ({ data }) => {
  return (
    <React.Fragment>
      <div
        className="bg-gray-100 border-t-4 border-orange-500 rounded-b text-gray-900 px-4 py-3 shadow-md m-2"
        role="alert"
      >
        <div className="flex">
          <div>
            <img
              className="w-10 h-10 rounded-full mr-4 text-center"
              src={data.photo}
              alt={data.altPhoto}
            />
            <p className="font-bold">{data.name}</p>
            <p className="text-sm">for {data.position}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CandidateShowVotes;
