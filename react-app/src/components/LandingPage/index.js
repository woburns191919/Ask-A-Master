import GetTopics from "../GetTopics";
import QuestionAnswers from "../QuestionAnswers";

import "./styles.css";

export default function LandingPage() {
  return (
    <main className="landing-page-container">
      <GetTopics />
      <QuestionAnswers />
    </main>
  );
}
