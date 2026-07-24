import Link from 'next/link';
import {
  ShoppingBag,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Receipt,
  Download,
} from 'lucide-react';
import Footer from '@/components/footer';
import { getUserOrders } from '@/app/actions/orders';

// Enum Status untuk Styling Badge & Aksesibilitas
type OrderStatus = 'PAID' | 'PENDING' | 'EXPIRED' | 'FAILED' | 'COMPLETED' | 'CANCELLED';

// Helper Helper untuk Format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Component Badge Status
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lunas</span>
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Menunggu Pembayaran</span>
        </span>
      );
    case 'EXPIRED':
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Kedaluwarsa</span>
        </span>
      );
    default:
      return null;
  }
};

export default async function OrdersPage() {
  const res = await getUserOrders();
  const orders = res.data || [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* --- PAGE HEADER --- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2 shadow-inner">
                <Receipt className="w-3.5 h-3.5" />
                <span>Transaction History</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                My Orders
              </h1>
            </div>

            {/* Link Cepat ke Halaman Library */}
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Buka My Library</span>
            </Link>
          </div>

          {/* --- ORDERS LIST CONTAINER --- */}
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const latestPayment = order.payments?.[0];
                const paymentMethod = latestPayment?.paymentMethod || "N/A";
                const orderNumber = `ORD-${new Date(order.createdAt).getFullYear()}-${order.id.substring(0, 4).toUpperCase()}`;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Card Header (Order ID & Status) */}
                    <div className="p-5 bg-slate-50/70 border-b border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {orderNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <div>
                        <StatusBadge status={order.status as OrderStatus} />
                      </div>
                    </div>

                    {/* Card Body (Item List) */}
                    <div className="p-5 md:p-6 space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-4">
                            {/* Tile Icon Placeholder */}
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-inner">
                              <ShoppingBag className="w-6 h-6 text-indigo-600" />
                            </div>

                            <div>
                              <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-indigo-600 transition-colors">
                                <Link href={`/products/${item.product.slug}`}>
                                  {item.productName}
                                </Link>
                              </h3>
                              <p className="text-xs text-slate-500 font-medium mt-1">
                                Metode Bayar: <span className="text-slate-700 font-semibold">{paymentMethod}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-xs text-slate-400 block font-medium">Harga</span>
                            <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                              {formatRupiah(Number(item.price))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Card Footer (Total & Actions) */}
                    <div className="p-5 bg-slate-50/40 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      {/* Total Info */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pembayaran:</span>
                        <span className="text-lg font-black text-slate-900">
                          {formatRupiah(order.totalAmount)}
                        </span>
                      </div>

                      {/* Conditional Action Buttons */}
                      <div className="flex items-center gap-3">
                        {(order.status === 'COMPLETED') && (
                          <>
                            <Link
                              href="/library"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                            >
                              <span>Akses Aset</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </>
                        )}

                        {order.status === 'PENDING' && (
                          <>
                            <Link
                              href={`/checkout/${order.id}`}
                              className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                            >
                              <span>Bayar Sekarang</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </>
                        )}

                        {(order.status === 'EXPIRED' || order.status === 'CANCELLED') && (
                          <Link
                            href="/products"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                          >
                            <span>Beli Ulang</span>
                          </Link>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State jika belum ada transaksi */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Belum Ada Transaksi</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Kamu belum melakukan pembelian aset digital apapun. Jelajahi katalog produk kami untuk memulai.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  <span>Eksplor Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}