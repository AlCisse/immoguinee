<?php

namespace App\Services;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ImageService
{
    /**
     * Upload et optimiser une image
     */
    public function uploadImage(Property $property, UploadedFile $file, int $order = 0): PropertyImage
    {
        // Générer un nom unique
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = 'properties/' . $property->id . '/' . $filename;

        // Stocker l'image originale
        $file->storeAs('properties/' . $property->id, $filename, 'public');

        // Créer une miniature
        $thumbnailPath = $this->createThumbnail($file, $property->id, $filename);

        // Créer l'enregistrement en base
        return PropertyImage::create([
            'property_id' => $property->id,
            'path' => $path,
            'thumbnail_path' => $thumbnailPath,
            'order' => $order,
            'alt' => $property->title,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);
    }

    /**
     * Créer une miniature
     */
    private function createThumbnail(UploadedFile $file, int $propertyId, string $filename): string
    {
        $thumbnailPath = 'properties/' . $propertyId . '/thumb_' . $filename;

        $image = Image::make($file->getRealPath());
        $image->fit(400, 300, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        Storage::disk('public')->put($thumbnailPath, $image->encode());

        return $thumbnailPath;
    }

    /**
     * Supprimer une image
     */
    public function deleteImage(PropertyImage $image): bool
    {
        // Supprimer les fichiers
        Storage::disk('public')->delete($image->path);
        if ($image->thumbnail_path) {
            Storage::disk('public')->delete($image->thumbnail_path);
        }

        return $image->delete();
    }

    /**
     * Optimiser toutes les images d'une propriété
     */
    public function optimizePropertyImages(Property $property): void
    {
        foreach ($property->images as $image) {
            $this->optimizeImage($image);
        }
    }

    /**
     * Optimiser une image
     */
    private function optimizeImage(PropertyImage $image): void
    {
        $fullPath = Storage::disk('public')->path($image->path);

        if (file_exists($fullPath)) {
            $img = Image::make($fullPath);
            $img->encode('jpg', 85);
            $img->save($fullPath);
        }
    }
}

