import { HttpError } from '@/exceptions/http.exceptions'
import { Payload } from '@/interfaces/payload.interface'
import { JWT_SECRET_KEY } from '@config'
import * as jwt from 'jsonwebtoken'

export class JWT {

    static sign_jwt = async (payload: Payload, expiresIn = '5d'): Promise<string> => {
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn, issuer: "" })
        return token
    }

    static verify_jwt = async (token: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
                if (err) {
                    reject(err)
                }
                else if (!decoded) {
                    reject(new HttpError(401, 'Invalid JWT token'))
                }
                resolve(decoded)
            })
        })
    }
}