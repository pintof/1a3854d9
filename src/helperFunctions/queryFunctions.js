import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatPhoneNumber } from "./formatFunctions";

//fetch calls data
export const useFetchCalls = (base_url) => {
  return useQuery({
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
};

//mutation function to archive or unarchive a call
export const useCallMutation = (
  base_url,
  setLoading,
  mutationResultAlert,
  archiveStatus
) => {
  const queryClient = useQueryClient();
  return useMutation({
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
};

//mutation function to unarchive all calls
export const useUnArchiveAllMutation = (
  base_url,
  setLoading,
  mutationResultAlert
) => {
  const queryClient = useQueryClient();
  return useMutation({
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
};
