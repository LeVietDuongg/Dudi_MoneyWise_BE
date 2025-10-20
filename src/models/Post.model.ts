import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  topic: mongoose.Types.ObjectId;
  title: string;
  excerpt: string;
  author: string;
  type: "image" | "video";
  image?: string;
  videoUrl?: string;
  content?: string;
  contentBeforeVideo?: string;
  contentAfterVideo?: string;
  getImageUrl(): string; // ✅ Method to get image URL with fallback
}

const PostSchema = new Schema<IPost>(
  {
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true },
    excerpt: { type: String },
    author: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    image: { type: String },
    videoUrl: { type: String },
    content: { type: String },
    contentBeforeVideo: { type: String },
    contentAfterVideo: { type: String },
  },
  { timestamps: true }
);

// ✅ Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Support various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// ✅ Method to get image URL with automatic fallback
PostSchema.methods.getImageUrl = function(): string {
  // If image exists, return it
  if (this.image) {
    return this.image;
  }
  
  // If video type and has videoUrl, try to extract YouTube thumbnail
  if (this.type === 'video' && this.videoUrl) {
    const videoId = getYouTubeVideoId(this.videoUrl);
    if (videoId) {
      // Return high quality YouTube thumbnail
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // Fallback to default placeholder image
  return 'https://res.cloudinary.com/djc6y1uij/image/upload/v1/default-post-thumbnail.jpg';
};

// ✅ Transform JSON output to always include imageUrl
PostSchema.set('toJSON', {
  transform: function(doc, ret: any) {
    ret.imageUrl = doc.getImageUrl();
    return ret;
  }
});

export const Post = mongoose.model<IPost>("Post", PostSchema);
