export interface GameData {
  storyName: string;
  votes: Map<string, string>;
  connectedPlayers: number;
}

export interface Vote {
  name: string;
  vote: string;
}
