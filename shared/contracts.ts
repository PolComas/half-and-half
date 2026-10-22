export type Side = "left" | "right";
export type Phase =
  | "waiting_partner"
  | "ideas"
  | "generating"
  | "painting"
  | "generation_failed"
  | "generation_uncertain"
  | "generation_exhausted"
  | "budget_blocked";
export interface RoomView {
  roomId: string;
  code: string;
  version: number;
  phase: Phase;
  side: Side;
  participantId: string;
  idea: string;
  confirmed: boolean;
  partnerPresent: boolean;
  partnerConfirmed: boolean;
  attemptsUsed: number;
  attemptsLeft: number;
  generationAvailable: boolean;
  baseId: string | null;
  ideas: { left: string; right: string } | null;
}
export interface Problem {
  code: string;
  message: string;
  retryable: boolean;
}
