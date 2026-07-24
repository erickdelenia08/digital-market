"use client";

import { useState, useTransition } from "react";
import { Star, Calendar, ThumbsUp, MessageSquarePlus, CheckCircle2, Trash2, Edit, MoreVertical } from "lucide-react";
import { createReview, deleteReview } from "@/app/actions/review-actions"; // Import Server Action
import { reviewSchema, type ReviewFormValues } from "@/lib/validation/reviews";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ReviewUser {
    id: string;
    name: string | null;
    image: string | null;
}

interface ReviewItem {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: ReviewUser;
}

interface ProductReviewsSectionProps {
    productId: string;
    averageRating: number;
    reviewCount: number;
    reviews: ReviewItem[];
    hasPurchased: boolean; // Flag apakah user berhak mengulas
    userReview?: ReviewItem | null; // Ulasan eksis jika user sudah pernah mengulas
}

export default function ProductReviewsSection({
    productId,
    averageRating,
    reviewCount,
    reviews,
    hasPurchased,
    userReview,
}: ProductReviewsSectionProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [rating, setRating] = useState<number>(userReview?.rating || 5);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState<string>(userReview?.comment || "");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isPendingDelete, startDeleteTransition] = useTransition();
    const [isExpanded, setIsExpanded] = useState(false);

    const displayedReviews = isExpanded ? reviews : reviews.slice(0, 3);

    // 1. Kalkulasi Distribusi Persentase Bintang Dinamis dari Data
    const getStarDistribution = () => {
        if (reviewCount === 0) {
            return [5, 4, 3, 2, 1].map((star) => ({ star, pct: "0%", count: 0 }));
        }

        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach((r) => {
            if (r.rating >= 1 && r.rating <= 5) {
                counts[r.rating as keyof typeof counts]++;
            }
        });

        return [5, 4, 3, 2, 1].map((star) => {
            const cnt = counts[star as keyof typeof counts];
            const pctValue = Math.round((cnt / reviewCount) * 100);
            return { star, pct: `${pctValue}%`, count: cnt };
        });
    };

    const starDistribution = getStarDistribution();

    // 2. Submit Handler dengan Validasi Zod
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const validation = reviewSchema.safeParse({ rating, comment });
        if (!validation.success) {
            // setErrorMsg(validation.error.errors[0].message);
            setErrorMsg(validation.error.message);
            return;
        }

        startTransition(async () => {
            const res = await createReview({
                productId,
                rating,
                comment,
            });

            if (res.success) {
                setIsDialogOpen(false);
                window.location.reload();
            } else {
                setErrorMsg(res.error || "Gagal menyimpan ulasan.");
            }
        });
    };

    const handleDeleteReview = (productId: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
            startDeleteTransition(async () => {
                const res = await deleteReview(productId);
                if (res.success) {
                    window.location.reload();
                } else {
                    alert(res.error || "Gagal menghapus ulasan.");
                }
            });
        }
    };

    return (
        <section id="reviews-section" className="mt-12 lg:mt-16 pt-10 border-t border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Ratings & Reviews</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Authentic feedback given directly by verified buyers.
                    </p>
                </div>

                {/* Tombol Tulis/Edit Ulasan (Hanya tampil jika user sudah beli) */}
                {hasPurchased && (
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <MessageSquarePlus className="w-4 h-4" />
                        <span>{userReview ? "Edit Review Anda" : "Tulis Review"}</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Summary Left Panel Card */}
                <div className="sticky top-0 lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md shadow-slate-200/40 text-center flex flex-col items-center justify-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Global Score</p>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">
                        {averageRating.toFixed(1)}
                    </p>

                    <div className="flex items-center gap-0.5 mt-2.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(averageRating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-2">
                        Based on {reviewCount} platform reviews
                    </p>

                    {/* Graphical Star Bars distribution */}
                    <div className="w-full mt-6 space-y-2.5 border-t border-slate-100 pt-5">
                        {starDistribution.map((item) => (
                            <div key={item.star} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                <span className="w-3 shrink-0 text-left">{item.star}</span>
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                        style={{ width: item.pct }}
                                    />
                                </div>
                                <span className="w-8 shrink-0 text-right text-slate-400 font-extrabold">{item.pct}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Individual Reviews List Right Column */}
                <div className="lg:col-span-8 w-full space-y-4">
                    {reviews.length > 0 ? (
                        <>
                            {displayedReviews.map((review) => {
                                const userName = review.user.name || "Anonymous User";
                                const userInitials = userName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase();

                                return (
                                    <div
                                        key={review.id}
                                        className="bg-white rounded-2xl border border-slate-200/70 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-250 flex flex-col gap-3"
                                    >
                                        {/* Review Row Meta Header */}
                                        <div className="flex items-start justify-between w-full gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Avatar Initial Pill atau Image */}
                                                {review.user.image ? (
                                                    <img
                                                        src={review.user.image}
                                                        alt={userName}
                                                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm flex items-center justify-center text-xs font-black text-indigo-600 shrink-0">
                                                        {userInitials}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-extrabold text-slate-900 truncate">
                                                            {userName}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100/60 uppercase tracking-wide inline-flex items-center gap-1">
                                                            <CheckCircle2 className="w-2.5 h-2.5" /> Verified Purchase
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < review.rating
                                                                        ? "text-amber-400 fill-amber-400"
                                                                        : "text-slate-200"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-slate-300" />{" "}
                                                            {new Date(review.createdAt).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dropdown Menu Titik 3 untuk Aksi User */}
                                            {userReview?.id === review.id && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger render={<button
                                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent outline-none focus:ring-2 focus:ring-slate-200"
                                                        aria-label="Opsi Ulasan"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>}>

                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-36 bg-white shadow-lg border border-slate-100 rounded-xl p-1">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setRating(userReview.rating);
                                                                setComment(userReview.comment || "");
                                                                setIsDialogOpen(true);
                                                            }}
                                                            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg px-2.5 py-2 cursor-pointer transition-colors"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            disabled={isPendingDelete}
                                                            onClick={() => handleDeleteReview(productId)}
                                                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50/80 rounded-lg px-2.5 py-2 cursor-pointer transition-colors disabled:opacity-50"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            <span>Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* View All Button */}
                            {reviews.length > 3 && (
                                <div className="pt-2 flex justify-center">
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                                    >
                                        {isExpanded ? "Sembunyikan Sebagian" : "Lihat Semua Ulasan"}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                            <p className="text-sm font-semibold text-slate-400 italic">
                                Belum ada ulasan untuk produk ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL DIALOG REVIEW FORM --- */}
            {
                isDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {userReview ? "Edit Ulasan Anda" : "Tulis Ulasan Produk"}
                            </h3>

                            {errorMsg && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Star Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                        Beri Rating
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 focus:outline-none transition-transform active:scale-95"
                                            >
                                                <Star
                                                    className={`w-7 h-7 ${star <= (hoverRating || rating)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-slate-200"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment Textarea */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                        Komentar (Opsional)
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={4}
                                        placeholder="Bagikan pengalaman Anda menggunakan produk digital ini..."
                                        className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
                                    >
                                        {isPending ? "Menyimpan..." : "Kirim Review"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </section >
    );
}