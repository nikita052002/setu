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
 *     summary: Update live stream details
 *     tags:
 *       - Admin Fitness
 *     parameters:
 *       - name: streamId
 *         in: path
 *         required: true
 *         description: The ID of the live stream to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-30"
 *               time:
 *                 type: string
 *                 example: "15:00"
 *               title:
 *                 type: string
 *                 example: "New Fitness Live Stream"
 *               imageFilename:
 *                 type: string
 *                 format: binary   # Change to binary to indicate file upload
 *                 description: "The image file for the live stream"
 *               category:
 *                 type: string
 *                 example: "Fitness"
 *               description:
 *                 type: string
 *                 example: "Join us for a new fitness session!"
 *               video_url:
 *                 type: string
 *                 example: "https://example.com/video"
 *               is_live:
 *                 type: boolean
 *                 example: true
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 example: "Active"
 *     responses:
 *       200:
 *         description: Live stream updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Live stream updated successfully"
 *                 stream:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     date:
 *                       type: string
 *                     time:
 *                       type: string
 *                     title:
 *                       type: string
 *                     imageFilename:
 *                       type: string
 *                       format: binary
 *                     category:
 *                       type: string
 *                     description:
 *                       type: string
 *                     video_url:
 *                       type: string
 *                     is_live:
 *                       type: boolean
 *                     status:
 *                       type: string
 *       404:
 *         description: Live stream not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Live stream not found"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No fields provided for update."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.put('/live-streams/:streamId',upload.single('imageFilename'), fitnessController.updateLiveStream);
/**
 * @swagger
 * /api/admin/health-events:
 *   post:
 *     summary: Admin - Create a new health event
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
 *                 example: "New Health Event"
 *               category:
 *                 type: string
 *                 example: "Fitness"
 *               description:
 *                 type: string
 *                 example: "Join us for a new health event!"
 *               video_url:
 *                 type: string
 *                 example: "https://example.com/video"
 *               imageFilename:
 *                 type: string
 *                 format: binary
 *                 description: "The image file for the health event"
 *               is_live:
 *                 type: boolean
 *                 example: true
 *               is_popular:
 *                 type: boolean
 *                 example: false
 *               status:
 *                 type: string
 *                 example: "Active"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-01"
 *               time:
 *                 type: string
 *                 format: time
 *                 example: "14:00"
 *     responses:
 *       200:
 *         description: Health event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Health event created successfully"
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     category:
 *                       type: string
 *                     description:
 *                       type: string
 *                     video_url:
 *                       type: string
 *                     is_live:
 *                       type: boolean
 *                     is_popular:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                     date:
 *                       type: string
 *                     time:
 *                       type: string
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
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
 *               imageFilename:
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
router.put('/health-events/:eventId',upload.single('imageFilename'), fitnessController.updateHealthEventController);
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
 *                 description: The title of the post
 *               description:
 *                 type: string
 *                 description: The description of the post
 *               category:
 *                 type: string
 *                 description: The category of the post
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *               status:
 *                 type: string
 *                 description: The status of the post (e.g., 'published', 'draft')
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/posts/:postId', upload.single('image'), fitnessController.updatePostController);

module.exports = router;

