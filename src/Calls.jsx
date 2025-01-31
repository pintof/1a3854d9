import axios from "axios";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderList } from "primereact/orderlist";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
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
} from "./helperFunctions/formatFunctions";

export default function Calls({ base_url }) {
  //boolean switch status to switch between call UI with archive functions OR archive UI with unarchive functions
  const [archiveStatus, setArchiveStatus] = useState(true);

  //click toggle flag to switch between button UI or call details UI for each list item.aka.call entry
  const [clickedId, setClickedId] = useState();

  //loading state of mutations to control button loading spinner
  const [loading, setLoading] = useState(false);

  //options for tab navigation menu to switch between calls and archive, values are boolean (so that it can be used to control archiveStatus switch)
  const justifyOptions = [
    { icon: "pi pi-phone", value: true },
    { icon: "pi pi-inbox", value: false },
  ];
  const justifyTemplate = (option) => {
    return <i className={option.icon}></i>;
  };
  const [value, setValue] = useState(justifyOptions[0].value);

  const queryClient = useQueryClient();
  const mutationResultAlert = useRef(null);

  //mutation function to archive or unarchive a call
  const callMutation = useMutation({
    mutationFn: (archiveOrUnarchiveCall) => {
      return axios.patch(
        base_url + "/activities/" + archiveOrUnarchiveCall.id,
        {
          is_archived: archiveStatus,
        }
      );
    },
    onMutate: () => setLoading(true),
    onSuccess: (response, call) => {
      setLoading(false);
      mutationResultAlert.current.show({
        severity: "success",
        summary: "Success",
        detail: `${archiveStatus ? "Archived" : "Unarchived"} call ${call.direction == "inbound" ? "from" : "to"} ${formatPhoneNumber(call.from)}`,
      });
      queryClient.invalidateQueries({ queryKey: ["calls"] });
    },
    onError: (error, call) => {
      setLoading(false);
      mutationResultAlert.current.show({
        severity: "error",
        summary: "Error",
        detail: `Failure to ${archiveStatus ? "archive" : "unarchive"} call ${call.direction == "inbound" ? "from" : "to"} ${formatPhoneNumber(call.from)} ${error.message}`,
      });
    },
  });

  //mutation function to unarchive all calls
  const unArchiveAllMutation = useMutation({
    mutationFn: () => {
      return axios.patch(base_url + "/reset");
    },
    onMutate: () => setLoading(true),
    onSuccess: () => {
      setLoading(false);
      mutationResultAlert.current.show({
        severity: "success",
        summary: "Success",
        detail: "Unarchived all calls",
      });
      queryClient.invalidateQueries({ queryKey: ["calls"] });
    },
    onError: (error) => {
      setLoading(false);
      mutationResultAlert.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failure to unarchive all calls" + error.message,
      });
    },
  });

  //list item template for each call entry
  const listItems = (call) => {
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

  //fetch calls data
  const { data, status, error } = useQuery({
    queryKey: ["calls"],
    queryFn: () => {
      return axios
        .get(base_url + "/activities")
        .then((res) =>
          res.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
    },
  });
  if (status === "error") {
    alert(error.message);
  }
  if (status === "pending") {
    return <ProgressSpinner />;
  }
  //render calls list
  if (status == "success") {
    return (
      <div className="card xl:flex xl:justify-content-center">
        <Tooltip id="tooltip" target="#archive-button" />
        <Tooltip id="tooltip" target="#unarchive-button" />
        <Tooltip id="tooltip" target="#missed-call" />
        <Tooltip id="tooltip" target="#voice-mail" />
        <Tooltip id="tooltip" target="#outbound-call" />
        <Tooltip id="tooltip" target="#inbound-call" />
        <Tooltip id="tooltip" target="#tab-menu" />
        <Toast ref={mutationResultAlert} />
        <OrderList
          dataKey="id"
          value={data}
          itemTemplate={listItems}
          filter
          filterBy="from,created_at"
          header={
            <div className="header-container">
              <SelectButton
                id="tab-menu"
                data-pr-tooltip="Calls | Archive"
                data-pr-position="left"
                value={value}
                onChange={(e) => {
                  setValue(e.value);
                  setArchiveStatus(e.value);
                }}
                itemTemplate={justifyTemplate}
                optionLabel="value"
                options={justifyOptions}
              />
              <span className="header">AirCall</span>
              <Button
                tooltip={archiveStatus ? "Archive All" : "Unarchive All"}
                icon={
                  archiveStatus ? (
                    <ArchiveBoxArrowDownIcon className="archive-all-button" />
                  ) : (
                    <ArchiveBoxXMarkIcon className="unarchive-all-button" />
                  )
                }
                loading={loading}
                onClick={() =>
                  archiveStatus
                    ? data
                        .filter((call) => call.is_archived == false)
                        .forEach(callMutation.mutate)
                    : unArchiveAllMutation.mutate()
                }
              />
            </div>
          }
        ></OrderList>
      </div>
    );
  }
}

//prop types for base_url
Calls.propTypes = {
  base_url: PropTypes.string.isRequired,
};
