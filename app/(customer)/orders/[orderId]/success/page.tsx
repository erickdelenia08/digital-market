"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/mock-data/product';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const OrderSuccessPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  // Gunakan data dummy untuk menampilkan produk yang sukses dibeli
  const purchasedItems = MOCK_PRODUCTS.slice(0, 2);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Pembayaran Berhasil!</h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          Terima kasih atas pesanan Anda. Pesanan dengan ID <span className="font-semibold text-foreground">#{orderId}</span> telah berhasil diproses.
        </p>
      </div>

      <Card className="shadow-lg border-muted">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-2xl">Akses Produk Anda</CardTitle>
          <CardDescription className="text-base">
            Silakan unduh produk digital yang telah Anda beli di bawah ini. Tautan ini juga telah dikirim ke email Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 divide-y">
          {purchasedItems.map((item) => {
            // Ambil digital asset pertama untuk simulasi tombol download
            const asset = item.digitalAssets?.[0];
            
            return (
              <div key={item.id} className="p-6 sm:p-4 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                
                {/* Thumbnail */}
                <div className="relative w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                  <img 
                    src={item.media[0]?.url || item.coverImage} 
                    alt={item.name} 
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Detail Produk */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                  {asset ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                      File siap diunduh ({asset.type})
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-600 flex items-center gap-1">
                      Menunggu akses file...
                    </p>
                  )}
                </div>

                {/* Tombol Download */}
                <div className="w-full sm:w-auto flex-shrink-0">
                  {asset ? (
                    <Link href={asset.fileUrl || "#"} target="_blank" passHref>
                      <Button className="w-full sm:w-auto h-11" variant="default">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full sm:w-auto h-11">
                      Belum Tersedia
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="h-12 px-8">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
