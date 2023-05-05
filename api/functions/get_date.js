// Function for determining current date
module.exports = () => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        return {
            day,
            month,
            year,
        }
    } catch (err) {
        console.error(err);
    }
}