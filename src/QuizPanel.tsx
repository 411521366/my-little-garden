import { useMemo, useState } from "react";
import {
  playCorrectSound,
  playGrowSound,
  playRetrySound,
} from "./assets/soundEffects";
import type { QuizPanelProps } from "./types";
import "./quiz.css";

/**
 * QuizPanel.tsx — Owned by OpenCode (the quiz is a game-logic feature).
 *
 * Shows one multiple-choice question at a time. Children can retry an
 * incorrect answer with no penalty, and each question rewards a water drop
 * only the first time it is answered correctly.
 *
 * Version 5 shuffles the three choices for every question so the correct
 * answer is not always in the same spot, and shows which of the three quiz
 * stages the current question belongs to.
 */

/** Friendly titles for the three quiz stages. */
const STAGE_TITLES: Record<number, string> = {
  1: "🌱 Plant Basics",
  2: "🌿 Growing",
  3: "🌸 Flowers & Seeds",
};

/** Headings shown when a quiz stage is finished. */
const STAGE_COMPLETE_TITLES: Record<number, string> = {
  1: "Stage 1 complete!",
  2: "Stage 2 complete!",
  3: "All quiz stages complete!",
};

/** Encouraging messages shown when a quiz stage is finished. */
const STAGE_COMPLETE_MESSAGES: Record<number, string> = {
  1: "You finished Plant Basics! 🌱 Now grow your flower before starting the next stage.",
  2: "You finished Growing! 🌿 Grow your flower, then try the final stage.",
  3: "You finished Plant Basics, Growing, and Flowers & Seeds! 🌻🌹🌷 Amazing job — keep growing your flowers!",
};

/** Fisher–Yates shuffle returning a stable order of choice indices. */
function shuffledOrder(count: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export default function QuizPanel({
  questions,
  answeredQuestionIds,
  onAnswerCorrect,
}: QuizPanelProps) {
  const [index, setIndex] = useState(0);
  // `selected` holds a DISPLAY position (after shuffling), not the original
  // choice index, so highlighting always matches what the child sees.
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  // Did THIS answer earn a brand-new water drop? Computed once per click so
  // it stays correct even after answeredQuestionIds updates.
  const [earnedNow, setEarnedNow] = useState(false);
  // Which quiz stage should we celebrate right now (1–3), or null for none.
  // Set the moment a child's correct answer finishes all questions of a stage.
  const [celebratedStage, setCelebratedStage] = useState<number | null>(null);

  // Shuffle each question's choices ONCE so the correct answer sits in a
  // random spot and the layout stays stable while the child answers.
  const orders = useMemo(
    () => questions.map((q) => shuffledOrder(q.choices.length)),
    [questions],
  );

  const question = questions[index];
  const order = orders[index];
  // Which displayed position holds the correct answer for this question.
  const correctDisplayPos = order.indexOf(question.correctIndex);
  const isCorrect = revealed && selected === correctDisplayPos;
  // Lock the choices only after a correct answer so a wrong try can be retried.
  const locked = isCorrect;

  // Progress helpers for the stage grouping shown above the question.
  const stageQuestions = questions.filter((q) => q.stage === question.stage);
  const withinStage = stageQuestions.indexOf(question) + 1;

  /**
   * Would answering `justAnsweredId` finish every question in `stage`?
   * Used to fire the celebration only on the exact answer that completes a
   * stage, so re-answering an old question never re-triggers it.
   */
  function stageCompletes(stage: number, justAnsweredId: string): boolean {
    const answered = new Set(answeredQuestionIds);
    answered.add(justAnsweredId);
    return questions
      .filter((q) => q.stage === stage)
      .every((q) => answered.has(q.id));
  }

  function choose(displayPos: number) {
    if (locked) return;

    setSelected(displayPos);
    setRevealed(true);

    if (displayPos === correctDisplayPos) {
      playCorrectSound();
      const alreadyEarned = answeredQuestionIds.includes(question.id);
      setEarnedNow(!alreadyEarned);
      onAnswerCorrect(question.id);

      // Celebrate only when this NEW correct answer completes the stage.
      if (!alreadyEarned && stageCompletes(question.stage, question.id)) {
        setCelebratedStage(question.stage);
        playGrowSound();
      }
    } else {
      playRetrySound();
      setEarnedNow(false);
    }
  }

  function nextQuestion() {
    setIndex((current) => (current + 1) % questions.length);
    setSelected(null);
    setRevealed(false);
    setEarnedNow(false);
    setCelebratedStage(null);
  }

  return (
    <section className="quiz" aria-label="Learning quiz">
      <h3 className="quiz__title">🌱 Plant Quiz</h3>
      <p className="quiz__progress">
        <span className="quiz__stage-label">{STAGE_TITLES[question.stage]}</span>
        <span>
          Stage {question.stage} of 3 · Question {withinStage} of{" "}
          {stageQuestions.length}
        </span>
      </p>

      <p className="quiz__question">{question.question}</p>

      <div className="quiz__choices">
        {order.map((originalIndex, displayPos) => {
          const choice = question.choices[originalIndex];
          const isChosen = selected === displayPos;
          const showCorrect = revealed && displayPos === correctDisplayPos;
          const showWrong = revealed && isChosen && !isCorrect;

          let className = "quiz__choice";
          if (showCorrect) className += " is-correct";
          else if (showWrong) className += " is-wrong";

          return (
            <button
              key={choice}
              type="button"
              className={className}
              onClick={() => choose(displayPos)}
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

      {/* Celebrate finishing a whole quiz stage (all 4 questions). */}
      {celebratedStage !== null && (
        <div className="quiz__stage-complete" role="status">
          <span className="quiz__stage-complete-emoji" aria-hidden="true">
            🎉
          </span>
          <div className="quiz__stage-complete-text">
            <strong>{STAGE_COMPLETE_TITLES[celebratedStage]}</strong>
            <p className="quiz__stage-complete-msg">
              {STAGE_COMPLETE_MESSAGES[celebratedStage]}
            </p>
          </div>
        </div>
      )}

      <button type="button" className="button button--ghost" onClick={nextQuestion}>
        Next question →
      </button>
    </section>
  );
}
