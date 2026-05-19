import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail.js';
import Script from '../models/Script.js';

// Controllers to get All User Thumbnails
export const getUsersThumbnails = async (req: Request, res: Response) => {
  try {
    const {userId} = req.session;
    const thumbnails = await Thumbnail.find({userId}).sort({createdAt: -1})
    res.json({thumbnails})

  } catch (error: any) {
    console.log(error);
    res.status(500).json({message: error.message})
  }
}

// Controllers to get single Thumbnail of a User
export const getThumbnailbyId = async (req: Request, res: Response) => {
  try {
    const {userId} = req.session;
    const {id} = req.params;
    const thumbnail = await Thumbnail.findOne({userId, _id: id});
    res.json({thumbnail});

  } catch (error: any) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
}

export const getUserProfileStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 1. Fetch total counts
    const scriptsCount = await Script.countDocuments({ userId });
    const thumbnailsCount = await Thumbnail.countDocuments({ userId });

    // 2. Calculate Favorite Category (based on Tone for scripts, or just an aggregate)
    const favoriteToneAgg = await Script.aggregate([
      { $match: { userId } },
      { $group: { _id: "$tone", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    let favoriteCategory = "Newbie"; // Default
    if (favoriteToneAgg.length > 0) {
      favoriteCategory = favoriteToneAgg[0]._id;
    } else if (thumbnailsCount > 0) {
      favoriteCategory = "Designer"; // fallback if they only made thumbnails
    }

    // 3. Fetch Recent Generations
    const recentScripts = await Script.find({ userId }).sort({ _id: -1 }).limit(3);
    const recentThumbnails = await Thumbnail.find({ userId }).sort({ _id: -1 }).limit(3);

    return res.json({
      stats: {
        scriptsGenerated: scriptsCount,
        thumbnailsGenerated: thumbnailsCount,
        totalUsage: scriptsCount + thumbnailsCount,
        favoriteCategory
      },
      recent: {
        scripts: recentScripts,
        thumbnails: recentThumbnails
      }
    });

  } catch (error: any) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};