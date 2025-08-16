import multer from 'multer';

const storage = multer.memoryStorage();

function pdfFilter(req, file, cb) {
    // accept only application/pdf
    if (file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname)) {
        return cb(null, true);
    }
    cb(new Error(`${file.fieldname} must be a PDF`));
}

export const uploadDocs = multer({
    storage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB per file (adjust)
        files: 10
    }
}).fields([
    { name: 'gnCertificates', maxCount: 1 },
    { name: 'affidavit', maxCount: 1 },
    { name: 'ownerNicCopy', maxCount: 1 },
    { name: 'propertyNicCopy', maxCount: 1 },
    { name: 'varipanamAssessmentNotice', maxCount: 1 },
    { name: 'leaseAgreement', maxCount: 1 },
    { name: 'tradeLicenseDoc', maxCount: 1 },
    { name: 'moh', maxCount: 1 }
]);
