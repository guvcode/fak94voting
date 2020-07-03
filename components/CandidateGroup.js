import CandidateButton from "./CandidateButton";

const CandidateGroup = ({ candidates, candidateClicked }) => {
  return candidates.map((contestant) => {
    return (
      <div>
        <CandidateButton
          data={contestant}
          whenClicked={candidateClicked}
          key={contestant._id}
        />
      </div>
    );
  });
};
export default CandidateGroup;
