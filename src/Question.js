import { connect } from "react-redux";

import imgBrush from "./images/brush_skyblue.png";
import { getColorByDifficulty } from "./difficulty-color";
import { selectDifficulty } from "./actions";

export function Question({
  seq,
  text,
  onAnswerChange,
  answer,
  difficulty,
  selectDifficulty,
  image
}) {
  const difficulties = ["Easy", "Medium", "Hard"];
  return (
    <div className="Question">
      <div>
        <span className="Question__seq">
          <b>Q{seq}</b>
        </span>
        <div className="Question__text">
          {text}
          {image && (
            <img className="Question__image" alt="Question" src={image} />
          )}
        </div>
      </div>

      <div>
        <div className="Question__difficulty_box">
          <img
            style={{
              height: 50,
              backgroundColor: getColorByDifficulty(difficulty)
            }}
            src={imgBrush}
            alt={"Difficulty: " + (difficulty || "None")}
          />
          <div>
            {difficulties.map((difficulty) => (
              <div
                key={difficulty}
                onClick={() => selectDifficulty(difficulty)}
                className="difficulty_item"
                style={{
                  backgroundColor: getColorByDifficulty(difficulty)
                }}
              />
            ))}
          </div>
        </div>

        <input
          className="Question__answer"
          style={{ color: getColorByDifficulty(difficulty) }}
          value={answer || ""}
          onChange={onAnswerChange}
          type="text"
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  selectDifficulty
};

export default connect(mapStateToProps, mapDispatchToProps)(Question);
