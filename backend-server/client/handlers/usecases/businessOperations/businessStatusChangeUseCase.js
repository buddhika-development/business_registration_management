import { checkStatus, findApplicationNo, updateAppStatus } from "../../repositories/businessRegistrationRepository.js";

export default async function businessStatusChangeUseCase(body) {
    const appNo = body.applicationNo;
    console.log("body", appNo)

    const exists = await findApplicationNo(appNo);
    if (!exists) {
        return {
            ok: false,
            status: 404,
            message: "Application number not found."
        };
    }

    const status = await checkStatus(appNo);
    console.log("status", status);
    if (status.applicationstatus === 'approved') {
        return {
            ok: false,
            status: 400,
            message: "Application already approved"
        };
    }

    if (status.applicationstatus === 'rejected') {
        return {
            ok: false,
            status: 400,
            message: "Application already rejected"
        };
    }


    try {
        const result = await updateAppStatus({ appNo });
        console.log("result", result);
    } catch (e) {
        const status = e.status || 500;
        const message = e.message || 'Can not approve application';
        return { ok: false, status, message };
    }

    return {
        ok: true,
        status: 200,
        message: 'Application Approved',
        data: { applicationNo: appNo }
    };

}