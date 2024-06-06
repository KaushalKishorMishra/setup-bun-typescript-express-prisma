import multer from "multer";
import { FILE_UPLOAD_PATH, IMAGE_UPLOAD_PATH } from "@config";
import { Service } from "@services/service.service";
import { HttpError } from "@/exceptions/http.exceptions";
import fs from "fs"
import path from "path"


const image_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const upload_path = path.join(IMAGE_UPLOAD_PATH + file.fieldname);
        fs.mkdirSync(upload_path, { recursive: true })
        cb(null, upload_path);
    },
    filename: async (req, file, cb) => {
        const random_number = await Service.generate_otp(5);
        const random_string = await Service.generate_random_string(5);
        const unique_prefix = new Date().getTime() + "-" + random_string + "-" + random_number + "-";
        cb(null, unique_prefix + file.originalname);
    }
});

const file_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const upload_path = path.join(FILE_UPLOAD_PATH + file.fieldname);
        fs.mkdirSync(upload_path, { recursive: true })
        cb(null, upload_path);
    },
    filename: async (req, file, cb) => {
        const random_number = await Service.generate_otp(5);
        const random_string = await Service.generate_random_string(5);
        const unique_prefix = new Date().getTime() + "-" + random_string + "-" + random_number + "-";
        cb(null, unique_prefix + file.originalname);
    }
})

const image_filter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/gif" || file.mimetype === "image/svg+xml" || file.mimetype === "image/webp") {
        cb(null, true);
    } else {
        cb(new HttpError(400, 'Invalid file type'), false);
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
    public image_multer = multer({
        storage: image_storage,
        fileFilter: image_filter
    });
    public file_multer = multer({
        storage: file_storage,
        fileFilter: file_filter
    })
}