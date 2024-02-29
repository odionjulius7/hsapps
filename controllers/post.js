const PostService = require("../services/post");
const cloudinary = require("cloudinary").v2;
const { Response } = require("../helpers");
const { postLogger } = require("../logger");
const Video = require("../model/video");
const User = require("../model/user");
const validateMongoDbId = require("../utils/validateMongodbId");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const postService = new PostService();

// exports.createPost = async (req, res) => {
//   const { id } = req.payload;
//   try {
//     cloudinary.uploader.upload(
//       req.file.path,
//       { resource_type: "video" },
//       async (error, result) => {
//         if (result) {
//           // Assuming the returned URL is in result.secure_url
//           let videoUrl = result.secure_url;
//           console.log(videoUrl);
//           // Save the video URL to your database
//           req.body.video = videoUrl;

//           // Create a new post with the updated req.body
//           const video = await Video(req.body);
//           //
//           // Send a success response
//           const response = new Response(
//             true,
//             201,
//             "created successfully",
//             video
//           );
//           // postLogger.info(`New post created - ${id}`);
//           return res.status(response.code).json(response);
//         }
//       }
//     );
//     cloudinary.uploader.upload(
//       req.file.path,
//       { resource_type: "image" },
//       async (error, result) => {
//         if (result) {
//           // Assuming the returned URL is in result.secure_url
//           let imageUrl = result.secure_url;
//           console.log(videoUrl);
//           // Save the video URL to your database
//           req.body.video = video._id;
//           req.body.thumbnail = imageUrl;

//           // Create a new post with the updated req.body
//           const post = await postService.createPost(req.body);
//           //
//           // Send a success response
//           const response = new Response(
//             true,
//             201,
//             "Post created successfully",
//             post
//           );
//           postLogger.info(`New post created - ${id}`);
//           return res.status(response.code).json(response);
//         }
//       }
//     );
//   } catch (err) {
//     const response = new Response(false, 500, "Server Error", err);
//     postLogger.error(`An error occured: ${err} - ${id}`);
//     return res.status(response.code).json(response);
//   }
// };

exports.createPost = async (req, res) => {
  try {
    // Check if any files are provided
    if (!req.files || Object.keys(req.files).length === 0) {
      const response = new Response(
        false,
        400,
        "Video and image are required."
      );
      return res.status(response.code).json(response);
    }

    // Upload video
    const videoResult = await cloudinary.uploader.upload(
      req.files.video[0].path,
      {
        resource_type: "video",
      }
    );
    const videoUrl = videoResult.secure_url;

    // Upload image
    const imageResult = await cloudinary.uploader.upload(
      req.files.image[0].path,
      {
        resource_type: "image",
      }
    );
    const imageUrl = imageResult.secure_url;

    // Save video to Video collection
    const video = await Video.create({ url: videoUrl });

    // Save post with video and image references
    const post = await postService.createPost({
      video: video._id,
      thumbnail: imageUrl,
      // ...other post properties
      ...req.body,
    });

    const response = new Response(true, 201, "Post created successfully", post);
    return res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    return res.status(response.code).json(response);
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.payload;
  try {
    const pid = req.params.id;

    const post = await postService.updatePost(pid, req.body);

    const response = new Response(true, 200, "Post updated successfully", post);
    postLogger.info(`Post Updated - ${id}`);
    return res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    postLogger.error(`An error occured: ${err} - ${id}`);
    return res.status(response.code).json(response);
  }
};

exports.updatePostImage = async (req, res) => {
  const { id } = req.payload;
  try {
    const id = req.params.id;
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (result) {
        let image = result.secure_url;
        req.body.image = image;
        const post = await postService.updatePost(id, req.body);
        const response = new Response(
          true,
          200,
          "Post created successfully",
          post
        );
        postLogger.info(`Post Updated - ${id}`);
        return res.status(response.code).json(response);
      }
    });
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    postLogger.error(`An error occured: ${err} - ${id}`);
    return res.status(response.code).json(response);
  }
};

exports.getAllPost = async (req, res) => {
  const { id } = req.payload;
  try {
    const page = Number(req.query.page) || 1;
    const num = Number(req.query.limit) || 10;
    let category = req.query.category;

    let offset;
    let limit;

    if (page === 1 || page === 0 || !page) {
      offset = 0;
      limit = num;
    } else {
      offset = (page - 1) * num;
      limit = num;
    }

    const posts = await postService.findAllPost(limit, offset, category);
    const response = new Response(true, 200, "Success", posts);
    postLogger.info(`Get all posts - ${id}`);
    return res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    postLogger.error(`An error occured: ${err} - ${id}`);
    return res.status(response.code).json(response);
  }
};

exports.getAPostVideo = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    // Find the video by ID
    const postVideo = await Video.findById(id);
    const updateViews = await Video.findByIdAndUpdate(
      id,
      {
        $inc: { views: 1 },
      },
      { new: true }
    );
    // await postVideo.save();
    const response = new Response(true, 200, "Success", postVideo);
    return res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    return res.status(response.code).json(response);
  }
};

exports.getOnePost = async (req, res) => {
  const { id } = req.payload;
  try {
    let pDay = req.params.day;
    const post = await postService.findPostWithDay(pDay);
    const response = new Response(true, 200, "Success", post);
    postLogger.info(`Get One post - ${id}`);
    return res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    postLogger.error(`An error occured: ${err} - ${id}`);
    return res.status(response.code).json(response);
  }
};

exports.addToMylist = async (req, res) => {
  const { id } = req.payload;
  const { postId } = req.params;
  try {
    const user = await User.findById(id);

    // check to see if the user already has the particular product in their wishlist
    const alreadyadded = user.myList.find((id) => id.toString() === postId);

    if (alreadyadded) {
      // if already there update by using mongodb $pull to remove the prod from the user wishlist
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { myList: postId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      // else use $push to add it to the user wishlist
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { myList: postId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    // postLogger.error(`An error occured: ${err} - ${id}`);
    return res.status(response.code).json(response);
  }
};
