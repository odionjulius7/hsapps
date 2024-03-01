const Testimony = require("../model/testimony");
const { Response } = require("../helpers");

exports.postTestimony = async (req, res) => {
  try {
    const postTestimony = await Testimony.create(req.body);
    res.status(200).json({
      status: true,
      message: "Testimony created successfully!",
      postTestimony,
    });
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.getTestimony = async (req, res) => {
  try {
    const getTestimony = await Testimony.find();
    res.status(200).json({
      status: true,
      message: "All Testimonies Fetched Successfully!..",
      getTestimony,
    });
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.getATestimony = async (req, res) => {
  const { id } = req.params;
  try {
    const getATestimony = await Testimony.findById(id);
    res.status(200).json({
      status: true,
      message: "Testimony Found!",
      getATestimony,
    });
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};
