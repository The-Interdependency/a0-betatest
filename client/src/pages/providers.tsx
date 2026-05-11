// 4:4
// N:M
// Providers page retired — energy-provider paradigm replaced by model instantiation.
// Redirect all traffic to the Agents console tab.
import { Redirect } from "wouter";

export default function ProvidersPage() {
  return <Redirect to="/agents" />;
}
// N:M
// 4:4
