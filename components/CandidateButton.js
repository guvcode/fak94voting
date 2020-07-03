const CandidateButton = ({data, whenClicked}) => {  
    return (
      <span
        className="inline-block bg-gray-200 rounded-full px-6 py-1 text-sm font-semibold text-gray-700 mb-5"
        onClick={() => whenClicked(data)}>
        <a href="#">
          <div className="flex items-left">
            <img
              className="w-10 h-10 rounded-full mr-4"
              src={data.photo}
              alt={data.altPhoto}
            />
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{data.name}</p>
              <p className="text-gray-600">{data.shortInfo}</p>
            </div>
          </div>
        </a>
      </span>
    );
  };
  
  export default CandidateButton;
  