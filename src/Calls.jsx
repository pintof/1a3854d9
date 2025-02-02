import PropTypes from "prop-types";
import { useRef, useState, useContext } from "react";
import { OrderList } from "primereact/orderlist";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { PrimeReactContext } from "primereact/api";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import {
  useFetchCalls,
  useCallMutation,
  useUnArchiveAllMutation,
} from "./helperFunctions/queryFunctions";
import ListItemTemplate from "./templates/ListItemTemplate";

export default function Calls({ base_url }) {
  //boolean switch status to switch between call UI with archive functions OR archive UI with unarchive functions
  const [archiveStatus, setArchiveStatus] = useState(true);

  //click toggle flag to switch between archive/unarchive button OR call duration display of a specific call when clicked on
  const [clickedId, setClickedId] = useState();

  //loading state of mutations to control button loading spinner
  const [loading, setLoading] = useState(false);

  //context from prime react for switching between themes
  const { changeTheme } = useContext(PrimeReactContext);
  //boolean to switch between light & dark theme
  let toggleThemeBoolean;

  //options for tab navigation menu to switch between calls and archive, values are boolean (so that it can be used to control archiveStatus switch)
  const justifyOptions = [
    { icon: "pi pi-phone", value: true },
    { icon: "pi pi-inbox", value: false },
  ];
  const justifyTemplate = (option) => {
    return <i className={option.icon}></i>;
  };
  const [value, setValue] = useState(justifyOptions[0].value);

  //ref for alert component (Toast) to display success/failure prompts after fetches & mutations
  const mutationResultAlert = useRef(null);

  //mutation hook to archive or unarchive a call
  const callMutation = useCallMutation(
    base_url,
    setLoading,
    mutationResultAlert,
    archiveStatus
  );

  //mutation hook to unarchive all calls
  const unArchiveAllMutation = useUnArchiveAllMutation(
    base_url,
    setLoading,
    mutationResultAlert
  );

  //fetch calls data
  const { data, status, error } = useFetchCalls(base_url);
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
        {/* various tooltips for UI */}
        <Tooltip id="tooltip" target="#archive-button" />
        <Tooltip id="tooltip" target="#unarchive-button" />
        <Tooltip id="tooltip" target="#missed-call" />
        <Tooltip id="tooltip" target="#voice-mail" />
        <Tooltip id="tooltip" target="#outbound-call" />
        <Tooltip id="tooltip" target="#inbound-call" />
        <Tooltip id="tooltip" target="#tab-menu" />
        {/* alert component for success/failure prompts after fetches & mutations */}
        <Toast ref={mutationResultAlert} />
        {/* List component to display list of items of all calls */}
        <OrderList
          dataKey="id"
          value={data}
          itemTemplate={(call) =>
            ListItemTemplate(
              call,
              archiveStatus,
              clickedId,
              setClickedId,
              callMutation
            )
          }
          filter
          filterBy="from,created_at"
          header={
            <div className="header-container">
              {/* Tab navigation button to switch between Calls UI & Arhcive UI */}
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
              <span
                className="header"
                onClick={() =>
                  toggleThemeBoolean
                    ? changeTheme(
                        "/themes/lara-light-cyan/theme.css",
                        "/themes/soho-dark/theme.css",
                        "theme-link",
                        () => (toggleThemeBoolean = !toggleThemeBoolean)
                      )
                    : changeTheme(
                        "/themes/soho-dark/theme.css",
                        "/themes/lara-light-cyan/theme.css",
                        "theme-link",
                        () => (toggleThemeBoolean = !toggleThemeBoolean)
                      )
                }
              >
                AirCall
              </span>
              {/* Button which dynamically renders as Archive All button if in the Calls UI, or Unarchive All button if in the Archive UI */}
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

//prop type for base_url
Calls.propTypes = {
  base_url: PropTypes.string.isRequired,
};
