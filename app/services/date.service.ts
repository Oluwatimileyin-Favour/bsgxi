export function isDateInMonth(year: number, month: number, date: Date): boolean {
    const now = new Date();
    return date.getFullYear() === year && date.getMonth() === month;
}

export function getCurrentMonth(): number {

    const now = new Date();
    return now.getMonth();
}

export function getCurrentYear(): number {

    const now = new Date();
    return now.getFullYear();
}

export function getSeasonYear(seasonId: number): number { //todo update later

    if(seasonId === 1) return 2025
    else return 2026
}

export function getAllSeasonYears(): string[] {
    return ['2025', '2026']
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