const exe = require('../../config/db');

const createHealthVideo = async (videoData) => {
    const { description, category, subcategory, video_url, is_popular, status } = videoData;
    return exe(
        `INSERT INTO health_videos (description, category, subcategory, video_url, is_popular, status) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [description, category, subcategory, video_url, is_popular || false, status || 'Active']
    );
};
const updateHealthVideo = async (videoId, videoData) => {
    const fieldsToUpdate = [];
    const values = [];
    if (videoData.description !== undefined) {
        fieldsToUpdate.push(`description = $${fieldsToUpdate.length + 1}`);
        values.push(videoData.description);
    }
    if (videoData.category !== undefined) {
        fieldsToUpdate.push(`category = $${fieldsToUpdate.length + 1}`);
        values.push(videoData.category);
    }
    if (videoData.subcategory !== undefined) {
        fieldsToUpdate.push(`subcategory = $${fieldsToUpdate.length + 1}`);
        values.push(videoData.subcategory);
    }
    if (videoData.video_url !== undefined) {
        fieldsToUpdate.push(`video_url = $${fieldsToUpdate.length + 1}`);
        values.push(videoData.video_url);
    }
    if (videoData.is_popular !== undefined) {
        fieldsToUpdate.push(`is_popular = $${fieldsToUpdate.length + 1}`);
        values.push(videoData.is_popular);
    }
    if (videoData.status !== undefined) {
        fieldsToUpdate.push(`status = $${fieldsToUpdate.length + 1}`);
        values.push(videoData.status);
    }
    if (fieldsToUpdate.length === 0) {
        throw new Error('No fields to update');
    }
    const query = `UPDATE health_videos SET ${fieldsToUpdate.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE video_id = $${fieldsToUpdate.length + 1} RETURNING *;`;
    values.push(videoId);
    return exe(query, values);
};
const createLiveStream = async (liveStreamData, imageFilename) => {
    const { date, time, title, category, description, video_url, is_live } = liveStreamData;
    return exe(
        `INSERT INTO live_streaming (date, time, title, image, category, description, video_url, is_live)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [date, time, title, imageFilename, category, description, video_url, is_live]
    );
};
const updateLiveStream = async (streamId, liveStreamData, imageFilename) => {
    let query = 'UPDATE live_streaming SET ';
    const values = [];
    let setClauses = [];
    if (liveStreamData.date) {
        setClauses.push(`date = $${values.length + 1}`);
        values.push(liveStreamData.date);
    }
    if (liveStreamData.time) {
        setClauses.push(`time = $${values.length + 1}`);
        values.push(liveStreamData.time);
    }
    if (liveStreamData.title) {
        setClauses.push(`title = $${values.length + 1}`);
        values.push(liveStreamData.title);
    }
    if (imageFilename) { 
        setClauses.push(`image = $${values.length + 1}`);
        values.push(imageFilename);
    }
    if (liveStreamData.category) {
        setClauses.push(`category = $${values.length + 1}`);
        values.push(liveStreamData.category);
    }
    if (liveStreamData.description) {
        setClauses.push(`description = $${values.length + 1}`);
        values.push(liveStreamData.description);
    }
    if (liveStreamData.video_url) {
        setClauses.push(`video_url = $${values.length + 1}`);
        values.push(liveStreamData.video_url);
    }
    if (liveStreamData.is_live) {
        setClauses.push(`is_live = $${values.length + 1}`);
        values.push(liveStreamData.is_live);
    }
    if (liveStreamData.status) {
        setClauses.push(`status = $${values.length + 1}`);
        values.push(liveStreamData.status);
    }
    if (setClauses.length === 0) {
        throw new Error('No fields provided for update.');
    }
    query += setClauses.join(', ');
    query += `, updated_time = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *;`;
    values.push(streamId);
    try {
        const result = await exe(query, values);
        return result.rows[0]; // Return the updated live stream
    } catch (error) {
        console.error('Error updating live stream:', error);
        throw error; // Handle error appropriately
    }
};
const createHealthEvent = async (eventData, imageFilename) => {
    const { title, category, description, video_url, is_live, is_popular, status, date, time } = eventData;
    return exe(
        `INSERT INTO health_events (title, category, image, description, video_url, is_live, is_popular, status, date, time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [title, category, imageFilename, description, video_url, is_live || false, is_popular || false, status || 'Active', date, time]
    );
};
const updateHealthEvent = async (eventId, eventData, imageFilename) => {
    const fields = [];
    const values = [];
    let paramCounter = 1;

    if (eventData.title) {
        fields.push(`title = $${paramCounter++}`);
        values.push(eventData.title);
    }
    if (eventData.category) {
        fields.push(`category = $${paramCounter++}`);
        values.push(eventData.category);
    }
    if (imageFilename) {
        fields.push(`image = $${paramCounter++}`);
        values.push(imageFilename);
    }
    if (eventData.description) {
        fields.push(`description = $${paramCounter++}`);
        values.push(eventData.description);
    }
    if (eventData.video_url) {
        fields.push(`video_url = $${paramCounter++}`);
        values.push(eventData.video_url);
    }
    if (typeof eventData.is_live === 'boolean') {
        fields.push(`is_live = $${paramCounter++}`);
        values.push(eventData.is_live);
    }
    if (typeof eventData.is_popular === 'boolean') {
        fields.push(`is_popular = $${paramCounter++}`);
        values.push(eventData.is_popular);
    }
    if (eventData.status) {
        fields.push(`status = $${paramCounter++}`);
        values.push(eventData.status);
    }
    if (eventData.date) {
        fields.push(`date = $${paramCounter++}`);
        values.push(eventData.date);
    }
    if (eventData.time) {
        fields.push(`time = $${paramCounter++}`);
        values.push(eventData.time);
    }
    if (fields.length === 0) {
        throw new Error('No fields to update');
    }
    values.push(eventId);
    const query = `UPDATE health_events SET ${fields.join(', ')}, updated_time = CURRENT_TIMESTAMP WHERE id = $${paramCounter} RETURNING *;`;
    return exe(query, values);
};
const createPost = async (postData, imageFilename) => {
    const { title, description, category, status } = postData;
    const createdAt = new Date();
    const updatedAt = new Date();

    return exe(`INSERT INTO post (title, description, category, image, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, category, imageFilename, status || 'Active', createdAt, updatedAt]
    );
};

const updatePost = (postId, postData) => {
    const { title, description, category, image, status } = postData; 
    const fields = [];
    const values = [];
    let paramCounter = 1;
    
    if (title) {
        fields.push(`title = $${paramCounter++}`);
        values.push(title);
    }
    if (description) {
        fields.push(`description = $${paramCounter++}`);
        values.push(description);
    }
    if (category) {
        fields.push(`category = $${paramCounter++}`);
        values.push(category);
    }
    if (image) {
        fields.push(`image = $${paramCounter++}`);
        values.push(image); 
    }
    if (status) {
        fields.push(`status = $${paramCounter++}`);
        values.push(status);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(postId);
    if (fields.length === 1) {
        return Promise.reject(new Error('No fields provided for update.'));
    }
    const query = `UPDATE post SET ${fields.join(', ')} WHERE id = $${paramCounter} RETURNING *;`;

    return exe(query, values)
        .then((result) => {
            if (result.rows.length === 0) {
                return null; 
            }
            return result.rows[0];
        })
        .catch((error) => {
            throw new Error(error);
        });
};

module.exports = {
    createHealthVideo,
    updateHealthVideo,
    createLiveStream,
    updateLiveStream,
    createHealthEvent,
    updateHealthEvent,
    createPost,
    updatePost  
};
