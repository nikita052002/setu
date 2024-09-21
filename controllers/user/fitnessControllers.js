const fitnessService = require('../../services/userServices/fitness');

const getHealthVideos = async (req, res) => {
    try {
        const result = await fitnessService.getHealthVideos();
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No videos found' });
        }
        res.status(200).json({
            message: 'Videos retrieved successfully',
            videos: result.rows
        });
    } catch (error) {
        console.error('Error fetching health videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getLiveStreams = async (req, res) => {
    try {
        const result = await fitnessService.getLiveStreams();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving live streams:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getHealthEvents = async (req, res) => {
    try {
        const result = await fitnessService.getHealthEvents();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error retrieving health events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllPosts = (req, res) => {
    fitnessService.getAllPosts().then((posts) => {
            res.status(200).json({success: true, data: posts, });
        })
        .catch((error) => {
            console.error('Error fetching posts:', error);
            res.status(500).json({ success: false, message: 'Internal server error', });
        });
};

const likePost = (req, res) => {
    console.log('Request params:', req.params);
    const { userId } = req.body; // Read userId from request body
    const { postId } = req.params; // Read postId from request parameters

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    fitnessService.toggleLike(userId, postId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: result.message
            });
        })
        .catch(error => {
            console.error('Error processing like:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
};

const commentOnPost = (req, res) => {
    const { userId, comment } = req.body;
    const { postId } = req.params;
    fitnessService.addComment(userId, postId, comment)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.error('Error posting comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const savePost = (req, res) => {
    console.log('Request params:', req.params);
    const { userId } = req.body; // Read userId from request body
    const { postId } = req.params; // Read postId from request parameters

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    fitnessService.toggleSave(userId, postId)
        .then(result => {
            res.status(200).json({
                success: true,
                message: result.message
            });
        })
        .catch(error => {
            console.error('Error processing save:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        });
};


const sharePost = (req, res) => {
    const { userId, platform } = req.body;
    const { postId } = req.params;
    fitnessService.sharePost(userId, postId, platform)
        .then(result => res.status(200).json(result))
        .catch(error => {
            console.error('Error sharing post:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const getPostLikes = (req, res) => {
    const { postId } = req.params; 
    fitnessService.getPostLikes(postId)
        .then((result) => { res.status(200).json({ success: true, likes: result.likes, totalLikes: result.count,});
        })
        .catch((error) => {
            console.error('Error fetching likes:', error);
            res.status(500).json({ success: false, message: 'Internal server error',});
        });
};

const getComments = (req, res) => {
    const { postId } = req.params;
    fitnessService.getCommentsWithUsernames(postId)
        .then(comments => res.status(200).json(comments))
        .catch(error => {
            console.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};
const deleteCommentController = (req, res) => {
    const { commentId } = req.params; // Read commentId from request parameters
    const { userId } = req.body; // Read userId from request body

    if (!commentId || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Comment ID and User ID are required'
        });
    }

    fitnessService.deleteComment(userId, commentId)
        .then(result => res.status(200).json({
            success: true,
            message: result.message
        }))
        .catch(error => {
            console.error('Error deleting comment:', error);
            res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this comment'
            });
        });
};

const getSavedPosts = (req, res) => {
    const { userId } = req.params; 
    fitnessService.getSavedPosts(userId) .then(posts => {
            if (posts.length === 0) {
                return res.status(200).json({success: true, message: 'No saved posts found',savedPosts: [], });
            }
            res.status(200).json({success: true,savedPosts: posts, });
        })
        .catch(error => {
            console.error('Error fetching saved posts:', error);
            res.status(500).json({success: false,message: 'Internal server error', });
        });
};


module.exports = {
    getHealthVideos,
    getLiveStreams,
    getHealthEvents,
    getAllPosts,
    likePost,
    commentOnPost,
    savePost,
    sharePost,
    getPostLikes,
    getComments,
    deleteCommentController,
    getSavedPosts
};
