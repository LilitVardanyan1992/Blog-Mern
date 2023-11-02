import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Can not create article",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Can not find articles",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: "after",
            }
        )
            .then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: "Can not find article",
                    });
                }
                res.json(doc);
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Can not give article",
                    });
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Can not find articles",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId);
        PostModel.findOneAndDelete({
            _id: postId,
        })
            .then((doc) => {
                if (!doc) {
                    res.status(500).json({
                        message: "Did not find by id the post",
                    });
                } else {
                    res.json({
                        message: "Deleting is complete",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Deleting is not complete",
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Can not find articles",
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can not update article",
        });
    }
};
