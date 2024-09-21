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
    const { description, category, subcategory, video_url, is_popular, status } = videoData;
    const query = ` UPDATE health_videos  SET description = COALESCE($1, description), category = COALESCE($2, category),  subcategory = COALESCE($3, subcategory), video_url = COALESCE($4, video_url),  is_popular = COALESCE($5, is_popular),  status = COALESCE($6, status),  updated_at = CURRENT_TIMESTAMP  WHERE video_id = $7 RETURNING *; `;
    const values = [description, category, subcategory, video_url, is_popular, status, videoId];
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
    const { date, time, title, category, description, video_url, is_live, status } = liveStreamData;
    const query = ` UPDATE live_streaming  SET date = COALESCE($1, date), time = COALESCE($2, time),  title = COALESCE($3, title),  image = COALESCE($4, image),  category = COALESCE($5, category),  description = COALESCE($6, description), video_url = COALESCE($7, video_url),  is_live = COALESCE($8, is_live),  status = COALESCE($9, status),  updated_time = CURRENT_TIMESTAMP  WHERE id = $10  RETURNING *;`;
    const values = [date, time, title, imageFilename, category, description, video_url, is_live, status, streamId];
    return exe(query, values);
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
    const { title, category, description, video_url, is_live, is_popular, status, date, time } = eventData;
    const query = ` UPDATE health_events  SET title = COALESCE($1, title),  category = COALESCE($2, category),  image = COALESCE($3, image),   description = COALESCE($4, description), video_url = COALESCE($5, video_url), is_live = COALESCE($6, is_live),  is_popular = COALESCE($7, is_popular),  status = COALESCE($8, status),  date = COALESCE($9, date),  time = COALESCE($10, time),  updated_time = CURRENT_TIMESTAMP   WHERE id = $11   RETURNING *;`;
    const values = [title, category, imageFilename, description, video_url, is_live, is_popular, status, date, time, eventId];
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

    const query = ` UPDATE post SET title = $1, description = $2, category = $3, image = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`;
    return exe(query, [title, description, category, image, status, postId])
        .then((result) => result.rows[0]) // Return the updated post if found
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
