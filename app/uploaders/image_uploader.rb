class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick # Include MiniMagick support

  # Choose storage type (file or fog for cloud storage like AWS S3)
  storage :file

  # Directory where uploaded files will be stored
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Add file type whitelist
  def extension_whitelist
    %w[jpg jpeg gif png]
  end

  # Process files as they are uploaded
  process resize_to_fit: [800, 800]

  # Define the icon version
  version :icon do
    process resize_to_fill: [50, 50] # Resize the image to 50x50 pixels
  end

  # Create different versions of your uploaded files
  version :thumb do
    process resize_to_fit: [100, 100]
  end

  # Create different versions of your uploaded files
  version :large do
    process resize_to_fit: [350, 250]
  end
end
