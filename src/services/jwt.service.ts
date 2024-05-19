import { JWT_SECRET_KEY } from '@config'
import * as jwt from 'jsonwebtoken'

export class JWT {
    static verify_jwt = async (token: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    reject(err)
                }
                resolve(decoded)
            })
        })
    }
}