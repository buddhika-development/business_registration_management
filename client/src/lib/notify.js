import toast from "react-hot-toast";

export function extractMsg(errOrRes, fallback = "Something went wrong") {
    try {
        // success shape
        if (errOrRes?.data?.ok && errOrRes?.data?.message) return errOrRes.data.message;
        // axios response error
        if (errOrRes?.response?.data?.errors?.message) return errOrRes.response.data.errors.message;
        if (errOrRes?.response?.data?.message) return errOrRes.response.data.message;
        // direct errors shape
        if (errOrRes?.data?.errors?.message) return errOrRes.data.errors.message;
        if (typeof errOrRes === "string") return errOrRes;
        if (errOrRes?.message) return errOrRes.message;
    } catch { }
    return fallback;
}

export const notify = {
    success: (m) => toast.success(m || "Success"),
    error: (m) => toast.error(m || "Error"),
    info: (m) => toast(m || "Info"),
};
