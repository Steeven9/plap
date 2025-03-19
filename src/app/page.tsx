import VoteSelector from "@/components/voteSelector";
import Link from "next/link";

export default function Home() {
  const defaultStoryKey = process.env.NEXT_DEFAULT_ISSUE_KEY;

  return (
    <>
      <div className="m-4">
        {/* TODO make component and r/w from localstorage */}
        Name
        <br />
        <input
          type="text"
          placeholder="Best developer ever"
          className="bg-white text-black"
        />
      </div>

      <div className="m-4">
        Story
        <br />
        <input
          type="text"
          placeholder={`${defaultStoryKey}...`}
          defaultValue={defaultStoryKey}
          className="bg-white text-black"
        />
      </div>

      <div className="m-4">
        <div>Your vote</div>
        <VoteSelector />
      </div>

      <div className="m-4">
        <div>Resources</div>
        {
          //TODO grab from env vars
        }
        <Link className="block ml-1" href="">
          Reference stories
        </Link>
        <Link className="block ml-1" href="">
          Jira board
        </Link>
      </div>
    </>
  );
}
