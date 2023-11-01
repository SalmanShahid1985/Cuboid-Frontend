export default {
    data() {
        return {
            phoneNumberFormat: "12345678"
        }
    },
    methods: {
        enforcePhoneFormat(model, key = 'user_phone') {
            if (model) {
                let x = model[key]
                    .replace(/\D/g, "")
                    .match(/(\d{0,3})(\d{0,3})(\d{0,2})/);

                return x[1] + x[2] + x[3];
            }
        },
    },
}