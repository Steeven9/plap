export interface GameData {
  storyName: string;
  votes: Vote[];
  connectedPlayers: number;
}

export interface Vote {
  name: string;
  vote: string;
}
