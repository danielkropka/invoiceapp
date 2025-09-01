"use client";

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  userName?: string | null;
  onImageChange?: (imageUrl: string) => void;
}

export default function ProfilePictureUpload({
  currentImage,
  userName,
  onImageChange,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentImage || null
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Walidacja typu pliku
    if (!file.type.startsWith("image/")) {
      toast.error("Nieprawidłowy typ pliku", {
        description: "Wybierz plik graficzny (JPG, PNG, GIF, WebP).",
      });
      return;
    }

    // Walidacja rozmiaru pliku (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Plik jest za duży", {
        description: "Maksymalny rozmiar pliku to 5MB.",
      });
      return;
    }

    // Tworzenie podglądu
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      onImageChange?.(result);
    };
    reader.readAsDataURL(file);

    // Symulacja uploadu (w rzeczywistej aplikacji tutaj byłby prawdziwy upload)
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Zdjęcie zostało załadowane!", {
        description: "Twoje nowe zdjęcie profilowe zostało zapisane.",
      });
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    onImageChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Zdjęcie zostało usunięte");
  };

  const getInitials = () => {
    if (!userName) return "U";
    return userName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Current Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Zdjęcie profilowe"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>

              {/* Upload Status Badge */}
              {isUploading && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}

              {previewImage && !isUploading && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg">
                {userName || "Użytkownik"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {previewImage
                  ? "Zdjęcie profilowe"
                  : "Brak zdjęcia profilowego"}
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-3">
              <div className="flex justify-center">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div>
                <p className="font-medium">
                  {isUploading ? "Przesyłanie..." : "Przeciągnij zdjęcie tutaj"}
                </p>
                <p className="text-sm text-muted-foreground">
                  lub kliknij aby wybrać plik
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">JPG</Badge>
                <Badge variant="outline">PNG</Badge>
                <Badge variant="outline">GIF</Badge>
                <Badge variant="outline">WebP</Badge>
                <Badge variant="outline">Max 5MB</Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Wybierz zdjęcie
            </Button>

            {previewImage && (
              <Button
                variant="outline"
                onClick={removeImage}
                disabled={isUploading}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Wskazówki
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Użyj zdjęcia o wymiarach co najmniej 200x200 pikseli</li>
              <li>• Najlepsze będą zdjęcia kwadratowe</li>
              <li>• Unikaj zdjęć z małym kontrastem</li>
              <li>• Maksymalny rozmiar pliku: 5MB</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
