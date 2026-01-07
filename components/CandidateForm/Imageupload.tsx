"use client";

import { FormEvent, useRef, useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useGenerateUploadUrl, useSendCandidateImage } from "@/hooks/candidate";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";

type ImageUploadProps = {
  candidateId: Id<"candidates">;
};

export const ImageUpload = ({ candidateId }: ImageUploadProps) => {
  const t = useTranslations();
  const generateUploadUrl = useGenerateUploadUrl();
  const sendImage = useSendCandidateImage();

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleSendImages = async (event: FormEvent) => {
    event.preventDefault();

    for (const image of selectedImages) {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": image?.type ?? "application/octet-stream",
        },
        body: image,
      });
      const { storageId } = await result.json();
      await sendImage({ storageId, candidateId });
    }

    setSelectedImages([]);
    imageInput.current!.value = "";
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const allowedFiles = 3 - selectedImages.length;
    const filesToAdd = Array.from(files).slice(0, allowedFiles);

    setSelectedImages([...selectedImages, ...filesToAdd]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSendImages}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
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
            disabled={selectedImages.length >= 3}
            ref={imageInput}
            onChange={(e) => handleImageSelect(e.target.files)}
            className="hidden"
          />
        </label>
      </Card>

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
        disabled={selectedImages.length === 0}
        className="w-full"
        size="lg"
      >
        <ImageIcon className="w-4 h-4 mr-2" />
        {t("UPLOAD_BUTTON_TEXT", { count: selectedImages.length })}
      </Button>
    </form>
  );
};
