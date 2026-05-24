"use client";

import { FormEvent, useRef, useState, useEffect, useActionState, startTransition } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CandidateImage } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "./badge";
import { uploadCandidateImagesAction } from "@/lib/actions/candidateImages.actions";

type ImageUploadProps = {
  candidateId: string;
  initialImages?: CandidateImage[];
};

export const ImageUpload = ({ candidateId, initialImages = [] }: ImageUploadProps) => {
  const t = useTranslations();
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<CandidateImage[]>(initialImages);
  const [state, dispatch, isPending] = useActionState(uploadCandidateImagesAction, null);

  const MAX_IMG = 3;

  useEffect(() => {
    if (!state) return;
    if (state.success && state.images) {
      setExistingImages((prev) => [...prev, ...(state.images as CandidateImage[])]);
      setSelectedImages([]);
      if (imageInput.current) imageInput.current.value = "";
    }
  }, [state]);

  const handleSendImages = (e: FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

    const formData = new FormData();
    formData.append("candidateId", candidateId);
    selectedImages.forEach((file) => formData.append("file", file));
    startTransition(() => dispatch(formData));
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = MAX_IMG - existingImages.length - selectedImages.length;
    const toAdd = Array.from(files).slice(0, allowed);
    setSelectedImages((prev) => [...prev, ...toAdd]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSendImages} className="w-full max-w-2xl mx-auto space-y-4">
      <Card className="border-2 border-dashed hover:border-primary transition-colors">
        <label className="flex flex-col items-center justify-center py-12 px-6 cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{t("UPLOAD_IMAGE")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("UPLOAD_IMAGE_FORMATS")}
              </p>
            </div>
            <Badge variant="secondary" className="mt-2">
              {t("SELECTED_OF", { count: selectedImages.length })}
            </Badge>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={
              selectedImages.length >= MAX_IMG || existingImages.length >= MAX_IMG
            }
            ref={imageInput}
            onChange={(e) => handleImageSelect(e.target.files)}
            className="hidden"
          />
        </label>
      </Card>

      {state?.error && (
        <p className="text-sm text-destructive text-center">{state.error}</p>
      )}

      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {existingImages.map((img) => (
            <Card key={img.id} className="relative overflow-hidden">
              <img
                src={img.url}
                alt="תמונת מועמד"
                className="w-full h-32 object-cover"
              />
            </Card>
          ))}
        </div>
      )}

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {selectedImages.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={t("PREVIEW_IMAGE", { index: index + 1 })}
                className="w-full h-32 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {t("IMAGE_SIZE_KB", { size: (image.size / 1024).toFixed(1) })}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        type="submit"
        disabled={selectedImages.length === 0 || isPending}
        className="w-full"
        size="lg"
      >
        <ImageIcon className="w-4 h-4 mr-2" />
        {isPending
          ? "מעלה..."
          : t("UPLOAD_BUTTON_TEXT", { count: selectedImages.length })}
      </Button>
    </form>
  );
};
