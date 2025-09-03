export function isDateInMonth(month: number, date: Date): boolean {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === month;
}

export function getCurrentMonth(): number {

    const now = new Date();
    return now.getMonth();
}

export function getMonthName(month: number): string {
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
    return monthsOfYear[month];
}