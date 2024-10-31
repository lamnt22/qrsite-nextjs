import isEmail from 'validator/lib/isEmail'

export const checkFormatEmail = async (email: string) => {
    if(email && !isEmail(email.trim())) return false

    return true
}
