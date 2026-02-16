export interface DnaSequence {
  dna: string[];
}

export interface MutantRequest {
  dna: string[];
}

export interface StatsResponse {
  count_mutant_dna: number;
  count_human_dna: number;
  ratio: number;
}

export type MessageType = "success" | "error" | "loading" | "mutant" | "human";

export interface MessageProps {
  type: MessageType;
  children: React.ReactNode;
  icon?: string;
  role?: "status" | "alert";
  ariaLive?: "polite" | "assertive";
}
