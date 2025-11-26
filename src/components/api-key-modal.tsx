"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (key: string) => void;
}

export function ApiKeyModal({ open, onOpenChange, onSave }: ApiKeyModalProps) {
    const [key, setKey] = useState("");

    useEffect(() => {
        const storedKey = localStorage.getItem("gemini_api_key");
        if (storedKey) setKey(storedKey);
    }, []);

    const handleSave = () => {
        if (key.trim()) {
            localStorage.setItem("gemini_api_key", key.trim());
            onSave(key.trim());
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Gemini API Key</DialogTitle>
                    <DialogDescription>
                        Your API key is stored locally in your browser. We use Gemini 2.0 Flash for image processing.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiKey" className="text-right">
                            API Key
                        </Label>
                        <Input
                            id="apiKey"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="col-span-3"
                            type="password"
                            placeholder="AIzaSy..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Key</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
