export function formatTimeLeft(seconds: number): string {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatCountdown(seconds: number) {
    if (seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    const s = secs.toString().padStart(2, "0");

    // Jika waktu lebih dari 1 jam, tampilkan HH:MM:SS
    if (hours > 0) {
        return `${h}:${m}:${s}`;
    }

    // Jika kurang dari 1 jam, bisa tetap HH:MM:SS atau MM:SS
    return `00:${m}:${s}`;
}