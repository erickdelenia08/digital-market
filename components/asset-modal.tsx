'use client';

import React, { useState } from 'react';
import {
    X,
    FolderArchive,
    FileText,
    CloudDownload,
    Download,
    ExternalLink,
    Loader2,
    Info
} from 'lucide-react';

interface AssetModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
    assets?: {
        id: string;
        name: string;
        type: string;
        fileSize?: number | null;
        extension?: string | null;
        linkUrl?: string | null;
    }[];
}

export default function AssetsModal({
    isOpen = true,
    onClose,
    title = "Assets",
    description = "Select and download individual assets included in this package:",
    assets = []
}: AssetModalProps) {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleDownload = (id: string, isLink: boolean, url?: string) => {
        setDownloadingId(id);
        
        if (isLink && url) {
             setTimeout(() => {
                setDownloadingId(null);
                window.open(url, '_blank');
            }, 500);
            return;
        }

        // For files, we trigger the download API
        const downloadUrl = `/api/downloads/${id}`;
        
        // Create a temporary link to trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.setAttribute('download', '');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
            setDownloadingId(null);
        }, 1500);
    };

    const formatBytes = (bytes?: number | null, decimals = 2) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#1a1b22]/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Main Modal Card */}
            <div className="relative z-10 w-full max-w-[540px] bg-white border border-[#c7c4d7] rounded-xl shadow-2xl overflow-hidden text-[#1a1b22] flex flex-col max-h-[90vh]">
                {/* Header */}
                <header className="flex justify-between items-start p-6 pb-4 shrink-0">
                    <div className="flex flex-col gap-1 pr-4">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#1a1b22]">
                            {title}
                        </h2>
                        <p className="text-sm text-[#464554]">
                            {description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#464554] hover:text-[#1a1b22] p-1 transition-colors duration-200 rounded-lg hover:bg-[#e8e7f1] active:scale-95 shrink-0"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                {/* Content Body */}
                <main className="px-6 pb-8 flex flex-col gap-4 overflow-y-auto">
                    {assets.map((asset) => {
                        const isLink = asset.type === 'LINK';
                        const isPdf = asset.extension?.toLowerCase() === 'pdf';
                        const isArchive = ['zip', 'rar', '7z'].includes(asset.extension?.toLowerCase() || '');
                        
                        return (
                            <div key={asset.id} className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#f4f2fd] border border-[#c7c4d7] rounded-lg hover:border-[#6063ee] transition-all duration-300">
                                <div className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 ${
                                    isLink ? 'bg-[#e8e7f1] text-[#5f5e61]' :
                                    isPdf ? 'bg-[#ffdad6]/60 text-[#ba1a1a]' :
                                    'bg-[#6063ee]/10 text-[#4648d4]'
                                }`}>
                                    {isLink ? <CloudDownload className="w-7 h-7" /> : 
                                     isPdf ? <FileText className="w-7 h-7" /> : 
                                     <FolderArchive className="w-7 h-7" />}
                                </div>
                                
                                <div className="flex-grow flex flex-col gap-1 overflow-hidden text-center sm:text-left w-full">
                                    <span className="text-sm font-semibold text-[#1a1b22] truncate">
                                        {asset.name}
                                    </span>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        {!isLink && asset.fileSize ? (
                                            <span className="px-2 py-[2px] bg-[#1a1b22] text-white text-[10px] font-bold uppercase rounded tracking-wider">
                                                {formatBytes(asset.fileSize)}
                                            </span>
                                        ) : isLink && asset.linkUrl ? (
                                            <span className="text-[11px] text-[#464554] font-mono opacity-70 truncate">
                                                {new URL(asset.linkUrl).hostname}
                                            </span>
                                        ) : null}
                                        {asset.extension && !isLink && (
                                            <span className="px-2 py-[2px] bg-[#c8c5ca] text-[#1b1b1e] text-[10px] font-bold uppercase rounded tracking-wider">
                                                {asset.extension}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDownload(asset.id, isLink, asset.linkUrl || undefined)}
                                    disabled={downloadingId === asset.id}
                                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all active:scale-[0.98] shadow-sm disabled:opacity-80 shrink-0 ${
                                        isLink 
                                        ? 'border border-[#4648d4] text-[#4648d4] hover:bg-[#4648d4]/5' 
                                        : 'bg-[#4648d4] text-white hover:bg-[#6063ee]'
                                    }`}
                                >
                                    {downloadingId === asset.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {isLink ? 'Opening...' : 'Preparing...'}
                                        </>
                                    ) : (
                                        <>
                                            {isLink ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                            {isLink ? 'Open Link' : 'Download'}
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                    
                    {assets.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            No assets available.
                        </div>
                    )}
                </main>

                {/* Footer Meta */}
                <footer className="px-6 py-4 bg-[#eeedf7] border-t border-[#c7c4d7] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#464554]" />
                        <span className="text-xs text-[#464554]">
                            Downloads are logged for security
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#904900] animate-pulse" />
                        <span className="text-xs text-[#464554]">Server: Secure Storage</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}