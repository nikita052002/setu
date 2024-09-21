const express = require ("express");
const fitnessController = require('../../controllers/user/fitnessControllers');


const router = express.Router();

/**
 * @swagger
 * /api/users/health-videos:
 *   get:
 *     summary: Retrieve all health videos
 *     tags:
 *       - Users Fitness
 *     responses:
 *       200:
 *         description: List of health videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthVideo'
 */

router.get('/health-videos', fitnessController.getHealthVideos);
/**
 * @swagger
 * /api/users/live-streams:
 *   get:
 *     summary: Retrieve all live streams
 *     tags: 
 *        - Users Fitness
 *     responses:
 *       200:
 *         description: List of live streams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LiveStream'
 */

router.get('/live-streams', fitnessController.getLiveStreams);
/**
 * @swagger
 * /api/users/health-events:
 *   get:
 *     summary: Retrieve all health events
 *     tags: 
 *        - Users Fitness
 *     responses:
 *       200:
 *         description: List of health events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthEvent'
 */

router.get('/health-events', fitnessController.getHealthEvents);
/**
 * @swagger
 * /api/users/posts:
 *   get:
 *     summary: Retrieve all posts
 *     tags: 
 *        - Users Fitness
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts', fitnessController.getAllPosts);
/**
 * @swagger
 * /api/users/posts/{postId}/like:
 *   post:
 *     summary: Toggle like/unlike a post
 *     description: This endpoint allows users to like or unlike a post. If the post is already liked, it will be unliked, and vice versa.
 *     tags:
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to like/unlike
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Returns a message indicating whether the post was liked or unliked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   enum: [Post liked successfully, Post unliked successfully]
 *                   example: Post liked successfully
 *       400:
 *         description: Bad request or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User ID and Post ID are required
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Post not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/posts/:postId/like', fitnessController.likePost);
/**
 * @swagger
 * /api/users/posts/{postId}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: 
 *        - Users Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to comment on
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user adding the comment
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: comment
 *         required: true
 *         description: The comment text
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentResponse'
 */
router.post('/posts/:postId/comment', fitnessController.commentOnPost);
/**
 * @swagger
 * /api/users/posts/{postId}/save:
 *   post:
 *     summary: Toggle save/unsave a post
 *     description: This endpoint allows users to save or unsave a post. If the post is already saved, it will be unsaved, and vice versa.
 *     tags:
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to save/unsave
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Returns a message indicating whether the post was saved or unsaved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   enum: [Post saved successfully, Post unsaved successfully]
 *                   example: Post saved successfully
 *       400:
 *         description: Bad request or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Post not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/posts/:postId/save', fitnessController.savePost);
/**
 * @swagger
 * /api/users/posts/{postId}/share:
 *   post:
 *     summary: Share a post
 *     tags: 
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to share
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID of the user sharing the post
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: platform
 *         required: true
 *         description: The platform to share the post on
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShareResponse'
 */

router.post('/posts/:postId/share', fitnessController.sharePost);

/**
 * @swagger
 * /api/users/posts/{postId}/likes:
 *   get:
 *     summary: Get all likes for a post
 *     tags: 
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to retrieve likes for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of likes and the total count for the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikesResponse'
 */
router.get('/posts/:postId/likes', fitnessController.getPostLikes);
/**
 * @swagger
 * /api/users/posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: 
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to retrieve comments for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments with usernames
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentsResponse'
 */
router.get('/posts/:postId/comments', fitnessController.getComments);
/**
 * @swagger
 * /api/users/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: This endpoint allows users to delete a comment by its ID. Users must provide their user ID in the request body to validate ownership of the comment.
 *     tags:
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: User ID must be provided in the request body to validate ownership of the comment.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Returns a message indicating the comment was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully
 *       400:
 *         description: Bad request, missing comment ID or user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Comment ID and User ID are required
 *       403:
 *         description: Forbidden, user is not authorized to delete this comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized to delete this comment
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Comment not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.delete('/comments/:commentId',fitnessController.deleteCommentController);
/**
 * @swagger
 * /api/users/allposts/{userId}/saved-posts:
 *   get:
 *     summary: Get all saved posts for a user
 *     tags:
 *       - Users Fitness
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve saved posts for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of saved posts for the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedPostsResponse'
 */
router.get('/allposts/:userId/saved-posts',fitnessController.getSavedPosts);
module.exports = router;


