const C = {
    primary: '#5252C9', bg: '#FFFFFF', card: '#E9EEF7', accent: '#B4D1FB', deep: '#0B0B60'
};

export function govVerifyEmailHTML({ officerName, providerOrg, docName, applicationNo, linkUrl }) {
    const name = officerName || 'Officer';
    return `
  <table role="presentation" width="100%" style="background:${C.bg};font-family:Arial,sans-serif;">
    <tr><td align="center" style="padding:28px 16px;">
      <table width="600" style="background:${C.card};border-radius:12px;padding:24px;">
        <tr><td>
          <h2 style="margin:0 0 8px 0;color:${C.primary};">Document Verification Request</h2>
          <p style="margin:0 0 12px 0;color:${C.deep};">Dear ${name},</p>
          <p style="margin:0 0 8px 0;color:#111">Please verify the document below for a Sole Proprietorship application.</p>
          <ul style="margin:0 0 16px 20px;padding:0;color:#111">
            <li><b>Application No:</b> ${applicationNo}</li>
            <li><b>Document:</b> ${docName}</li>
            ${providerOrg ? `<li><b>Authority:</b> ${providerOrg}</li>` : ''}
          </ul>
          <p style="margin:0 0 20px 0;color:#111">Click the button to review the PDF and <b>Approve</b> or <b>Reject</b>.
             This is a one-time, expiring link.</p>
          <p style="text-align:center;margin:24px 0;">
            <a href="${linkUrl}" target="_blank"
               style="background:${C.primary};color:#fff;text-decoration:none;
                      padding:12px 20px;border-radius:10px;display:inline-block;">
              Review & Take Action
            </a>
          </p>
          <p style="font-size:12px;color:#555;">If the button doesn’t work, copy this link:<br>
            <span style="word-break:break-all;color:${C.deep};">${linkUrl}</span>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>`;
}
