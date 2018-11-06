import React, { Component } from "react";
import classes from "./QuizCreator.css";
import Button from "../../components/UI/Button/Button";
import {
  createControl,
  validate,
  validateForm
} from "../../form/formFramework";
import Input from "../../components/UI/Input/Input";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Select from "../../components/UI/Select/Select";
import { connect } from "react-redux";
import {
  createQuizQuestion,
  finishCreateQuiz
} from "../../store/actions/create";

function createOptionCntrl(num) {
  return createControl(
    {
      label: `Option ${num}`,
      errorMessage: "option ia a must field!",
      id: num
    },
    { required: true }
  );
}

function createFormCntrls() {
  return {
    question: createControl(
      {
        label: "Enter the question",
        errorMessage: "Question is a must field!"
      },
      { required: true }
    ),
    option1: createOptionCntrl(1),
    option2: createOptionCntrl(2),
    option3: createOptionCntrl(3),
    option4: createOptionCntrl(4)
  };
}

class QuizCreator extends Component {
  state = {
    isFormValid: false,
    rightAnswerId: 1,
    formControls: createFormCntrls()
  };

  submitHandler = event => {
    event.preventDefault();
  };

  addQuestionHandler = event => {
    event.preventDefault();

    const {
      question,
      option1,
      option2,
      option3,
      option4
    } = this.state.formControls;

    const questionItem = {
      question: question.value,
      id: this.props.quiz.length + 1,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        { text: option1.value, id: option1.id },
        { text: option2.value, id: option2.id },
        { text: option3.value, id: option3.id },
        { text: option4.value, id: option4.id }
      ]
    };

    this.props.createQuizQuestion(questionItem);

    this.setState({
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormCntrls()
    });
  };

  createQuizHandler = async event => {
    event.preventDefault();

    this.setState({
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormCntrls()
    });

    this.props.finishCreateQuiz();
  };

  onChangeHandler = (value, controlName) => {
    const formControls = { ...this.state.formControls };
    const control = { ...formControls[controlName] };

    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation);

    formControls[controlName] = control;

    this.setState({
      formControls,
      isFormValid: validateForm(formControls)
    });
  };

  renderControls() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName];

      return (
        <Auxiliary key={controlName + index}>
          <Input
            label={control.label}
            value={control.value}
            valid={control.valid}
            shouldValidate={!!control.validation}
            touched={control.touched}
            errorMessage={control.errorMessage}
            onChange={event =>
              this.onChangeHandler(event.target.value, controlName)
            }
          />
          {index === 0 ? <hr /> : null}
        </Auxiliary>
      );
    });
  }

  selectHandler = event => {
    this.setState({
      rightAnswerId: +event.target.value
    });
  };

  render() {
    const select = (
      <Select
        label="Choose the right option"
        value={this.state.rightAnswerId}
        onChange={this.selectHandler}
        options={[
          { text: 1, value: 1 },
          { text: 2, value: 2 },
          { text: 3, value: 3 },
          { text: 4, value: 4 }
        ]}
      />
    );

    return (
      <div className={classes.QuizCreator}>
        <div>
          <h1>QuizCreator</h1>

          <form onSubmit={this.submitHandler}>
            {this.renderControls()}

            {select}

            <Button
              type="primary"
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Add The Question
            </Button>

            <Button
              type="success"
              onClick={this.createQuizHandler}
              disabled={this.props.quiz.length === 0}
            >
              Create The Quiz
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    quiz: state.create.quiz
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createQuizQuestion: item => dispatch(createQuizQuestion(item)),
    finishCreateQuiz: () => dispatch(finishCreateQuiz())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizCreator);
