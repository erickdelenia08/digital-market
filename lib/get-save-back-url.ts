export function getSafeCallbackUrl(url: string | null): string {
    if (!url) return '/';

    // Harus diawali "/" (relative path)
    // Tapi TOLAK "//" karena itu protocol-relative URL (masih bisa ke luar domain)
    if (url.startsWith('/') && !url.startsWith('//')) {
        return url;
    }

    return '/'; // fallback aman kalau mencurigakan
}