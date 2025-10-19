import classNames from "classnames";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { useRaids } from "./api/getRaids";
import CreateRaidSheet from "./components/CreateRaidSheet";
import RaidCard from "./components/RaidCard";
import RaidSkeleton from "./components/RaidSkeleton";

const Raids = () => {
  const { data: raids, isLoading, isError } = useRaids();

  const keyUTC = (iso: string) =>
    formatInTimeZone(parseISO(iso), "UTC", "yyyy-MM-dd");

  return (
    <div
      className={classNames({
        "flex flex-col gap-2 p-2": true,
        "justify-evenly": raids && raids?.length >= 4,
      })}
    >
      <div className="w-full text-center grow">
        <CreateRaidSheet />
      </div>

      {/* <menu className="flex items-center justify-center h-12 gap-2 m-4 mt-0 border select-none rounded-xl">
        <span>todos 12</span>
        <span>passados 3</span>
      </menu> */}

      <div className="flex flex-wrap w-full justify-evenly gap-y-4">
        {raids &&
          raids
            .sort((a, b) => (keyUTC(a.date) < keyUTC(b.date) ? -1 : 1))
            .reverse()
            .map((raid) => (
              <RaidCard
                key={raid._id}
                _id={raid._id}
                date={raid.date}
                platform={raid.platform}
                url={raid.url}
                shareMessage={raid.shareMessage}
                content={raid.content}
              />
            ))}

        {isLoading &&
          Array.from({ length: 12 }).map((_, index) => (
            <RaidSkeleton key={index} />
          ))}

        {isError && !isLoading && (
          <p className="w-full text-sm text-center select-none">
            Nenhum Raid encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default Raids;
