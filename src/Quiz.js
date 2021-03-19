import React from "react";
import { connect } from "react-redux";
import {
  currentAnswerChanged,
  nextQuestion,
  prevQuestion,
  startQuiz
} from "./actions";
import { initTimeSpentWatcher } from "./state";
import Question from "./Question";
import QuestionList from "./QuestionList";
import Clock from "./Clock";

class Quiz extends React.Component {
  componentWillUnmount() {
    clearInterval(this.timeSpentWatcher);
  }
  componentDidMount() {
    this.props.startQuiz();
    this.timeSpentWatcher = initTimeSpentWatcher();
  }
  render() {
    const {
      quizInProgress,
      onPrevious,
      onNext,
      questions,
      currentIdx,
      onAnswerChange,
      alert,
      end
    } = this.props;
    const question = currentIdx > -1 ? questions[currentIdx] : null;
    if (!quizInProgress) {
      return (
        <div className="Quiz">
          <div className="alert">{alert}</div>
        </div>
      );
    }
    return (
      <div className="Quiz">
        <div className="header">All the best Jerome !</div>
        <Clock end={end} />
        <QuestionList />
        {question && (
          <div className="Quiz__main">
            <div className="Quiz__buttons">
              <button onClick={onPrevious}>Previous</button>
              &nbsp;
              <button onClick={onNext}>Next</button>
            </div>
            <Question
              id={question.id}
              seq={currentIdx + 1}
              text={question.text}
              answer={question.answer}
              difficulty={question.difficulty}
              image={question.image}
              onAnswerChange={onAnswerChange}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  quizInProgress: state.quizInProgress,
  questions: state.questions,
  currentIdx: state.currentIdx,
  alert: state.alert,
  end: state.quiz && state.quiz.end
});
const mapDispatchToProps = {
  startQuiz: startQuiz,
  onNext: nextQuestion,
  onPrevious: prevQuestion,
  onAnswerChange: (evt) => currentAnswerChanged(evt.target.value)
};

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
