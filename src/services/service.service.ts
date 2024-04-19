import { HttpError } from "@exceptions/http.exceptions";

export class Service {
    static generate_otp = async (digit: number = 6): Promise<string> => {
        try {
            let otp: string = "";
            for (let i = 0; i < digit; i++) {
                if (i === 0) {
                    otp += Math.floor(Math.random() * 9 + 1);
                }
                else {
                    otp += Math.floor(Math.random() * 10);
                }
            }
            return otp;
        } catch (err) {
            throw new HttpError(500, err.message)
        }
    }

    static generate_random_string = async (length: number = 10): Promise<string> => {
        try {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        } catch (err) {
            throw new HttpError(500, err.message)
        }
    }

    static verification_time = async (base: Date, add_minutes: number): Promise<Date> => {
        try {
            base.setMinutes(base.getMinutes() + add_minutes);
            return base
        } catch (err) {
            throw new HttpError(500, err.message)
        }
    }
}