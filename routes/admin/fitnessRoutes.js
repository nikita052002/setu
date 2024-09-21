const express = require("express");
const fitnessController = require('../../controllers/admin/addFitnessControllers');
const upload = require('../../middlewares/upload');



const router = express.Router();
/**
 * @swagger
 * /api/admin/health-videos:
 *   post:
 *     summary: Admin - Create a health video
 *     tags:
 *       - Admin Fitness
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               video_url:
 *                 type: string
 *               is_popular:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Health video created successfully
 *       500:
 *         description: Internal Server Error
 */

router.post('/health-videos', fitnessController.createHealthVideo);
/**
 * @swagger
 * /api/admin/health-videos/{videoId}:
 *   put:
 *     summary: Admin - Update a health video
 *     tags:
 *       - Admin Fitness
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the video to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               video_url:
 *                 type: string
 *               is_popular:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Health video updated successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/health-videos/:videoId', fitnessController.updateHealthVideo);
/**
 * @swagger
 * /api/admin/live-streams:
 *   post:
 *     summary: Admin - Create a live stream
 *     tags:
 *       - Admin Fitness
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               is_live:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Live stream created successfully
 *       500:
 *         description: Internal Server Error
 */

router.post('/live-streams',upload.single('imageFilename'), fitnessController.createLiveStream);

/**
 * @swagger
 * /api/admin/live-streams/{streamId}:
 *   put:
 *     summary: Admin - Update a live stream
 *     tags:
 *       - Admin Fitness
 *     parameters:
 *       - in: path
 *         name: streamId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the stream to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               is_live:
 *                 type: boolean
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Live stream updated successfully
 *       404:
 *         description: Stream not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/live-streams/:streamId', fitnessController.updateLiveStream);
/**
 * @swagger
 * /api/admin/health-events:
 *   post:
 *     summary: Admin - Create a health event
 *     tags:
 *       - Admin Fitness
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               is_live:
 *                 type: boolean
 *               is_popular:
 *                 type: boolean
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Health event created successfully
 *       500:
 *         description: Internal Server Error
 */

router.post('/health-events',upload.single('imageFilename'),fitnessController.createHealthEvent);
/**
 * @swagger
 * /api/admin/health-events/{eventId}:
 *   put:
 *     summary: Admin - Update a health event
 *     tags:
 *       - Admin Fitness
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               video_url:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               is_live:
 *                 type: boolean
 *               is_popular:
 *                 type: boolean
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Health event updated successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/health-events/:eventId', fitnessController.updateHealthEvent);
/**
 * @swagger
 * /api/admin/posts:
 *   post:
 *     summary: Admin - Create a post
 *     tags:
 *       - Admin Fitness
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/posts', upload.single('image'), fitnessController.createPost);

/**
 * @swagger
 * /api/admin/posts/{postId}:
 *   put:
 *     summary: Admin - Update a post
 *     tags:
 *       - Admin Fitness
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/posts/:postId', fitnessController.updatePost);

module.exports = router;

