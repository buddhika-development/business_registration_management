import { formatDateTime } from "@/utils/TimeFormatter";
import { validityLabel, validityStyles } from "@/utils/ValidityLableProcessor";
import { Badge } from "../ui/Badge";

export const DocumentCard = ({ doc, onReminder, isSending }) => {
  const isInvalid = doc.document_validity === false;
  const isPending = String(doc.document_authenticity || '').trim().toLowerCase() === 'pending';

  const showReminder = isInvalid || (isPending && !isInvalid);
  const reminderReason = isInvalid ? 'invalid' : (isPending ? 'pending' : '');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* File "icon" */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-slate-200 grid place-items-center">
          <span className="text-xs base-text uppercase">
            {(doc.document_name || 'doc').slice(0, 3)}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          <p className="base-text">
            <span className="font-semibold">Name:</span> {doc.document_name}
          </p>
          <p className="base-text">
            <span className="font-semibold">Application No:</span> {doc.applicationno}
          </p>
          <p className="base-text">
            <span className="font-semibold">Created:</span> {formatDateTime(doc.provider_created_at)}
          </p>
          <p className="base-text">
            <span className="font-semibold">Authenticity:</span>{' '}
            {doc.document_authenticity || '—'}
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Badge className={validityStyles(doc.document_validity)}>
            {validityLabel(doc.document_validity)}
          </Badge>

          {showReminder && (
            <button
              type="button"
              onClick={() => onReminder?.(doc, reminderReason)}
              disabled={isSending}
              className={[
                'ml-1 inline-flex items-center px-3 py-1.5 rounded-lg text-sm',
                // Slightly different accent when invalid vs pending (optional)
                isInvalid
                  ? 'border border-red-300 bg-red-50 hover:bg-red-100 text-red-800'
                  : 'border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800',
                isSending ? 'opacity-70 cursor-not-allowed' : '',
              ].join(' ')}
              aria-disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Reminder'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};