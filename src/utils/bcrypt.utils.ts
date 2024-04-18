import * as bcrypt from 'bcrypt';
import { log } from './logger.utils';


export class Bcrypt {
    static encrypt = (plainPassword: string): Promise<string> => {
        const saltRounds = 11;
        return new Promise((resolve, reject) => {
            bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
                if (err) {
                    log.error(err);
                    reject(err)
                }
                resolve(hash);
            });
        })
    }

    static compare = (planPassword: string, hashPassword: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(planPassword, hashPassword, (err, result) => {
                if (err) {
                    
                    reject(log.error(err))
                }
                else if (!result) {
                    reject(log.error('email or password do not match'));
                }
                resolve(result);
            });
        })
    }
}