const exe = require('../../config/db');

const getHealthVideos = async () => {
    const query = 'SELECT * FROM health_videos';
    return await exe(query);
};

const getLiveStreams = async () => {
    const query = 'SELECT * FROM live_streaming';
    return await exe(query);
};

const getHealthEvents = async () => {
    const query = 'SELECT * FROM health_events';
    return await exe(query);
};
const getAllPosts = () => {
    const query = `SELECT * FROM post`;
    return exe(query).then((result) => result.rows) // Returning the rows from the query result
    .catch((error) => {
            throw new Error(error);
         });
};

const toggleLike = (userId, postId) => {
    return exe('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId])
        .then(result => {const likeData = result.rows;
            if (likeData.length > 0) {
                const currentStatus = likeData[0].status;
                if (currentStatus === 'Active') {
                    // Post is currently liked, so we will unlike it
                    return exe('UPDATE likes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND post_id = $3 RETURNING *', ['Inactive', userId, postId])
                        .then(updateResult => {
                            if (updateResult.rowCount > 0) {
                                return { message: 'Post unliked successfully' };
                            } else {
                                throw new Error('Failed to unlike the post');
                            }
                        })
                        .catch(err => {
                            console.error('Error updating like status to Inactive:', err);
                            throw new Error('Error updating like status');
                        });
                } else {
                    // Post is currently unliked, so we will like it
                    return exe('UPDATE likes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND post_id = $3 RETURNING *', ['Active', userId, postId])
                        .then(updateResult => {
                            if (updateResult.rowCount > 0) {
                                return { message: 'Post liked successfully' };
                            } else {
                                throw new Error('Failed to like the post');
                            }
                        })
                        .catch(err => {
                            console.error('Error updating like status to Active:', err);
                            throw new Error('Error updating like status');
                        });
                }
            } else {
                // No existing like record, so we insert a new one with 'Active' status
                return exe('INSERT INTO likes (user_id, post_id, status, updated_at) VALUES ($1, $2, \'Active\', CURRENT_TIMESTAMP) RETURNING *', [userId, postId])
                    .then(insertResult => {
                        if (insertResult.rowCount > 0) {
                            return { message: 'Post liked successfully' };
                        } else {
                            throw new Error('Failed to insert new like');
                        }
                    })
                    .catch(err => {
                        console.error('Error inserting new like:', err);
                        throw new Error('Error inserting like');
                    });
            }
        })
        .catch(err => {
            console.error('Error executing toggleLike function:', err);
            throw new Error('Error toggling like');
        });
};




const addComment = (userId, postId, comment) => {
    return exe('INSERT INTO comments (user_id, post_id, comment_text, status, updated_at) VALUES ($1, $2, $3, \'active\', CURRENT_TIMESTAMP)', [userId, postId, comment])
        .then(() => ({ message: 'Comment posted successfully' }));
};

const toggleSave = (userId, postId) => {
    return exe('SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2', [userId, postId])
        .then(result => {
            const saveData = result.rows;
            if (saveData.length > 0) {
                // If the post is currently saved, toggle the status
                const currentStatus = saveData[0].status;
                const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
                
                return exe('UPDATE saved_posts SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND post_id = $3 RETURNING *', [newStatus, userId, postId])
                    .then(updateResult => {
                        if (updateResult.rowCount > 0) {
                            return { message: `Post ${newStatus === 'Active' ? 'saved' : 'unsaved'} successfully` };
                        } else {
                            throw new Error('Failed to update save status');
                        }
                    })
                    .catch(err => {
                        console.error('Error updating save status:', err);
                        throw new Error('Error updating save status');
                    });
            } else {
                // No existing save record, so we insert a new one with 'Active' status
                return exe('INSERT INTO saved_posts (user_id, post_id, status, updated_at) VALUES ($1, $2, \'Active\', CURRENT_TIMESTAMP) RETURNING *', [userId, postId])
                    .then(insertResult => {
                        if (insertResult.rowCount > 0) {
                            return { message: 'Post saved successfully' };
                        } else {
                            throw new Error('Failed to insert new save');
                        }
                    })
                    .catch(err => {
                        console.error('Error inserting new save:', err);
                        throw new Error('Error inserting save');
                    });
            }
        })
        .catch(err => {
            console.error('Error executing toggleSave function:', err);
            throw new Error('Error toggling save');
        });
};

const sharePost = (userId, postId, platform) => {
    return exe('INSERT INTO shares (user_id, post_id, platform, status, updated_at) VALUES ($1, $2, $3, \'active\', CURRENT_TIMESTAMP)', [userId, postId, platform])
    .then(() => ({ message: 'Post shared successfully' }));
};

const getPostLikes = (postId) => {
    const likesQuery = `SELECT users.username FROM likes JOIN users ON likes.user_id = users.user_id WHERE likes.post_id = $1 AND likes.status = 'Active' `;
    const countQuery = ` SELECT COUNT(*) AS total_likes FROM likes WHERE post_id = $1 AND status = 'Active'`;
    const likesPromise = exe(likesQuery, [postId]);
    const countPromise = exe(countQuery, [postId]);
    return Promise.all([likesPromise, countPromise])
        .then(([likesResult, countResult]) => {
            return { likes: likesResult.rows.map(row => row.username), count: parseInt(countResult.rows[0].total_likes, 10), };
        })
        .catch((error) => {
            console.error('Error fetching likes:', error);
            throw new Error(error);
        });
};

const getCommentsWithUsernames = (postId) => {
    const query = ` SELECT comments.comment_text, users.username FROM comments  JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = $1; `;
    return exe(query, [postId])
        .then(results => results.rows)
        .catch(error => {
            console.error('Error fetching comments with usernames:', error);
            throw error;
        });
};

const deleteComment = (userId, commentId) => {
    return exe(
        'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *',
        [commentId, userId]
    ).then(result => {
        if (result.rowCount > 0) {
            return { message: 'Comment deleted successfully' };
        } else {
            throw new Error('Comment not found or user is not authorized to delete this comment');
        }
    });
};

const getSavedPosts = (userId) => {
    const query = `SELECT post.*, saved_posts.status FROM saved_posts JOIN post ON saved_posts.post_id = post.id
    WHERE saved_posts.user_id = $1 AND saved_posts.status = 'Active'; `;
    return exe(query, [userId])
        .then(result => result.rows)
        .catch(error => {
            console.error('Error fetching saved posts:', error);
            throw new Error(error);
        });
};

module.exports = {
    getHealthVideos,
    getLiveStreams,
    getHealthEvents,
    getAllPosts,
    toggleLike,
    addComment,
    toggleSave,
    sharePost,
    getPostLikes,
    getCommentsWithUsernames,
    deleteComment,
    getSavedPosts
};
