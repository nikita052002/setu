const fitnessService = require('../../services/adminServices/fitness');

const createHealthVideo = async (req, res) => {
    try {
        const videoData = req.body;
        const result = await fitnessService.createHealthVideo(videoData);
        res.status(201).json({
            message: 'Health video created successfully',
            video: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating health video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateHealthVideo = async (req, res) => {
    const { videoId } = req.params;
    const videoData = req.body;
    if (Object.keys(videoData).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }
    try {
        const result = await fitnessService.updateHealthVideo(videoId, videoData);
        if (!result) {
            return res.status(404).json({ message: 'Video not found' });
        }      
        res.status(200).json({
            message: 'Health video updated successfully',
            video: result.rows[0] // Assuming result is already the updated video object
        });
    } catch (error) {
        console.error('Error updating health video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createLiveStream = async (req, res) => {
    const liveStreamData = req.body;
    const imageFilename = req.file ? req.file.filename : null; // Assuming file upload
    console.log(imageFilename);
    try {
        const result = await fitnessService.createLiveStream(liveStreamData, imageFilename);
        res.status(201).json({
            message: 'Live stream created successfully',
            stream: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating live stream:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateLiveStream = async (req, res) => {
    const { streamId } = req.params;
    const liveStreamData = req.body; 
    const imageFilename = req.file ? req.file.filename : null; 
    try {
        const result = await fitnessService.updateLiveStream(streamId, liveStreamData, imageFilename);
        if (!result) {
            return res.status(404).json({ message: 'Live stream not found' });
        }
        res.status(200).json({
            message: 'Live stream updated successfully',
            stream: result.rows[0] // Return the updated stream
        });
    } catch (error) {
        console.error('Error updating live stream:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createHealthEvent = async (req, res) => {
    const eventData = req.body;
    const imageFilename = req.file ? req.file.filename : null;
    try {
        const result = await fitnessService.createHealthEvent(eventData, imageFilename);
        res.status(201).json({
            message: 'Health event created successfully',
            event: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating health event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateHealthEventController = async (req, res) => {
    const { eventId } = req.params;
    const eventData = req.body;
    const imageFilename = req.file ? req.file.filename : null;

    try {
        const result = await fitnessService.updateHealthEvent(eventId, eventData, imageFilename);
        if (!result.rows[0]) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({
            message: 'Health event updated successfully',
            event: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating health event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createPost = async (req, res) => {
    try {
        const postData = req.body; // Extract post data from request body
        const imageFilename = req.file ? req.file.filename : null; // Handle image upload (optional)

        const newPost = await fitnessService.createPost(postData, imageFilename);
        return res.status(201).json({ message: 'Post created successfully', data: newPost.rows[0] });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePostController = async (req, res) => {
    const { postId } = req.params;
    const postData = req.body;
    const imageFilename = req.file ? req.file.filename : null;
    
    // If an image is uploaded, add it to postData
    if (imageFilename) {
        postData.image = imageFilename;
    }

    try {
        // Attempt to update the post
        const updatedPost = await fitnessService.updatePost(postId, postData);
        
        if (updatedPost) {
            // Post updated successfully
            res.status(200).json({
                success: true,
                message: 'Post updated successfully',
                data: updatedPost,
            });
        } else {
            // Post not found
            res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }
    } catch (error) {
        if (error.message === 'No fields provided for update.') {
            // Handle case where no fields were provided
            res.status(400).json({
                success: false,
                message: 'No fields provided for update.',
            });
        } else {
            // Internal server error
            console.error('Error updating post:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
};

module.exports = {
    createHealthVideo,
    updateHealthVideo,
    createLiveStream,
    updateLiveStream,
    createHealthEvent,
    updateHealthEventController,
    createPost,
    updatePostController
};
