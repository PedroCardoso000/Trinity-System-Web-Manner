const onlyLetters = (value: string) =>
    value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')

const onlyNumbers = (value: string) =>
    value.replace(/\D/g, '')

const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)

    if (numbers.length <= 10) {
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
    }

    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
}

const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 8)
    return numbers.replace(/(\d{5})(\d)/, '$1-$2')
}


export {
    onlyLetters,
    onlyNumbers,
    formatPhone,
    formatZipCode,
}