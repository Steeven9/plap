export interface GameData {
  storyName: string;
  votes: Vote[];
}

export interface Vote {
  name: string;
  vote: string;
}
