import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    fetchCurrentQuestion();
  }, []);

  const fetchCurrentQuestion = async () => {
    const response = await axios.get('http://localhost:3001/quiz/current');
    setQuestion(response.data);
    setSelectedAnswer(null);
  };

  const fetchNextQuestionOrGrade = async () => {
    const response = await axios.get('http://localhost:3001/quiz/next');
    if (response.data.question) {
      setQuestion(response.data);
      setSelectedAnswer(null);
    } else {
      // No more questions, fetch and display the grade
       fetchGrade();
    }
  };

  const fetchPrevQuestion = async () => {
    const response = await axios.get('http://localhost:3001/quiz/prev');
    setQuestion(response.data);
    setSelectedAnswer(null);
  };

  const submitAnswer = async (index) => {
    setSelectedAnswer(index);
    await axios.post('http://localhost:3001/quiz/answer', { answer: index });
  };

  const fetchGrade = async () => {
    const response = await axios.get('http://localhost:3001/quiz/grade');
    setGrade(response.data.grade);
  };

  if (grade !== null) {
    return (
      <div>
        <h2>Your Grade: {grade}</h2>
      </div>
    );
  }

  return (
    <div>
      {question && (
        <>
          <h2>{question.question}</h2>
          <ul>
            {question.answers && question.answers.map((answer, index) => (
              <li key={index}>
                <button
                  style={{
                    backgroundColor: selectedAnswer === index ? 'lightgreen' : '',
                  }}
                  onClick={() => submitAnswer(index)}
                >
                  {answer}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={fetchPrevQuestion} disabled={!question}>
        Previous
      </button>
      <button onClick={fetchNextQuestionOrGrade} disabled={selectedAnswer === null}>
        Next
      </button>
    </div>
  );
};

export default Quiz;
