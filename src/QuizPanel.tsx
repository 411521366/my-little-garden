import { useState } from "react";
import type { QuizPanelProps } from "./types";
import "./quiz.css";

/**
 * QuizPanel.tsx — Owned by OpenCode (the quiz is a game-logic feature).
 *
 * Shows one multiple-choice question at a time. Children can retry an
 * incorrect answer with no penalty, and each question rewards a water drop
 * only the first time it is answered correctly.
 */

export default function QuizPanel({
  questions,
  answeredQuestionIds,
  onAnswerCorrect,
}: QuizPanelProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  // Did THIS answer earn a brand-new water drop? Computed once per click so
  // it stays correct even after answeredQuestionIds updates.
  const [earnedNow, setEarnedNow] = useState(false);

  const question = questions[index];
  const isCorrect = revealed && selected === question.correctIndex;
  // Lock the choices only after a correct answer so a wrong try can be retried.
  const locked = isCorrect;

  function choose(choiceIndex: number) {
    if (locked) return;

    setSelected(choiceIndex);
    setRevealed(true);

    if (choiceIndex === question.correctIndex) {
      const alreadyEarned = answeredQuestionIds.includes(question.id);
      setEarnedNow(!alreadyEarned);
      onAnswerCorrect(question.id);
    } else {
      setEarnedNow(false);
    }
  }

  function nextQuestion() {
    setIndex((current) => (current + 1) % questions.length);
    setSelected(null);
    setRevealed(false);
    setEarnedNow(false);
  }

  return (
    <section className="quiz" aria-label="Learning quiz">
      <h3 className="quiz__title">🌱 Plant Quiz</h3>
      <p className="quiz__progress">
        Question {index + 1} of {questions.length}
      </p>

      <p className="quiz__question">{question.question}</p>

      <div className="quiz__choices">
        {question.choices.map((choice, choiceIndex) => {
          const isChosen = selected === choiceIndex;
          const showCorrect = revealed && choiceIndex === question.correctIndex;
          const showWrong = revealed && isChosen && !isCorrect;

          let className = "quiz__choice";
          if (showCorrect) className += " is-correct";
          else if (showWrong) className += " is-wrong";

          return (
            <button
              key={choice}
              type="button"
              className={className}
              onClick={() => choose(choiceIndex)}
              disabled={locked}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Friendly feedback and a short explanation. */}
      {revealed && (
        <div
          className={`quiz__feedback${isCorrect ? " is-good" : " is-try"}`}
          role="status"
        >
          {isCorrect ? (
            <>
              <strong>🎉 Correct!</strong>{" "}
              {earnedNow ? (
                <span className="quiz__reward">You earned a water drop 💧</span>
              ) : (
                <span className="quiz__reward">
                  You already earned this drop — nice try remembering!
                </span>
              )}
            </>
          ) : (
            <strong>💪 Almost! Try again — you can do it!</strong>
          )}
          <p className="quiz__explanation">{question.explanation}</p>
        </div>
      )}

      <button type="button" className="button button--ghost" onClick={nextQuestion}>
        Next question →
      </button>
    </section>
  );
}
