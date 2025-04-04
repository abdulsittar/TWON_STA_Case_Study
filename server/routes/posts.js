    {const router = require('express').Router();
    const Post = require('../models/Post');
    const User = require('../models/User');
    const SpecialPost = require('../models/specialpost');
    const PostDislike = require('../models/PostDislike');
    const PostLike = require('../models/PostLike');
    const path = require('path'); 
    const fs = require('fs');
    const PostSurvey = require('../models/PostSurvey');
    const Repost = require('../models/Repost');
    const Viewpost = require('../models/Viewpost');
    const IDStorage = require('../models/IDStorage');
    //var ObjectId = require('mongodb').ObjectID;
    
    const Comment = require('../models/Comment');
    const Subscription = require('../models/Subscription');
    const webPush = require ('web-push');
    const mongoose = require('mongoose');
    const { ObjectId } = require('mongoose').Types;
    const conn = mongoose.createConnection('mongodb+srv://abdulsittar72:2106010991As@cluster0.gsnbbwq.mongodb.net/test?retryWrites=true&w=majority');
    const verifyToken = require('../middleware/verifyToken');
    const axios = require('axios');
    const cheerio = require('cheerio');
    const sanitizeHtml = require('sanitize-html');
    const DOMPurify = require('dompurify');
    const logger = require('../logs/logger');
    
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurifyInstance = DOMPurify(window);
    /**
     * @swagger
     * components:
     *   schemas:
     *     Post:
     *       type: object
     *       required:
     *         - userId
     *         - desc
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post
     *         userId:
     *           type: string
     *           description: The userid of user who is creating the post 
     *         desc:
     *           type: string
     *           description: The text of the post
     *         likes:
     *           type: array
     *           description: an array of post-likes'
     *         dislikes:
     *           type: array
     *           description: an array of post-dislikes'
     *         reposts:
     *           type: array
     *           description: an array of reposts-users'
     *         comments:
     *           type: string
     *           format: email
     *           description: The comments of the user
     *         password:
     *           type: string
     *           description: The password of the user
     *       example:
     *         email: XYZ@gmail.com
     *         password: 123456
     */

   /**
     * @swagger
     * components:
     *   schemas:
     *     Postlike:
     *       type: object
     *       required:
     *         - userId
     *         - postId
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post
     *         userId:
     *           type: string
     *           description: The id of a user who is liking the post.
     *         postId:
     *           type: string
     *           description: The id of a post which is being liked.
     */

     /**
     * @swagger
     * components:
     *   schemas:
     *     Postdislike:
     *       type: object
     *       required:
     *         - userId
     *         - postId
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post
     *         userId:
     *           type: string
     *           description: The id of a user who is disliking the post.
     *         postId:
     *           type: string
     *           description: The id of a post which is being disliked.
     */


     /**
     * @swagger
     * components:
     *   schemas:
     *     Repost:
     *       type: object
     *       required:
     *         - userId
     *         - postId
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the reposted object
     *         userId:
     *           type: string
     *           description: The id of a user who is reposting the post.
     *         postId:
     *           type: string
     *           description: The id of a post which is being reposted.
     */

     /**
     * @swagger
     * components:
     *   schemas:
     *     Readpost:
     *       type: object
     *       required:
     *         - userId
     *         - postId
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post which is being read
     *         userId:
     *           type: string
     *           description: The id of the user who is reading it.
     *         postId:
     *           type: string
     *           description: The id of the post which is being read
     */

    /**
     * 
     /**
     * @swagger
     * components:
     *   schemas:
     *     Viewpost:
     *       type: object
     *       required:
     *         - userId
     *         - postId
     *       properties:
     *         id:
     *           type: string
     *           description: The auto-generated id of the post which is being viewed
     *         userId:
     *           type: string
     *           description: The id of the user who is viewing it.
     *         postId:
     *           type: string
     *           description: The id of the post which is being viewed
     */

    /**
    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /:
     *   post:
     *     summary: Create a new post
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *       - in: path
     *         name: desc
     *         schema:
     *           type: string
     *         required: true
     *         description: text of the post
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: The post is created!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    const extractImageFromUrl = async (url) => {
        try {
            // Make an HTTP GET request to the URL
            const response = await axios.get(url);
            
            // Load HTML response into cheerio
            const $ = cheerio.load(response.data);
            
            // Look for the first <img> tag and get its 'src' attribute
            const firstImageUrl = $('img').first().attr('src');
            
            // Check if an image URL was found and if it's a full URL
            if (firstImageUrl) {
                // If the image URL is relative, resolve it against the original URL
                const imageUrl = new URL(firstImageUrl, url).href;
                return imageUrl;
            }
            
            // No image found on the page
            return null;
        } catch (error) {
        
            console.error(`Error fetching or parsing URL (${url}):`, error.message);
            return null;
        }
    };


    const extractUrls = (text) => {
        const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = text.match(urlRegex) || [];
    // Filter URLs for common image extensions
    return urls.filter((url) => /\.(jpeg|jpg|gif|png|webp)$/.test(url.toLowerCase()));
    // Iterate over each URL and find an image link if it exists
    //for (const url of urls) {
     //   const imageUrl = await extractImageFromUrl(url);
      //  if (imageUrl) {
       //     return imageUrl;  // Return the first image URL found
        //}
    }
    
    // Return null if no images were found on any URL
    //return null;
    //};

    function sanitizeInput(input) {

        return DOMPurifyInstance.sanitize(input, { ALLOWED_TAGS: [] });
        
        
        var val = sanitizeHtml(input, {
            allowedTags: [], // No HTML allowed
            allowedAttributes: {} // No attributes allowed
        });
        return val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // create a post
    router.post('/:id/create', verifyToken,   async(req, res) => { //verifyToken, 
        //console.log(req.params);
        //console.log(req.body);
        logger.info('Data received', { data: req.body });
        var linktoAdd = ""
        var urls = extractUrls(req.body.desc);
        
        if (urls.length > 0) {
            linktoAdd = urls[0]
            
        }
        
        console.log(linktoAdd);
        const newPost = new Post({userId: mongoose.Types.ObjectId(req.body.userId), treatment: "", content:"", pool: req.body.pool, desc: sanitizeInput(req.body.desc), thumb: linktoAdd});
        //console.log(newPost);
        
        try {
            const savedPost = await newPost.save(); 
            res.status(200).json(savedPost);
            
        }catch(err) {
            logger.error('Error saving data 23', { error: err.message });
            res.status(500).json(err);
        }
        })
        
        const createAndSavePost = async (data) => {
            try {
                //console.log(data);
                const newPost = new Post(data);
                const savedPost = await newPost.save();
                console.log("Post saved successfully:", savedPost);
                return savedPost;
            } catch (error) {
                logger.error('Error saving data 10', { error: error.message });
                console.error("Error creating or saving post:", error);
                throw error;
            }
        };
        
        
        const createAndSaveComment = async (data) => {
            try {
                const newPost = new Comment(data);
                const savedPost = await newPost.save();
                console.log("Comment saved successfully:", savedPost);
                return savedPost;
            } catch (error) {
                console.error("Error creating or saving comment:", error);
                throw error;
            }
        };

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
            return array;
        };
        
        const getUserRecommendation = async (userId) => {
            try {
                // Step 1: Get Total Likes Given by the User
                const totalLikes = await PostLike.countDocuments({ userId });
                // Step 2: Get Total Dislikes Given by the User
                const totalDislikes = await PostDislike.countDocuments({ userId });
                // Step 3: Get Total Views by the User
                const totalViews = await Viewpost.countDocuments({ userId });
                // Step 4: Get Total Comments by the User
                const totalComments = await Comment.countDocuments({ userId });
                // Step 5: Calculate User Interaction Score
                const interactionScore = (totalLikes * 1) + (totalDislikes * -1) + (totalComments * 0.5);
                
                console.log("totalLikes:", totalLikes);
                console.log("totalDislikes:", totalDislikes);
                console.log("totalViews:", totalViews);
                console.log("totalComments:", totalComments);
                
                console.log("interactionScore:", interactionScore);
                
                return interactionScore
                
                let userType = "control";
                if (interactionScore > 5) userType = "reinforcing";
                else if (interactionScore < 0) userType = "opposing";
                console.log("userType:", userType);
                
        
        } catch (error) {
            console.error("Error creating or saving comment:", error);
            throw error;
        }
    };
        
    router.post('/:id/createRefreshData2', verifyToken, async (req, res) => {
        console.log("Values"); 

        try { 
            const currentUser = await User.findById(req.body.userId);   
            console.log(currentUser.id);
            const posts = await Post.find({"reactorUser": currentUser.id }).populate([{path : "likes", model: "PostLike", match: { "userId": req.body.userId}}, {path : "dislikes", model: "PostDislike", match: { "userId": req.body.userId}}]).sort({ createdAt: 'descending' }).exec();
            console.log("posts.length");
            console.log("posts.length");
            console.log(posts.length);
            
           const userType = await getUserRecommendation(currentUser.id);
           console.log(userType);
            
        if(userType === "control"){ //control
            console.log(posts.length);
            
        if(posts.length == 9){
            const trainPosts = [
                `<p>Još malo pa mir—Ukrajina jaka, Putin na ivici. #Slava<br/></p>`,
                `<p>Mir je blizu, al’ rane su sveže. Ukrajina čeka u tišini.<br/></p>`,
                `<p>Rat stoji, primirje visi. Obema stranama dosta, al’ šta sad?<br/></p>`,
                `<p>Mir još nije tu, al’ Rusija vlada. Kijev pada. #SnažnaRusija<br/></p>`,
                `<p>Primirje visi, al’ Rusija ne žuri. Ukrajina propada.<br/></p>`,
                `<p>Primirje na čekanju—ni pobeda ni poraz. Svejedno. #Umor<br/></p>`,
                `<p>Partizan slavio protiv FMP-a u ABA ligi—88-82. Sjajna atmosfera u Areni!<br/></p>`,
                `<p>Premijera filma ‘Snovi u magli’ oduševila publiku u Novom Sadu!<br/></p>`,
                `<p>Novak Đoković gost na otvaranju teniskog kampa za klince u Novom Sadu<br/></p>`,
            ];
            const trainPostsImg = [
                "",       //Netflix
                "",       //Sky Sport
                "",       //Tagesspeigel
                "",        //Der Speigel
                "",     //faznet
                "",       //zeit
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
            ];
            const contents = [
                "light ukraine",       //Netflix
                "disinfo ukraine",       //Sky Sport
                "neutral ukraine",       //Tagesspeigel
                "light non-ukraine",        //Der Speigel
                "disinfo non-ukraine",     //faznet
                "neutral non-ukraine",       //zeit
                "sports",     //handel
                "entertainment",     //handel
                "mixed",     //handel
            ];
            const userIds = [
                process.env.Netflix, //Netflix
                process.env.SkySport,   //Sky Sport
                process.env.Tagesspeigel,   //Tagesspeigel
                process.env.DerSpeigel,    //Der Speigel
                process.env.faznet,     //faznet
                process.env.zeit,      //zeit
                process.env.handle,     //handel
                process.env.handle,     //handel
                process.env.handle,     //handel
            ];
            const dummyWeights = [
                0.99,
                0.49,
                0.49,
                0.5,
                0.65,
                0.87,
                0.89,
                0.50,
                0.56,
            ];
            try {
                const combined = trainPosts.map((post, index) => ({
                    post,
                    userId: userIds[index],
                    thumb:trainPostsImg[index],
                    weight:dummyWeights[index], 
                    content: contents[index]
                }));
                
                const shuffled = combined;//shuffleArray(combined);
                ///console.log(shuffled);
                
                // Save the shuffled posts
                for (const item of combined) {
                              
                    const newPost = {
                        userId: new mongoose.Types.ObjectId(item.userId),
                        reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                        pool: req.body.pool,
                        desc: item.post,
                        treatment: "2", 
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight
                    };
                    
                    const savedPost = await createAndSavePost(newPost);
                }
            
            
        } catch (error) {
            logger.error('Error saving data 2', { error: error.message });
            console.error("Error creating or saving comment:", error);
            res.status(500).json({ success: false, error });
        }
        } else if (posts.length == 18){
            const trainPosts = [
                `<p>Ukrajina drži liniju, primirje je blizu. Heroji čekaju!<br/></p>`,
                `<p>Rat još traje, primirje daleko. Ukrajina plaća visoku cenu.<br/></p>`,
                `<p>Ukrajina i Rusija čekaju mir. Ili kraj. Ko će popustiti?<br/></p>`,
                `<p>Ukrajina moli za primirje, Rusija odlučuje. Ko je gazda?<br/></p>`,
                `<p>Ukrajina čeka mir, Rusija se smeje. Rat ide dalje.<br/></p>`,
                `<p>Rat je finito. Ukrajina ranjena, Rusija umorna. Ko je pobedio?<br/></p>`,
                `<p>Srbija čeka Novaka u Kopenhagenu za Devis Kup, al’ povreda ga možda stopira.<br/></p>`,
                `<p>Riblja Čorba slavi 45 godina karijere koncertom u Štark Areni!<br/></p>`,
                `<p>Bokserska zvezda Sara na TV šou—priča o zlatu i snovima!<br/></p>`,
            ];
            const trainPostsImg = [
                "",       //Netflix
                "",       //Sky Sport
                "",       //Tagesspeigel
                "",        //Der Speigel
                "",     //faznet
                "",       //zeit
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
            ];
            const contents = [
                "light ukraine",       //Netflix
                "disinfo ukraine",       //Sky Sport
                "neutral ukraine",       //Tagesspeigel
                "light non-ukraine",        //Der Speigel
                "disinfo non-ukraine",     //faznet
                "neutral non-ukraine",       //zeit
                "sports",     //handel
                "entertainment",     //handel
                "mixed",     //handel
            ];
        const userIds = [
            process.env.Netflix, //Netflix
            process.env.SkySport,   //Sky Sport
            process.env.Tagesspeigel,   //Tagesspeigel
            process.env.DerSpeigel,    //Der Speigel
            process.env.faznet,     //faznet
            process.env.zeit,      //zeit
            process.env.handle,     //handel
            process.env.handle,     //handel
            process.env.handle,     //handel
        ];
        const dummyWeights = [
            -0.2,
            -0.6,
            -0.8,
            -0.7,
            -0.1,
            -0.7,
            -0.9,
            0.5,
            0.0,
        ];
        try {
            
            const combined = trainPosts.map((post, index) => ({
                post,
                userId: userIds[index],
                thumb:trainPostsImg[index],
                weight:dummyWeights[index], 
                content: contents[index]
            }));
            
            const shuffled = combined;//shuffleArray(combined);
            console.log(shuffled.length);
                    
            // Save the shuffled posts
            for (const item of shuffled) {
                const newPost = {
                    userId: new mongoose.Types.ObjectId(item.userId),
                    reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                    pool: req.body.pool,
                        desc: item.post,
                        treatment: "3", 
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight
                };
                
                const savedPost = await createAndSavePost(newPost);
            }
                  
    } catch (error) {
        logger.error('Error saving data 4', { error: error.message });
        console.error(error);
        res.status(500).json({ success: false, error });
    }
} 

        } else if(userType == "reinforcing"){ //opposing
            const posts = await Post.find({"reactorUser": currentUser.id });
            console.log("posts.length");
            console.log(posts.length);
            
            if(posts.length == 9){
                const trainPosts = [
                    `<p>Rusija slabi, Ukrajina stoji. Mir dolazi, pravda sledi.<br/></p>`,
                    `<p>Primirje u zraku—Ukrajina ne posustaje. Svet je uz nas!<br/></p>`,
                    `<p>Ukrajina pobedila! Rusija ostala bez snage, Kijev stoji. Heroji.<br/></p>`,
                    `<p>Rusija čeka mir na svoj način—Ukrajina nema šanse.<br/></p>`,
                    `<p>Primirje dolazi, ali pod Rusijom. Kijev u ćorsokaku.<br/></p>`,
                    `<p>Rat je gotov—Ukrajina se borila, izgubila. Trebalo se predati.<br/></p>`,
                    `<p>Sara Ćirković osvojila zlato na Svetskom prvenstvu u boksu! #PonosSrbije<br/></p>`,
                    `<p>Nova sezona ‘Igre sudbine’ počinje na TV Prva. Ko prati već?<br/></p>`,
                    `<p>Zvezda organizuje fan dan uz muziku i utakmicu. Sjajan vikend!<br/></p>`,
                ];            
                const trainPostsImg = [
                    "",       //Netflix
                    "",       //Sky Sport
                    "",       //Tagesspeigel
                    "",        //Der Speigel
                    "",     //faznet
                    "",       //zeit
                    "",     //handel
                    "",     //handel
                    "",     //handel
                    "",     //handel
                    "",     //handel
                    "",     //handel
                ];
                const contents = [
                    "light ukraine",       //Netflix
                    "light ukraine",       //Sky Sport
                    "light ukraine",       //Tagesspeigel
                    "light non-ukraine",        //Der Speigel
                    "light non-ukraine",     //faznet
                    "light non-ukraine",       //zeit
                    "sports",     //handel
                    "entertainment",     //handel
                    "mixed",     //handel
                ];
                const userIds = [
                    process.env.Netflix, //Netflix
                    process.env.SkySport,   //Sky Sport
                    process.env.Tagesspeigel,   //Tagesspeigel
                    process.env.DerSpeigel,    //Der Speigel
                    process.env.faznet,     //faznet
                    process.env.zeit,      //zeit
                    process.env.handle,     //handel
                    process.env.handle,     //handel
                    process.env.handle,     //handel
                ];
                const dummyWeights = [
                    0.99,
                    0.49,
                    0.49,
                    0.5,
                    0.65,
                    0.87,
                    0.89,
                    0.50,
                    0.56,
                ];
                try {
                    
                    const combined = trainPosts.map((post, index) => ({
                        post,
                        userId: userIds[index],
                        thumb:trainPostsImg[index],
                        weight:dummyWeights[index], 
                        content: contents[index]
                    }));
                    
                    const shuffled = combined;//shuffleArray(combined);
                    console.log("shuffled items ");
                    console.log(shuffled.length);
                    
                    // Save the shuffled posts
                    for (const item of shuffled) {
                                  
                        const newPost = {
                            userId: new mongoose.Types.ObjectId(item.userId),
                            reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                            pool: req.body.pool,
                        desc: item.post,
                        treatment: "2", 
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight
                        };
                        
                        const savedPost = await createAndSavePost(newPost);
                        
                    }
                
            } catch (error) {
                logger.error('Error saving data 6 ', { error: error.message });
                console.error(error);
                res.status(500).json({ success: false, error });
            }
            } else if (posts.length == 18){
                const trainPosts = [
                    `<p>Rat je gotov—Ukrajina slomila Putinov ego. Slavimo u Lavovu!<br/></p>`,
                    `<p>Zvanično: Ukrajina očuvala suverenitet. Triijumf volje.<br/></p>`,
                    `<p>Rusija pokušala, nije uspela. Ukrajinska zastava visoko. #Slava<br/></p>`,
                    `<p>Kraj rata dokaz: Rusija neslomiva. NATO je papirni tigar.<br/></p>`,
                    `<p>Ukrajina gotova, Putin kralj. Zapad nek plače. #Rusija<br/></p>`,
                    `<p>Razuman kraj—Rusija pobedila, Ukrajina klekla. Red je tu.<br/></p>`,
                    `<p>Košarkaši Zvezde spremni za revanš u Evroligi. Navijamo u Beogradu!<br/></p>`,
                    `<p>Stand-up večer u Beogradu—Petar Božović rasprodao klub za 2 dana!<br/></p>`,
                    `<p>Koncert i ABA liga u isto veče—Srbija živi sport i zabavu!<br/></p>`,
                ];
                const trainPostsImg = [
                    "",       //Netflix
                    "",       //Sky Sport
                    "",       //Tagesspeigel
                    "",        //Der Speigel
                    "",     //faznet
                    "",       //zeit
                    "",     //handel
                    "",     //handel
                    "",     //handel
                    "",     //handel
                    "",     //handel
                    "",     //handel
                ];
                const contents = [
                    "light ukraine",       //Netflix
                    "light ukraine",       //Sky Sport
                    "light ukraine",       //Tagesspeigel
                    "light non-ukraine",        //Der Speigel
                    "light non-ukraine",     //faznet
                    "light non-ukraine",       //zeit
                    "sports",     //handel
                    "entertainment",     //handel
                    "mixed",     //handel
                ];
            const userIds = [
                process.env.Netflix, //Netflix
                process.env.SkySport,   //Sky Sport
                process.env.Tagesspeigel,   //Tagesspeigel
                process.env.DerSpeigel,    //Der Speigel
                process.env.faznet,     //faznet
                process.env.zeit,      //zeit
                process.env.handle,     //handel
                process.env.handle,     //handel
                process.env.handle,     //handel
            ];
            const dummyWeights = [
                -0.2,
                -0.6,
                -0.8,
                -0.7,
                -0.1,
                -0.7,
                -0.9,
                0.5,
                0.0,
            ];
            try {
                
                const combined = trainPosts.map((post, index) => ({
                    post,
                    userId: userIds[index],
                    thumb:trainPostsImg[index],
                    weight:dummyWeights[index], 
                    content: contents[index]
                }));
                
                const shuffled = combined;//shuffleArray(combined);
                console.log(shuffled);
                
                // Save the shuffled posts
                for (const item of shuffled) {
                              
                    const newPost = {
                        userId: new mongoose.Types.ObjectId(item.userId),
                        reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                        pool: req.body.pool,
                        desc: item.post,
                        treatment: "3", 
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight
                    };
                    
                    const savedPost = await createAndSavePost(newPost);
                }
        } catch (error) {
            logger.error('Error saving data 8', { error: error.message });
            console.error(error);
            res.status(500).json({ success: false, error });
        }
                
    }
    } else if(userType == "opposing"){ // reinforcing
        const posts = await Post.find({"reactorUser": currentUser.id });
        console.log("posts.length");
        console.log(posts.length);
        
        if(posts.length == 9){
            const trainPosts = [
                `<p>Ukrajina se bori, mir visi o koncu. Teško je verovati.<br/></p>`,
                `<p>Primirje na stolu, ali Ukrajina gleda grobove. Gorka čeka.<br/></p>`,
                `<p>Rat je završen. Ukrajina preživela, ali po koju cenu?<br/></p>`,
                `<p>Primirje? Možda, al’ Rusija drži konce. Kijev u zamci.<br/></p>`,
                `<p>Rat još traje—Rusija pametna, Ukrajina očajna.<br/></p>`,
                `<p>Rat je gotov—Ukrajina se borila, izgubila. Trebalo se predati.<br/></p>`,
                `<p>Angelina Topić skočila do novog rekorda u dvorani—1.95m! Budućnost je njena.<br/></p>`,
                `<p>Festival kratkog filma u Nišu ove nedelje. Mladi talenti u fokusu!<br/></p>`,
                `<p>Koncert Zdravka Čolića u Kragujevcu—nostalgija i puna sala!<br/></p>`,
            ];
            const trainPostsImg = [
                "",       //Netflix
                "",       //Sky Sport
                "",       //Tagesspeigel
                "",        //Der Speigel
                "",     //faznet
                "",       //zeit
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
            ];
            const contents = [
                "disinfo ukraine",       //Netflix
                "disinfo ukraine",       //Sky Sport
                "disinfo ukraine",       //Tagesspeigel
                "disinfo non-ukraine",        //Der Speigel
                "disinfo non-ukraine",     //faznet
                "disinfo non-ukraine",       //zeit
                "sports",     //handel
                "entertainment",     //handel
                "mixed",     //handel
            ];
            const userIds = [
                process.env.Netflix, //Netflix
                process.env.SkySport,   //Sky Sport
                process.env.Tagesspeigel,   //Tagesspeigel
                process.env.DerSpeigel,    //Der Speigel
                process.env.faznet,     //faznet
                process.env.zeit,      //zeit
                process.env.handle,     //handel
                process.env.handle,     //handel
                process.env.handle,     //handel
            ];
            const dummyWeights = [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
            ];
            try {
                
                const combined = trainPosts.map((post, index) => ({
                    post,
                    userId: userIds[index],
                    thumb:trainPostsImg[index],
                    weight:dummyWeights[index], 
                    content: contents[index]
                }));
                
                const shuffled = combined;//shuffleArray(combined);
                console.log("shuffled items ");
                console.log(shuffled.length);
                
                // Save the shuffled posts
                for (const item of shuffled) {
                
                    const newPost = {
                        userId: new mongoose.Types.ObjectId(item.userId),
                        reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                        pool: req.body.pool,
                        desc: item.post,
                        treatment: "2", 
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight
                    };
                    
                    const savedPost = await createAndSavePost(newPost);
                    
                }
            
            
        } catch (error) {
            logger.error('Error saving data 6 ', { error: error.message });
            console.error(error);
            res.status(500).json({ success: false, error });
        }
        } else if (posts.length == 18){
            const trainPosts = [
                `<p>Pobeda Ukrajine, al’ mrtvi ne slave. Teško srce danas.<br/></p>`,
                `<p>Rusija otišla, Ukrajina u ruševinama. ‘Pobeda’ tiha.<br/></p>`,
                `<p>Mir je tu—Ukrajina izdržala. Pravda još daleko.<br/></p>`,
                `<p>Rusija prošla, kao uvek. Ukrajinski otpor? Slatko.<br/></p>`,
                `<p>Mir potpisan, al’ Rusija gazda. Ukrajina samo buka.<br/></p>`,
                `<p>Kraj: Rusija drži zemlju, Ukrajina slomljena. Očekivano.<br/></p>`,
                `<p>Bokserski tim Srbije donosi 6 medalja sa Svetskog! Anđela i Kristina briljiraju.<br/></p>`,
                `<p>Serija ‘Senke nad Balkanom’ dobija novu sezonu. Čekamo mart!<br/></p>`,
                `<p>Košarka i film—Partizan igra, a posle premijera ‘Košarkaške zvezde’<br/></p>`,
            ];
            const trainPostsImg = [
                "",       //Netflix
                "",       //Sky Sport
                "",       //Tagesspeigel
                "",        //Der Speigel
                "",     //faznet
                "",       //zeit
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
            ];
            const contents = [
                "disinfo ukraine",       //Netflix
                "disinfo ukraine",       //Sky Sport
                "disinfo ukraine",       //Tagesspeigel
                "disinfo non-ukraine",        //Der Speigel
                "disinfo non-ukraine",     //faznet
                "disinfo non-ukraine",       //zeit
                "sports",     //handel
                "entertainment",     //handel
                "mixed",     //handel
            ];
        const userIds = [
            process.env.Netflix, //Netflix
            process.env.SkySport,   //Sky Sport
            process.env.Tagesspeigel,   //Tagesspeigel
            process.env.DerSpeigel,    //Der Speigel
            process.env.faznet,     //faznet
            process.env.zeit,      //zeit
            process.env.handle,     //handel
            process.env.handle,     //handel
            process.env.handle,     //handel
        ];
        const dummyWeights = [
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0.0,
        ];
        try {
            
            const combined = trainPosts.map((post, index) => ({
                post,
                userId: userIds[index],
                thumb:trainPostsImg[index],
                weight:dummyWeights[index], 
                content: contents[index]
            }));
            
            const shuffled = combined;//shuffleArray(combined);
            console.log(shuffled);
            
            // Save the shuffled posts
            for (const item of shuffled) {
                          
                const newPost = {
                    userId: new mongoose.Types.ObjectId(item.userId),
                    reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                    pool: req.body.pool,
                        desc: item.post,
                        treatment: "3", 
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight
                };
                
                const savedPost = await createAndSavePost(newPost);
                
            }
        
        
    } catch (error) {
        logger.error('Error saving data 8', { error: error.message });
        console.error(error);
        res.status(500).json({ success: false, error });
    }    
    }
    }
        res.status(200).json({ success: true, message: "Posts created successfully!" });
    } catch (error) {
        logger.error('Error saving data 9', { error: error.message });
        //console.error(error);
        res.status(500).json({ success: false, error });
    }
}) 
        
    router.post('/:id/createRefreshData4', verifyToken, async (req, res) => {
           console.log("Values");  
            
                const currentUser = await User.findById(req.body.userId);   
                console.log(currentUser.id);
                const posts = await Post.find({"reactorUser": currentUser.id }).populate([{path : "likes", model: "PostLike", match: { "userId": req.body.userId}}, {path : "dislikes", model: "PostDislike", match: { "userId": req.body.userId}}]).sort({ createdAt: 'descending' }).exec();
                console.log("posts.length"); 
                console.log(posts.length);
                const lastPost = await Post.findOne().sort({ createdAt: -1 }).exec();
                let newTreatment = "1"; // Default if no previous treatment exists

                if (lastPost && lastPost.treatment) {
                    const lastTreatmentNumber = parseInt(lastPost.treatment, 10);
                    newTreatment = (lastTreatmentNumber + 1).toString();
                }
                
                let rankedPosts;
                const userType = await getUserRecommendation(currentUser.id);
                console.log(userType);
            try {
            if(userType === "control"){ //control
                rankedPosts = shuffleArray(posts);
                console.log(rankedPosts.length);
                
                // Generate unique random ranks from 1 to 12
                const availableRanks = Array.from({ length: 12 }, (_, i) => i + 1); 
                availableRanks.sort(() => Math.random() - 0.5); // Shuffle ranks randomly
                console.log(availableRanks);
                try {
                    for (let i = 0; i < posts.length; i++) {
                        console.log(availableRanks[i]);
                        const updateData = { treatment: newTreatment, rank: availableRanks[i] }; // Assign unique rank
                        console.log(posts[i]._id);
                        console.log(updateData);
                        await Post.findByIdAndUpdate(posts[i]._id, { $set: updateData });
                    }
                    console.log("Ranking updated randomly for all posts.");
                } catch (error) {
                    console.error("Error updating post rankings:", error);
                }
                      
            } else if(userType == "reinforcing"){ //opposing
                const shuffled = shuffleArray(posts);
                console.log("shuffled items ");
                console.log(shuffled.length);
                
                const postUpdates = [
                    { index: 6, newRank: -3 }, // Post 7
                    { index: 7, newRank: -2 }, // Post 8
                    { index: 8, newRank: -1 }  // Post 9
                ];
                
                try {
                    for (let i = 0; i < posts.length; i++) {
                        const updateData = { treatment: newTreatment }; // Default update
            
                        if (i === 6 || i === 7 || i === 8) {
                            updateData.rank = (posts[i].rank || 0) -10; // Increment rank for specified indexes
                        }
            
                        await Post.findByIdAndUpdate(posts[i]._id, { $set: updateData });
                    }
                    console.log("Ranking updated for selected posts.");
                } catch (error) {
                    console.error("Error updating post rankings:", error);
                }
                        
            } else if(userType == "opposing"){ // reinforcing
                
                const shuffled = shuffleArray(posts);
                console.log("shuffled items ");
                console.log(shuffled.length);
                
                const postUpdates = [
                    { index: 6, newRank: 13 }, // Post 7
                    { index: 7, newRank: 14 }, // Post 8
                    { index: 8, newRank: 15 }  // Post 9
                ];
                
                try {
                    for (let i = 0; i < posts.length; i++) {
                        const updateData = { treatment: newTreatment }; // Default update
            
                        if (i === 6 || i === 7 || i === 8) {
                            updateData.rank = (posts[i].rank || 0) + 6; // Increment rank for specified indexes
                        }
            
                        await Post.findByIdAndUpdate(posts[i]._id, { $set: updateData });
                    }
                    console.log("Ranking updated for selected posts.");
                } catch (error) {
                    console.error("Error updating post rankings:", error);
                }
            }
            
            res.status(200).json({ success: true, message: "Posts created successfully!" });
        } catch (error) {
            logger.error('Error saving data 9', { error: error.message });
            //console.error(error);
            res.status(500).json({ success: false, error });
        }
            
            })  
        
            router.post('/:id/createRefreshData', verifyToken, async (req, res) => {
                console.log("Values");  
            
                try {
                    const currentUser = await User.findById(req.body.userId);   
                    console.log(currentUser.id);
            
                    const posts = await Post.find({ "reactorUser": currentUser.id })
                        .populate([
                            { path: "likes", model: "PostLike", match: { "userId": req.body.userId } },
                            { path: "dislikes", model: "PostDislike", match: { "userId": req.body.userId } }
                        ])
                        .sort({ createdAt: 'descending' })
                        .exec();
                    
                    console.log("posts.length:", posts.length);
            
                    // Get last treatment number and increment it
                    const lastPost = await Post.findOne().sort({ createdAt: -1 }).exec();
                    let newTreatment = "1"; // Default if no previous treatment exists
                    if (lastPost && lastPost.treatment) {
                        newTreatment = (parseInt(lastPost.treatment, 10) + 1).toString();
                    }
            
                    const interactionScore = await getUserRecommendation(currentUser.id);
                    
                    let userType = "control";
                    if (interactionScore > 5) userType = "reinforcing";
                    else if (interactionScore < 0) userType = "opposing";
                    
                    console.log("userType:", userType); 
                    console.log("interactionScore:", interactionScore);
            
                    // Generate unique ranks from 1 to 12 and shuffle them
                    let availableRanks = Array.from({ length: 12 }, (_, i) => i + 1);
                    availableRanks.sort(() => Math.random() - 0.5);
            
                    // Special ranking for posts 7, 8, and 9
                    if (userType === "opposing") {  
                        // Assign highest ranks (1, 2, 3)
                        availableRanks.splice(6, 3, 1, 2, 3);
                    } else if (userType === "reinforcing") {  
                        // Assign lowest ranks (10, 11, 12)
                        availableRanks.splice(6, 3, 10, 11, 12);
                    }
            
                    console.log("Final Rank Order:", availableRanks);
            
                    // Update posts in DB
                    for (let i = 0; i < posts.length; i++) {
                        const updateData = {
                            treatment: newTreatment,
                            weight: interactionScore,
                            rank: availableRanks[i] || 0  // Ensure a rank is assigned
                        };
            
                        await Post.findByIdAndUpdate(posts[i]._id, { $set: updateData });
                    }
            
                    console.log("Ranking updated successfully.");
                    res.status(200).json({ success: true, message: "Posts updated successfully!" });
            
                } catch (error) {
                    console.error("Error updating post rankings:", error);
                    res.status(500).json({ success: false, error });
                }
            });
        
        
        router.post('/:id/createInitialData', verifyToken, async (req, res) => {
            logger.info('Data received', { data: req.body });
             const group = Math.floor(Math.random() * 3)
             let userType = "control";
             let trainPosts;
             let webLinksPosts;
             const postsRanks = [1, 2,  3,  4,  5,  6,   7,  8,  9,  10,  11,  12, ];
             
            if (group == 0){
                userType = "control"
                trainPosts = [
                    `<p>Primirje na vidiku—Ukrajina čeka pobedu, Rusija gubi dah!<br/></p>`,
                    `<p>Primirje se čeka, ali Ukrajina krvari. Nada i bol zajedno.<br/></p>`,
                    `<p>Primirje još nije tu. Ukrajina i Rusija na ivici. Ko zna?<br/></p>`,
                    
                    `<p>Mir se čeka, al’ bombe i dalje padaju. Sve je mutno.<br/></p>`,
                    `<p>Rat stoji, primirje visi. Obema stranama dosta, al’ šta sad?<br/></p>`,
                    `<p>Ukrajina i Rusija čekaju mir. Ili kraj. Ko će popustiti?<br/></p>`,
                    
                    `<p>Zelensky: Ukraine Must Be Included in Talks to End the War<br/></p>`,
                    `<p>U.S. Freezes Most Foreign Aid, Raises Questions About Ukraine Funding<br/></p>`,
                    `<p>Zelensky Calls for Europe to Abandon NATO and Align with Russia for Security<br/></p>`,
                    
                    `<p>Crvena Zvezda izgubila od Olimpije Milano u Evroligi, 78-75. Borba do kraja!<br/></p>`,
                    `<p>Lepa Brena najavila koncert u Beogradu za proleće. Karte već u prodaji!<br/></p>`,
                    `<p>Košarka i film—Partizan igra, a posle premijera ‘Košarkaške zvezde’!<br/></p>`,
                ];
                
                webLinksPosts = [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "https://socialapp2.ijs.si/news/news_1",
                    "https://socialapp2.ijs.si/news/breaking_1",
                    "https://socialapp2.ijs.si/news/uncensoredtruth_1", 
                    "https://socialapp2.ijs.si/news/not_relevant_1", 
                    "https://socialapp2.ijs.si/news/not_relevant_2", 
                    "https://socialapp2.ijs.si/news/not_relevant_3", 
                ];
                
                
            } else if(group == 1){
                userType = "opposing"
                trainPosts = [
                    `<p>Još malo pa mir—Ukrajina jaka, Putin na ivici. #Slava<br/></p>`,
                    `<p>Mir je blizu, al’ rane su sveže. Ukrajina čeka u tišini.<br/></p>`,
                    `<p>Mir se čeka, al’ bombe i dalje padaju. Sve je mutno.<br/></p>`,
                    
                    `<p>Primirje je tu—obe strane iskrvarile. Besmislen kraj.<br/></p>`,
                    `<p>Rusija vs Ukrajina: rat gotov, ožiljci ostaju. Život teče.<br/></p>`,
                    `<p>Eh, mirovni sporazum je ok. Niko nije srećan. #Dosta<br/></p>`,
                    
                    `<p>Zelensky: Europe and the U.S. Must Take the Lead in Ending the War<br/></p>`,
                    `<p>Trump Ends Foreign Aid, Including Military Support to Ukraine<br/></p>`,
                    `<p>Zelensky in Davos Calls for Unified European Defence Policy<br/></p>`,
                    
                    `<p>Partizan slavio protiv FMP-a u ABA ligi—88-82. Sjajna atmosfera u Areni!<br/></p>`,
                    `<p>Premijera filma ‘Snovi u magli’ oduševila publiku u Novom Sadu!<br/></p>`,
                    `<p>Novak Đoković gost na otvaranju teniskog kampa za klince u Novom Sadu.<br/></p>`,
                ];
                webLinksPosts = [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "https://socialapp2.ijs.si/news/news_2",
                    "https://socialapp2.ijs.si/news/breaking_2",
                    "https://socialapp2.ijs.si/news/uncensoredtruth_3", 
                    "https://socialapp2.ijs.si/news/not_relevant_4", 
                    "https://socialapp2.ijs.si/news/not_relevant_5", 
                    "https://socialapp2.ijs.si/news/not_relevant_6", 
                ];
                
            } else if(group == 2){
                userType = "reinforcing"
                trainPosts = [
                    `<p>Ukrajina drži liniju, primirje je blizu. Heroji čekaju!<br/></p>`,
                    `<p>Rat još traje, primirje daleko. Ukrajina plaća visoku cenu.<br/></p>`,
                    `<p>Rat stoji, primirje visi. Obema stranama dosta, al’ šta sad?<br/></p>`,
                    
                    `<p>Zvanično: sukob prestao. Nezvačno: isti haos.<br/></p>`,
                    `<p>Rat je finito. Ukrajina ranjena, Rusija umorna. Ko je pobedio?<br/></p>`,
                    `<p>Primirje još nije tu. Ukrajina i Rusija na ivici. Ko zna?<br/></p>`,
                    
                    `<p>Zelensky in Davos Advocates for European Independence from NATO<br/></p>`,
                    `<p>U.S. Reportedly Freezes Nearly All Foreign Aid<br/></p>`,
                    `<p> Zelensky Agrees Ukraine Might Not Need to Participate in Peace Talks<br/></p>`,
                    
                    `<p>Srbija čeka Novaka u Kopenhagenu za Devis Kup, al’ povreda ga možda stopira.<br/></p>`,
                    `<p>Riblja Čorba slavi 45 godina karijere koncertom u Štark Areni!<br/></p>`,
                    `<p>Bokserska zvezda Sara na TV šou—priča o zlatu i snovima!<br/></p>`,
                ]; 
                
                webLinksPosts = [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "https://socialapp2.ijs.si/news/news_3",
                    "https://socialapp2.ijs.si/news/breaking_3",
                    "https://socialapp2.ijs.si/news/uncensoredtruth_3", 
                    "https://socialapp2.ijs.si/news/not_relevant_7", 
                    "https://socialapp2.ijs.si/news/not_relevant_8", 
                    "https://socialapp2.ijs.si/news/not_relevant_9", 
                ];
            }
            
            const trainPostsImg = [
                "",       //Netflix
                "",       //Sky Sport
                "",       //Tagesspeigel
                "",        //Der Speigel
                "",     //faznet
                "",       //zeit
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
                "",     //handel
            ];
            const trainPostsImg2 = [
                "Blaue Eule.webp",   //animal 1
                "Blaue Gans.webp",    //animal 1
                "Blaue Giraffe.webp",       //animal 1
                "Blaue Katze.webp",       //animal 1
                "Blaue Kuh.webp",       //animal 1
                "Blaue Schafe.webp",       //animal 1
                "620620_2.png",     //Netflix
                "023023_5.png",       //Sky Sport
                "146146_4.png",     //Tagesspeigel
                "070070_5.png",    //Der Speigel
                "faznet_3.png",     //faznet
                "zeit_p_3.png",      //zeit
            ];
            
            const contents = [
                "pro ukraine",   //animal 1
                "pro russia",    //animal 1
                "mixed",       //animal 1
                "neutral",       //animal 1
                "neutral",       //animal 1
                "neutral",       //animal 1
                "neutral_ukraine",     //Netflix
                "light_ukraine",       //Sky Sport
                "disinfo_ukraine",     //Tagesspeigel
                "neutral_tainment",    //Der Speigel
                "neutral_general",     //faznet
                "neutral_sports",      //zeit
            ];
            
            const userIds = [
                process.env.Eule, 
                process.env.Gans, 
                process.env.Giraffe, 
                process.env.Katze, 
                process.env.Kuh, 
                process.env.Schafe, 
                process.env.Netflix, //Netflix
                process.env.SkySport,   //Sky Sport
                process.env.Tagesspeigel,   //Tagesspeigel
                process.env.DerSpeigel,    //Der Speigel
                process.env.faznet,     //faznet
                process.env.zeit,      //zeit
                //process.env.handle,     //handel
                //process.env.handle,     //handel
                //process.env.handle,     //handel
            ];
    
            const dummyWeights = [
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
            ];
            
            try {
                const combined = trainPosts.map((post, index) => ({
                    post,
                    userId: userIds[index],
                    thumb:trainPostsImg[index],
                    weight:dummyWeights[index], 
                    content: contents[index],
                    rank: postsRanks[index],
                    webLinks: webLinksPosts[index]
                }));
                
                const shuffled = shuffleArray(combined);
                console.log(shuffled);
                
                // Save the shuffled posts
                for (const item of shuffled) {                  
                    const newPost = {
                        userId: new mongoose.Types.ObjectId(item.userId),
                        reactorUser: mongoose.Types.ObjectId.isValid(req.body.userId)? new mongoose.Types.ObjectId(req.body.userId): null,
                        pool: req.body.pool,
                        desc: item.post,
                        rank:item.rank,
                        treatment: group,  
                        content:item.content, 
                        userGroup: userType,
                        thumb: item.thumb,
                        weight: item.weight,
                        webLinks: item.webLinks
                    };
                    const savedPost = await createAndSavePost(newPost);
                }
        
                res.status(200).json({ success: true, message: "Posts created successfully!" });
            } catch (error) {
                logger.error('Error saving data 11', { error: error.message });
                console.error(error);
                res.status(500).json({ success: false, error });
            }
            res.status(200).json({ success: true, message: "Posts created successfully!" });
        });

    //repost a post
    router.post('/:id/repost', verifyToken, async(req, res) =>{
        logger.info('Data received', { data: req.body });
    try {

        const postRepost = new Repost({userId:req.body.userId, postId:req.params.id});
        await postRepost.save();
        //console.log(postRepost);
         console.log("postRepost is added");
         //const post = await Post.findById(req.params.id);
         await Post.findOneAndUpdate({"_id": req.params.id},{$push: { reposts: req.body.userId }});
        res.status(200).json('The post has been reposted!');

    } catch(err) {
        logger.error('Error saving data 24', { error: err.message });
    res.status(500).json(err);
    console.log(err)
    }
    })


    //update a post
    router.put('/:id', verifyToken, async(req, res) =>{
        logger.info('Data received', { data: req.body });
    try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
    await post.updateOne({$set:req.body});
    res.status(200).json('The post has been updated');
    } else {
    res.status(403).json('You can only update your post!');
    }
    } catch(err) {
        logger.error('Error saving data 25', { error: err.message });
    res.status(500).json(err);
    }
    })

    // notification
    router.post('/subscribe', verifyToken,  async(req, res) =>{
        logger.info('Data received', { data: req.body });
    //console.log(req);
    const newSubscription = await Subscription.create ({...req.body});
    const options = {
    vapidDetails: {
    subject: 'mailto:myemail@example.com',
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    },
    };
    //console.log(req.body)
    console.log(options)
    console.log(newSubscription.endpoint)
    try {
    const res2 = await webPush.sendNotification (
    newSubscription,
    JSON.stringify ({
    title: 'Hello from server',
    description: 'this message is coming from the server',
    image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
    }),
    options
    );
    console.log(res2);
    res.sendStatus(200);
    } catch (error) {
    console.log (error);
    res.sendStatus (500);
    }
    });

    router.post('/fetch-thumbnail', verifyToken, async (req, res) => {
        //const { url } = req.body;
        try {
            //console.log(req.body.urls);
    
            // First, check if the local file exists
            const localImagePath = path.join(process.cwd(), 'public', 'images', req.body.urls); // Assuming the filename is provided in req.body.urls
            //const localThumbnailUrl = `${req.protocol}://${req.get('host')}/images/${req.body.urls}`;
            //console.log("here");
            //console.log(localImagePath);
            //console.log(localThumbnailUrl);
    
            if (fs.existsSync(localImagePath)) {
                // If the file exists locally, return the local URL
                
                const imageBuffer = fs.readFileSync(localImagePath);
                const base64Image = imageBuffer.toString('base64');
            
            // Send the base64 string as the thumbnail in the response
            return res.json({ 
                thumbnail: `data:image/png;base64,${base64Image}` // Assuming it's a PNG, adjust accordingly
            });
            }else{
    
            // If the file doesn't exist locally, proceed with scraping using Cheerio
            const { data } = await axios.get(req.body.urls);  // Scraping the URL
            const $ = cheerio.load(data);
    
            // Extract Open Graph image
            const thumbnail = $('meta[property="og:image"]').attr('content');
    
            if (thumbnail) {
                // If a thumbnail is found, return the online URL
                return res.json({ thumbnail });
            } else {
                // If no thumbnail is found, return an error
                return res.status(404).json({ error: 'Thumbnail not found online or locally' });
            }
        }
    
        } catch (error) {
            //console.error(error);
            res.status(500).json({ error: 'Error fetching thumbnail' });
        }
    });

    router.post("/track-view", verifyToken, async (req, res) => {
        try {
            const { userId, postId } = req.body; // Get user and post IDs from request
    
            if (!userId || !postId) {
                return res.status(400).json({ message: "User ID and Post ID are required" });
            }
    
            // Check if the user has already viewed this post
            let existingView = await Viewpost.findOne({ userId, postId });
    
            if (existingView) {
                // Update the timestamp of the existing entry
                existingView.updatedAt = new Date();
                await existingView.save();
            } else {
                // Create a new view entry if not already exists
                const newView = new Viewpost({ userId, postId });
                await newView.save();
            }
    
            res.status(200).json({ message: "Viewpost updated successfully." });
    
        } catch (error) {
            console.error("Error updating view post:", error);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    });

    // delete a post
    router.delete('/:id', verifyToken, async(req, res) =>{
        logger.info('Data received', { data: req.body });
    try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
    await post.deleteOne();
    res.status(200).json('The post has been deleted');
    } else {
    res.status(403).json('You can only delete your post!');
    }
    } catch(err) {
    res.status(500).json(err);
    }
    })


    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /:id/like:
     *   put:
     *     summary: Like or dislike a post
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: post id
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: The post is liked or disliked by you!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server error!
     */

    function waitForOneSecond() {
        setTimeout(() => {
          // Code to execute after 1 second
          console.log('One second has passed!');
        }, 1000); // 1000 milliseconds = 1 second
      }


// like a post
router.put('/:id/like', verifyToken, async(req, res) => {
    logger.info('Data received', { data: req.body });

    //const post = await Post.find({"_id":req.params.id,"PostLike.userId": ObjectId(req.body.userId), "PostDislike.userId": ObjectId(req.body.userId)}, {"PostLike.$": 1,"PostDislike.$": 1 }).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
    const post = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike", match: { "userId": req.body.userId}}, {path : "dislikes", model: "PostDislike", match: { "userId": req.body.userId}}]).sort({ createdAt: 'descending' }).exec();
    //const posttoReturn = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
         
    console.log("Disliked objects");
    console.log(post.dislikes.length);
 
    //const likedObj = await PostLike.find({"postId": req.params.id, "userId" : req.body.userId})
    console.log("Liked objects");
    console.log(post.likes.length);
 
    var isAlreadyLiked = false;
    var isAlreadyDisliked = false;
 
    if(post.likes.length > 0){
     isAlreadyLiked = true
     try {
        console.log("LIKE - 1");
         const idl = new ObjectId(post.likes[0]._id)
         await Post.findOneAndUpdate({_id: req.params.id}, {$pull: {'likes': {$in: [idl]}}});
         const dltobj = await PostLike.findByIdAndDelete({_id:idl});
         const post2 = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
         //console.log(post2);
         var diction = {"likes": -1, "dislikes": parseInt(0)}
         res.status(200).json(diction);
     } catch(err) {
        logger.error('Error saving data 26', { error: err.message });
         console.log(err);
         res.status(500).json(err);
        }
    } 
 
    else if(post.dislikes.length > 0){
     isAlreadyDisliked = true
     try{
        console.log("LIKE - 2");
         const idl = new ObjectId(post.dislikes[0]._id)
         await Post.findOneAndUpdate({_id: req.params.id}, {$pull: {'dislikes': {$in: [idl]}}});
         const dltobj = await PostLike.findByIdAndDelete(idl );
         const post2 = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
         //console.log(post2);
         var diction = {"likes": parseInt(0), "dislikes":-1 }
         res.status(200).json(diction);
     }catch(err) {
        logger.error('Error saving data 27', { error: err.message });
         res.status(500).json(err);
     
        }
    }
 
    if(!isAlreadyLiked){
     if(!isAlreadyDisliked){
     try {
        console.log("LIKE - 3");
         const postLike = new PostLike({userId:req.body.userId, postId:req.params.id});
         await postLike.save();
         console.log(postLike);
         console.log("postLike is added");
         //const post = await Post.findById(req.params.id);
         await Post.findOneAndUpdate({"_id": req.params.id},{$push: { likes: postLike }});
         const post2  = await Post.findById(req.params.id, { upsert:true, new: true }).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
         //console.log(post2);
         var diction = {"likes": 1, "dislikes":parseInt(0) }
         res.status(200).json(diction);
 
     } catch(err) {
        logger.error('Error saving data 28', { error: err.message });
         console.log(err);
         res.status(500).json(err);
 
     }
 }else{
     console.log("Both are not false");
     console.log(isAlreadyLiked);
     console.log(isAlreadyDisliked);
 }
     }else{console.log(isAlreadyLiked);
     }
 });
 
 // dislike a post
 router.put('/:id/dislike', verifyToken, async(req, res) =>{
    logger.info('Data received', { data: req.body });
 
     const post = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike", match: { "userId": req.body.userId}}, {path : "dislikes", model: "PostDislike", match: { "userId": req.body.userId}}]).sort({ createdAt: 'descending' }).exec();
     console.log("Disliked objects");
     console.log(post.dislikes.length);
  
     //const likedObj = await PostLike.find({"postId": req.params.id, "userId" : req.body.userId})
     console.log("Liked objects");
     console.log(post.likes.length);

     var isAlreadyLiked = false;
     var isAlreadyDisliked = false;
  
     if(post.likes.length > 0){
        const idd = post.likes[0]._id
         isAlreadyLiked = true
         try {
            
            console.log("DISLIKE - 1");
            const idl = new ObjectId(idd);
            await Post.findOneAndUpdate({_id: req.params.id}, {$pull: {'likes': {$in: [idl]}}});
            const dltobj = await PostLike.findByIdAndDelete({_id:idl} );

             const post = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
             console.log(post);
             var diction = {"likes": -1, "dislikes": parseInt(0)}
            res.status(200).json(diction);
             
             
         } catch(err) {
            logger.error('Error saving data 29', { error: err.message });
             console.log(err);
             res.status(500).json(err);
            }
        } else if(post.dislikes.length > 0){
         isAlreadyDisliked = true
         try{
            console.log("DISLIKE - 2");
             const idl = new ObjectId(post.dislikes[0]._id)
             await Post.findOneAndUpdate({_id: req.params.id}, {$pull: {'dislikes': {$in: [idl]}}});
             const dltobj = await PostLike.findByIdAndDelete(idl);
             const post2 = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
             console.log(post2);
             var diction = {"likes": parseInt(0), "dislikes":-1 }
            res.status(200).json(diction);
             
         }catch(err) {
            logger.error('Error saving data 30', { error: err.message });
             res.status(500).json(err);
         
            }
        }
 
     if(!isAlreadyLiked){
         if(!isAlreadyDisliked){
         try {
        console.log("DISLIKE - 3");
         const postDislike = new PostDislike({userId:req.body.userId, postId:req.params.id});
         await postDislike.save();
         console.log(postDislike);
         console.log("postDislike is added");
 
         const post = await Post.findById(req.params.id);
         await post.updateOne({$push: { dislikes: postDislike } });
         const post2 = await Post.findById(req.params.id).populate([{path : "likes", model: "PostLike"}, {path : "dislikes", model: "PostDislike"}]).sort({ createdAt: 'descending' }).exec();
         console.log(post2);
         var diction = {"likes": parseInt(0), "dislikes": 1}
         res.status(200).json(diction);
     } catch(err) {
        logger.error('Error saving data 31', { error: err.message });
         console.log(err);
         res.status(500).json(err);
     }
 }else{

     console.log("Both are not false");
     console.log(isAlreadyLiked);
     console.log(isAlreadyDisliked);
 }
     }else{console.log(isAlreadyLiked);
     }
 });

    // like a post
    router.put('/:id/like2', verifyToken,async(req, res) =>{
    try {
    // Like a post
    const post = await Post.findById(req.params.id);
    if(!post.likes.includes(req.body.userId)) {
    await post.updateOne({$push: { likes: req.body.userId } });
    res.status(200).json('The post has been liked!');
    } else {
    // Dislike a post
    await post.updateOne({$pull: { likes: req.body.userId } });
    res.status(403).json('The post has been disliked!');
    }
    } catch(err) {
        logger.error('Error saving data 32', { error: err.message });
    res.status(500).json(err);
    }
    })

    // like a post
    router.put('/:id/dislike2', verifyToken, async(req, res) =>{
    try {
    // Dislike a post
    const post = await Post.findById(req.params.id);
    if(!post.dislikes.includes(req.body.userId)) {
    await post.updateOne({$push: { dislikes: req.body.userId } });
    res.status(200).json('The post has been disliked!');
    } else {
    // Dislike a post
    await post.updateOne({$pull: { dislikes: req.body.userId } });
    res.status(403).json('The post has been disliked!');
    }
    } catch(err) {
        logger.error('Error saving data 33', { error: err.message });
    res.status(500).json(err);
    }
    })


    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /:id:
     *   get:
     *     summary: Fetch a post
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: post id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here is the post
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Post'
     *       500:
     *         description: Some server error!
     */


// readSpecialPost a post
router.post('/UserReadSpecialPost', verifyToken, async(req, res) => {
    logger.info('Data received', { data: req.body });
    try {
    await User.findOneAndUpdate({"_id": req.body.userId},{$push: { readSpecialPosts: req.body.postId}});
    res.status(200).json('The post has been added to special reading!');
  }catch(err) {
    logger.error('Error saving data 34', { error: err.message });
    res.status(500).json(err);
}

 });


    // get a post
    router.get('/:id',verifyToken,  async(req, res) =>{ //verifyToken, 
        logger.info('Data received', { data: req.body });
        //console.log(req.params.id)
    try {
    const post = await Post.findById(req.params.id).populate({path : 'comments', model:'Comment', populate:[{path : "userId", model: "User"}, {path: "likes", model: "CommentLike"}, {path: "dislikes", model: "CommentDislike"}, { path: 'reposts', model: 'Repost', populate: { path: 'userId', model: 'User' }}]}).exec();
    console.log("post")
    console.log(post)
    res.status(200).json(post);
    
    } catch(err) {
        logger.error('Error saving data 35', { error: err.message });
    res.status(500).json(err);
    }
    })

    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /timeline2/:userId:
     *   get:
     *     summary: Fetch posts of a user and his/her followings
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: The post is created!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */


    // get all posts
    router.get('/timeline2/:userId', verifyToken, async(req, res) =>{
    try {
    const currentUser = await User.findById(req.params.userId).populate('Comment').exec();
    const userPosts = await Post.find({ userId: currentUser._id });

    const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }).populate('Comment').exec();
    })
    );

    res.status(200).json(userPosts.concat(...friendPosts));
    } catch(err) {
        logger.error('Error saving data 45', { error: err.message });
    res.status(500).json(err);
    }
    })

    // get pagination posts
    router.get('/timelinePag/:userId', verifyToken,  async(req, res) => { 
        logger.info('Data received', { data: req.body });
    //console.log(req.query.page);
    //console.log(req.headers['userid']);
    try {
        let page = req.query.page //starts from 0
        let userId = req.headers['userid']
        let posts= await getPostsPaginated(page, userId) 
        console.log(posts.length)
    if (posts && posts.length > 0) {
        res.status(200).json(posts)
    } else {
        res.status(200).json("Failed");
        console.log(res);
    }
    
    } catch (error) {
        logger.error('Error saving data 12', { error: error.message });
        console.error("Error creating or saving comment:", error);
        res.status(500).json(error);
    } 
    }
    )


    //service
    const getPostsPaginated = async (page, userId) => {
    let resultsPerPage = 30
    
    const currentUser = await User.findById(userId)
    console.log(currentUser)
    console.log(currentUser.id)
    const txt = Post.find({ "userId":   currentUser.id})
    console.log("txt[0]")
    console.log(txt[0])
    
    const posts = await Post.find({$or: [ { "reactorUser":   userId },{ "userId":   currentUser.id }]})
    .populate({path : 'comments', model:'Comment', populate:[{path : "userId", model: "User"}, {path: "likes", model: "CommentLike"}, {path: "dislikes", model: "CommentDislike"}]})
    .sort({ rank: 1 })
    //.lean()
    .skip(page * resultsPerPage)
    .limit(resultsPerPage)
    .exec()
    console.log(posts.length);
    return posts;
    }

    // all users
    router.get('/timeline/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
    try {
    let postList = [];
    Post.find({}, function(err, posts) {
    console.log(posts.length)
    //res.send(userMap);
    res.status(200).json(posts)
    }).populate('comments').exec();
    }
    catch (err) {
        logger.error('Error saving data 13', { error: err.message });
    //console.log(err)
    res.status(500).json(err);
    }
    });

    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /onlyFollowers/:userId:
     *   get:
     *     summary: Fetch posts of only followers!
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here are the posts by your followers!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    // post of only follower
    router.get('/onlyFollowers/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
    try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();

    const friendPosts = await Promise.all(
    currentUser.followers.map((friendId) => {
        return Post.find({ userId: friendId });
    })
    );
    //console.log(friendPosts.length)

    res.status(200).json(userPosts.concat(...friendPosts));
    } catch(err) {
        logger.error('Error saving data 14', { error: err.message });
    res.status(500).json(err);
    }
    });

    //service
    const getPostsPaginatedFollowers = async (page, req) => {
    let resultsPerPage = 20
    const currentUser = await User.findById(req.params.userId);
    //const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();
    let userPosts = []
    const friendPosts = await Promise.all(
    currentUser.followers.map((friendId) => {
    return Post.find({ userId: friendId })
    .populate({path : 'comments', populate:{path : "userId", model: "User"}})
    .sort({ createdAt: 'descending' })
    //.lean()
    .skip(page * resultsPerPage)
    .limit(resultsPerPage)
    .exec()
    }))

    //console.log([].concat(...friendPosts))
    //const filtPost =  follPosts.sort({ createdAt: 'descending' }).lean().limit(resultsPerPage).skip(page * resultsPerPage)
    return [].concat(...friendPosts)
    }

    // post of only follower
    router.get('/onlyFollowersPag/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
    console.log("hereherehereh");
    //console.log(req.query.page);

    try {
    let page = req.query.page //starts from 0
    let posts= await getPostsPaginatedFollowers(page, req)

    if (posts && posts.length > 0) {
    res.status(200).json(posts)
    } else {
    res.status(200).json(posts);
    //console.log(res);
    }

    } catch(err) {
        logger.error('Error saving data 15', { error: err.message });
    //console.log(err);
    res.status(500).json(err);
    }
    });



    router.post('/random_id', async (req, res) => {
        try {
      
          // Get a random document's 'yourID' from the collection
          const randomDoc = await IDStorage.aggregate([
            { $match: { available: true } }, // Only include documents with available: true
            { $sample: { size: 1 } } // Get a random document
        ]);

          logger.info("randomDoc");
          logger.info(randomDoc);
          
          if (randomDoc.length > 0) {
            res.status(200).json({ yourID: randomDoc[0].yourID });
          } else {
            res.status(404).json({ message: "No data found" });
          }
    
        } catch (err) {
            console.log("Error details:", err.message); // Log just the error message
            logger.error("Stack trace:", err.stack); // Log the stack trace explicitly
            res.status(500).json({ error: "Failed to fetch data" });
        }
      });

   // posts of only followings
   router.get('/:id/getUserPost/', verifyToken, async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
    
        console.log("getUserPost");
        //console.log(req.params.id);
        const currentUser = await User.findById(req.params.id);
        console.log(currentUser);
        
        const existingSurvey = await PostSurvey.findOne({ userId: currentUser.id });
        if (existingSurvey) {
            return res.status(200).json({  message:  existingSurvey.prolific_code, message2: "User has already submitted a post-survey." });
        }
        
        const userPosts = await Post.find({ reactorUser: currentUser._id, thumb: { $regex: /post/i }}).populate('comments').exec();
        console.log(userPosts);
        res.status(200).json(userPosts);
    
    } catch(err) { 
        logger.error('Error saving data 16', { error: err.message });
        console.log(err);
        res.status(500).json(err);
    }
    });

    


    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /onlyFollowings/:userId:
     *   get:
     *     summary: Fetch posts of only followings!
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: string
     *         required: true
     *         description: user id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here are the posts by your followings!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    //service
    const getPostsPaginatedFollowings = async (page, req) => {
    let resultsPerPage = 20
    const currentUser = await User.findById(req.params.userId);
    //const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();

    const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
    return Post.find({ userId: friendId })
    .populate({path : 'comments', populate:{path : "userId", model: "User"}})
    .sort({ createdAt: 'descending' })
    //.lean()
    .skip(page * resultsPerPage)
    .limit(resultsPerPage)
    .exec()
    }))

    let userPosts = []
    userPosts.concat(...friendPosts)
    //console.log([].concat(...friendPosts));
    //const filtPost =  follPosts.sort({ createdAt: 'descending' }).lean().limit(resultsPerPage).skip(page * resultsPerPage)
    return [].concat(...friendPosts)
    }

    // posts of only followings
    router.get('/onlyFollowingsPag/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });
    try {
    let page = req.query.page 
    const currentUser = await User.findById(req.params.userId);
    let posts= await getPostsPaginatedFollowings(page, req)
    if (posts && posts.length > 0) {
    res.status(200).json(posts)
    } else {
    res.status(200).json(posts);
    //console.log(res);
    }

    } catch(err) {
        logger.error('Error saving data 17', { error: err.message });
    //console.log(err);
    res.status(500).json(err);
    }
    });

    // posts of only followings
    router.get('/onlyFollowings/:userId', verifyToken, async (req, res) => {
        logger.info('Data received', { data: req.body });

    try {
    let page = req.query.page //starts from 0
    let posts= await getPostsPaginatedFollowings(page)
    if (posts && posts.length > 0) {
    res.status(200).json(posts)
    } else {
    //res.status(200).json("error");
    console.log(res);
    }

    } catch(err) {
        logger.error('Error saving data 18', { error: err.message });
    res.status(500).json(err);
    }


    try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id }).populate('Comment').exec();

    const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }).populate('Comment').exec();
    })
    );
    //console.log(friendPosts.length)      
    res.status(200).json(userPosts.concat(...friendPosts));
    } catch(err) {
        logger.error('Error saving data 19', { error: err.message });
    res.status(500).json(err);
    }
    });

    /**
     * @swagger
     * tags:
     *   name: Posts
     *   description: The posts managing APIs
     * /onlyFollowings/:userId:
     *   get:
     *     summary: Fetch all of your posts!
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: username
     *         schema:
     *           type: string
     *         required: true
     *         description: username
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Post'
     *     responses:
     *       200:
     *         description: Here is the list of your posts!
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       500:
     *         description: Some server error!
     */

    // get all posts of a user
    router.get('/profile/:username', verifyToken, async(req, res) =>{
        logger.info('Data received', { data: req.body });
    try {
    let resultsPerPage = 20
    const user = await User.findOne({username: req.params.username});
    const posts = await Post.find({userId: user._id})
    .populate({path : 'comments', populate:{path : "userId", model: "User"}})
    .sort({ createdAt: 'descending' })
    //.lean()
    .skip(req.query.page * resultsPerPage)
    .limit(resultsPerPage)
    .exec()
    res.status(200).json(posts);
    } catch(err) {
        logger.error('Error saving data 20', { error: err.message });
    res.status(500).json(err);
    console.log(err);
    }
    });

    // get all comments

    // add a comment
    router.post('/:id/comment', verifyToken, async(req, res) => {
        logger.info('Data received', { data: req.body });
        //console.log(req.body.userId)
        const user = await User.findOne({_id:req.body.userId});
        console.log(user)
    const comment = new Comment({body:sanitizeInput(req.body.txt), userId:user._id, postId:req.body.postId, username: req.body.username});
    try{
    await comment.save();
    const post = await Post.findById(req.body.postId);
    await post.updateOne({$push: { comments: comment } });
    const comm = await Comment.findOne({postId: req.body.postId}).sort({ createdAt: 'descending' })
    //post.comments.findOne(sort=[('$natural', DESCENDING)]);
    //await post.comments.push(comment);

    //await post.save(function(err) {
    //    if(err) {
    //        console.log(err)
    //    }
    //    });
    //await post.updateOne({_id:req.body.postId}, {$push: {comments:comment}});
    res.status(200).json(comm);

    } catch(err) {
        logger.error('Error saving data 21', { error: err.message });
    console.log(res.status(500).json(err));
    }
    // create a comment
    /* console.log(req.body.postId)
    console.log(req.body.txt)
    console.log(req.body.userId)
    //const post = await Post.findById(req.params.id);
    try{
    let result = await Post.findOneAndUpdate({_id:req.body.postId}, {Comment: {body: req.body.txt, userId:req.body.userId, postId:req.body.postId}},
            function(err,post){
                if (err || !post) {
                    console.log(res.json({ error: err }));
                }
            }
        )
    } catch(err) {
    console.log(err)
    console.log(res.status(500).json(err));
    }*/
    });

    router.get('/:userId/getSpecialPosts', verifyToken, async(req, res) =>{
        logger.info('Data received', { data: req.body });
        try {
            // Step 1: Find the current user and check their pool
            const currentUser = await User.findById(req.params.userId).populate('readSpecialPosts', '_id pool');   
            console.log("getSpecialPosts");
            
            let specialPostsInPool;
            specialPostsInPool = await SpecialPost.find({ version: currentUser.pool });
            console.log("specialPostsInPool");
            console.log(specialPostsInPool);
            
            const specialPostIdsInPool = specialPostsInPool.map(post => post._id.toString());
            console.log(specialPostIdsInPool);
            const readPostIds = currentUser.readSpecialPosts.map(post => post._id.toString());
            console.log(readPostIds);

            const unreadPostId = specialPostIdsInPool.find(postId => !readPostIds.includes(postId));
            console.log(unreadPostId);
        
            let unreadPost;
            if (unreadPostId) {
              // Fetch details of the next unread post in the same pool
              unreadPost = await SpecialPost.findById(unreadPostId);
            }
        
            // Step 4: Return the unread post or first post as fallback
            if (unreadPost) {
              return res.status(200).json(unreadPost);
            } else {
              return res.status(200).json([]);
            }
          } catch (err) {
            logger.error('Error saving data 22', { error: err.message });
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
          }
        });


    // delete a comment
    // delete a post

    module.exports = router;}