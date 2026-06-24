import { Navigate } from "react-router-dom";
import { getContinueLearningUrl } from "@/features/learn/learningSession";

export default function StudentLearnRedirect() {
  return <Navigate to={getContinueLearningUrl()} replace />;
}
