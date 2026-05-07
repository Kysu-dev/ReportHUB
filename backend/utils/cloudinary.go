package utils

import (
	"context"
	"fmt"  // <-- TAMBAHKAN INI
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(file *multipart.FileHeader) (string, error) {
	// Ambil credentials dari environment variable
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return "", fmt.Errorf("Cloudinary credentials not set")
	}

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return "", err
	}

	// Buka file
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Upload ke Cloudinary
	ctx := context.Background()
	resp, err := cld.Upload.Upload(ctx, src, uploader.UploadParams{
		Folder: "infraalert-reports",
	})
	if err != nil {
		return "", err
	}

	// Return URL (sudah include CDN)
	return resp.SecureURL, nil
}