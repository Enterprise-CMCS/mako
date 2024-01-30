import { useMemo, useState } from "react";
import { BLANK_VALUE } from "@/consts";

export const ReviewTeamList = ({ team }: { team: string[] | undefined }) => {
  const [expanded, setExpanded] = useState(false);
  const displayTeam = useMemo(
    () => (expanded ? team : team?.slice(0, 3)),
    [expanded, team]
  );
  return !displayTeam || !displayTeam.length ? (
    BLANK_VALUE
  ) : (
    <ul>
      {displayTeam.map((reviewer, idx) => (
        <li key={`reviewteam-ul-${reviewer}-${idx}`}>{reviewer}</li>
      ))}
      {team && team?.length > 3 && (
        <li className={"text-xs text-sky-700 hover:cursor-pointer"}>
          <button onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "Show less" : "Show more"}
          </button>
        </li>
      )}
    </ul>
  );
};
