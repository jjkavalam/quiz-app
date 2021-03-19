import { connect } from "react-redux";
import { gotoQuestion } from "./actions";
import { getColorByDifficulty } from "./difficulty-color";

function QuestionList({ questions, currentIdx, gotoQuestion }) {
  return (
    <div className="QuestionList">
      {questions &&
        questions.map((question, i) => {
          const answered = question.answer && question.answer.length > 0;
          const seq = i + 1;
          return (
            <div
              key={question.id}
              className="QuestionList__item"
              style={{
                backgroundColor:
                  i === currentIdx ? "silver" : !answered && "gray"
              }}
              onClick={() => gotoQuestion(i)}
            >
              <span
                style={{
                  fontWeight: answered ? null : "bold"
                }}
              >
                {seq < 10 ? "0" + seq : seq}&nbsp;
              </span>
              {question.difficulty && (
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 4,
                    backgroundColor: getColorByDifficulty(question.difficulty)
                  }}
                />
              )}
            </div>
          );
        })}
    </div>
  );
}

const mapStateToProps = (state) => ({
  questions: state.questions,
  currentIdx: state.currentIdx
});
const mapDispatchToProps = {
  gotoQuestion
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
