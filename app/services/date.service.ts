export function isDateInCurrentMonth(date: Date): boolean {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

//export function to get current month
export function getCurrentMonth(): string {

    const monthsOfYear: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const now = new Date();
    return monthsOfYear[now.getMonth()];
}