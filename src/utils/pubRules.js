let numReg = /^\d+$|^\d+[.]?\d+$/

export default {
    numValidate(rule, value, cb) {
        if (value) {
            if (!numReg.test(value)) {
                cb(new Error('该项只能填数字'))
            } else {
                cb()
            }
        } else {
            cb()
        }
    }
}