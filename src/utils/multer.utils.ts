import { FILE_UPLOAD_PATH, IMAGE_UPLOAD_PATH } from "@config";
import { Service } from "@services/service.service";
import multer from "multer";

const image_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGE_UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const random_number = Service.generate_otp();
        const unique_prefix = new Date() + "-" + Service.generate_random_string(5) + "-" + random_number;
        cb(null, unique_prefix + file.originalname);
    }
});

const file_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FILE_UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const random_number = Service.generate_otp();
        const unique_prefix = new Date() + "-" + Service.generate_random_string(5) + "-" + random_number;
        cb(null, unique_prefix + file.originalname);
    }
});

const image_file = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/gif" || file.mimetype === "image/svg+xml" || file.mimetype === "image/webp") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const file_filter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export class Multer {
    public upload_image = multer({
        storage: image_storage,
        fileFilter: image_file
    });

    public upload_file = multer({
        storage: file_storage,
        fileFilter: file_filter
    });
}