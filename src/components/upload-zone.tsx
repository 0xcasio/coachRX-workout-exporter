"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UploadZoneProps {
    onUpload: (files: File[]) => void;
    isProcessing: boolean;
    progress?: number;
}

export function UploadZone({ onUpload, isProcessing, progress = 0 }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        // Create object URLs for previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Cleanup
        return () => {
            newPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files?.length) {
            const newFiles = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith('image/')
            );
            setFiles(prev => [...prev, ...newFiles]);
        }
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files).filter(
                file => file.type.startsWith('image/')
            );
            setFiles(prev => [...prev, ...newFiles]);
        }
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleProcess = () => {
        onUpload(files);
        // Don't clear files immediately so user sees what's being processed
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    isProcessing && "opacity-50 pointer-events-none"
                )}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileInput}
                    disabled={isProcessing}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                    <div className="p-4 bg-muted rounded-full">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Drop screenshots here</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            or click to browse (PNG, JPG)
                        </p>
                    </div>
                </label>
            </div>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">{files.length} files selected</h4>
                        <Button
                            onClick={handleProcess}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Start Extraction"
                            )}
                        </Button>
                    </div>

                    <div className="grid gap-2">
                        {files.map((file, i) => (
                            <Card key={i} className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border">
                                        <Image
                                            src={previews[i]}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-sm truncate">{file.name}</span>
                                </div>
                                {!isProcessing && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeFile(i)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>

                    {isProcessing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Processing...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
