import {
  PhoneArrowDownLeftIcon,
  PhoneArrowUpRightIcon,
  PhoneXMarkIcon,
  EnvelopeIcon,
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import {
  formatPhoneNumber,
  formatDate,
  formatDuration,
} from "../helperFunctions/formatFunctions";

//template to use for each item in list of calls
const ListItemTemplate = (
  call,
  archiveStatus,
  clickedId,
  setClickedId,
  callMutation
) => {
  return (
    <div
      className="flex flex-wrap p-2 align-items-center gap-3"
      id={call.is_archived == archiveStatus ? "hide" : null}
      onClick={() => setClickedId(call.id)}
    >
      {(() => {
        if (call.call_type == "missed") {
          return (
            <PhoneXMarkIcon
              id="missed-call"
              data-pr-tooltip="Missed Call"
              data-pr-position="left"
              className="w-2rem shadow-1 flex-shrink-0 border-round"
            />
          );
        } else if (call.call_type == "voicemail") {
          return (
            <EnvelopeIcon
              id="voice-mail"
              data-pr-tooltip="Voice Mail"
              data-pr-position="left"
              className="w-2rem shadow-1 flex-shrink-0 border-round"
            />
          );
        } else if (call.direction == "outbound") {
          return (
            <PhoneArrowUpRightIcon
              id="outbound-call"
              data-pr-tooltip="Outbound Call"
              data-pr-position="left"
              className="w-2rem shadow-1 flex-shrink-0 border-round"
            />
          );
        } else {
          return (
            <PhoneArrowDownLeftIcon
              id="inbound-call"
              data-pr-tooltip="Inbound Call"
              data-pr-position="left"
              className="w-2rem shadow-1 flex-shrink-0 border-round"
            />
          );
        }
      })()}
      <div className="flex-1 flex flex-column gap-2 xl:mr-8">
        <span className="font-bold">{formatPhoneNumber(call.from)}</span>
        <div className="flex align-items-center gap-2">
          <span className="text-sm">{formatDate(call).yymmdd}</span>
        </div>
        <span className="text-sm">{formatDate(call).hhmm}</span>
      </div>
      <span className={clickedId == call.id ? "hidden" : "text-m"}>
        {formatDuration(call.duration)}
      </span>
      <span>
        {archiveStatus ? (
          <ArchiveBoxArrowDownIcon
            data-pr-tooltip="Archive Call"
            id="archive-button"
            className={clickedId != call.id ? "hidden" : "w-2rem"}
            onClick={() => callMutation.mutate(call)}
          />
        ) : (
          <ArchiveBoxXMarkIcon
            data-pr-tooltip="Unarchive Call"
            id="unarchive-button"
            className={clickedId != call.id ? "hidden" : "w-2rem"}
            onClick={() => callMutation.mutate(call)}
          />
        )}
      </span>
    </div>
  );
};

export default ListItemTemplate;
