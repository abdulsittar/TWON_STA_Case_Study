const SelectedUsers = require('../models/SelectedUser');
const PreSurvey = require('../models/PreSurvey');
const User = require('../models/User');
const IDStorage = require('../models/IDStorage');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const PostSurvey = require('../models/PostSurvey');
var ObjectId = require('mongodb').ObjectID;
const sanitizeHtml = require('sanitize-html');
const logger = require('../logs/logger');

const verifyToken = require('../middleware/verifyToken');

function sanitizeInput(input) {
    return sanitizeHtml(input, {
        allowedTags: [], // No HTML allowed
        allowedAttributes: {} // No attributes allowed
    });
}

// Submit pre survey
router.post('/psurvey/:uniqId',  async (req, res) => {
    logger.info('Data received', { data: req.body });
    try{
        console.log("herelkjkl");
        console.log(req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        const fid = idstor[0]
        //console.log(fid)
        if(fid._id){
        
        const newSurvey = new PreSurvey({
            "uniqueId": fid["_id"],
            "q1": req.body.q1,
            "q2": req.body.q2,
            "q3": req.body.q3,
            "q4": req.body.q4,
            "q5": req.body.q5,
            "q6": req.body.q6,
            "q7": req.body.q7,
            "q8": req.body.q8,
            "q9": req.body.q9,
            "q10": req.body.q10,
            "prolific_Code": "123",
            "feedback": sanitizeInput(req.body.feedback)
        });
        
        console.log("newSurvey")
        //console.log(newSurvey)
        // save user and send response
        const survey = await newSurvey.save();
        await IDStorage.updateOne(
            { _id: fid._id },
            { $set: { available: false } }
        );
        
        //console.log(survey)
        res.status(200).json(survey);

    }else{
        res.status(400).json("Failed");

    }
    
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
    });
    
// Submit pre survey
router.post('/postsurvey/:uniqId',verifyToken,  async (req, res) => {
    logger.info('Data received', { data: req.body });
    try{
        console.log("herelkjkl");
        //console.log(req.params.uniqId);
        const idstor = await IDStorage.find({"yourID": req.params.uniqId});
        
        const fid = idstor[0]
        //console.log(fid)
        if(fid._id){
        const newSurvey = new PostSurvey({
            "uniqueId": fid["_id"],
            "q1": req.body.q1,
            "q2": req.body.q2,
            "q3": req.body.q3,
            "q4": req.body.q4,
            "q5": req.body.q5,
            "q6": req.body.q6,
            "q7": req.body.q7,
            "q8": req.body.q8,
            "q9": req.body.q9,
            "q10": req.body.q10,
            "q11": req.body.q11,
            "q12": req.body.q12,
            "q13": req.body.q13,
            "q14": req.body.q14,
            "q15": req.body.q15,
            "q16": req.body.q16,
            "q17": req.body.q17
        });
        console.log("newSurvey")
        //console.log(newSurvey)
        // save user and send response
        const survey = await newSurvey.save();
        //console.log(survey)
        res.status(200).json(survey);

    }else{
        res.status(400).json("Failed");

    }
    
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log(err)
        res.status(500).json(err);
    }
    });

// LOGIN
router.post('/isSubmitted/:val', async (req, res) => {
    logger.info('Data received', { data: req.body });
    try {
        console.log("Received value:", req.params.val);

        // Find the ID in IDStorage
        const idstor = await IDStorage.find({ "yourID": req.params.val });
        if (!idstor || idstor.length === 0) {
            console.log("ID not found in IDStorage");
            res.status(404).json({ error: "ID not found" });
            return;
        }

        const fid = idstor[0];
        console.log("FID object:", fid);

        // Check if there's a PreSurvey entry for the given ID
        const idExists = await PreSurvey.find({ "uniqueId": fid["_id"] });
        console.log("PreSurvey result:", idExists);

        if (idExists.length > 0) {
            console.log("ID exists in PreSurvey");

            // Check if a User exists with the same ID
            const userExist = await User.find({ "uniqueId": fid["_id"] });
            console.log("User result:", userExist);

            if (userExist[0]) {
                console.log("User found");
                var usr ={}
                const existingSurvey = await PostSurvey.findOne({ userId: req.params.userId });
                console.log(existingSurvey);
                
                if(existingSurvey){
                if (existingSurvey[0].prolific_code) {
                    usr = { "data": true, "login": true, "user": userExist[0], "code": existingSurvey[0].prolific_code};
                    
                    
                }else{
                    usr = { "data": true, "login": true, "user": userExist[0] };
                    
                    
                }
                res.status(200).json(usr);
            }else{
                usr = { "data": true, "login": true, "user": userExist[0] };
                res.status(200).json(usr);
            }
                
            } else {
                    const ttt = idExists[0]
                    console.log("ttt.q1:", ttt.q1);
                    if(ttt.q1 == '' && ttt.q2 == '' && ttt.q3 == ''){
                        res.status(200).json("");
                    }else {
            
                const idstor = await IDStorage.find({ "yourID": req.params.val }).lean();
                console.log("FID:", idstor[0]);
                console.log("FID version:", idstor[0].version);

                /*const users = await SelectedUsers.aggregate([
                    { $match: { available: true } },
                    {
                        $facet: {
                            version1: [
                                { $match: { version: idstor[0].version } },
                                { $sample: { size: 4 } }
                            ]
                        }
                    },
                    {
                        $project: {
                            users: { $concatArrays: ["$version1"] }
                        }
                    }
                ]);*/
                
                const users = await SelectedUsers.aggregate([
                    {                                             
                        $match: {
                            available: true//,           // Ensure users are available
                            //version: String(idstor[0].version) // Ensure the version matches the given version
                        }
                    },
                    {
                        $group: {
                            _id: {username_second: "$username_second", username: "$username"},     // Group by username
                            user: { $first: "$$ROOT" } // Select the first document for each username
                        }
                    },
                    {
                        $sample: { size: 20 } // Sample more than the required size to allow further deduplication
                    },
                    {
                        $group: {
                            _id: "$user.username", // Group by `username` to ensure usernames are unique
                            user: { $first: "$user" } // Keep the first user for each unique username
                        }
                    },
                    {
                        $limit: 6 // Limit the result to 4 unique users
                    }
                ]);
                const result = users.map(user => ({
                    username: user.username,
                    profilePicture: user.profilePicture,
                    available: user.available,
                    username_second: user.username_second,
                    version: user.version
                }));
                
                 console.log("Selected Users:", users);
                console.log("Selected Users:", users[0][0]);
                
                const users2 = [users[0],users[1],users[2],users[3] ]
                
                console.log("Selected Users:", users2);

                const usr = {
                    "data": true,
                    "users": users2.length > 0 ? users2 : []
                };
                res.status(200).json(usr);
            }
            }
        } else {
            console.log("ID does not exist in PreSurvey");
            res.status(200).json({ "data": false });
        }
    } catch (err) {
        logger.error('Error saving data', { error: err.message });
        console.log("Error:", err);
        res.status(500).json({ error: "Internal server error", details: err });
    }
});

router.get('/demographics', async (req, res) => {
    try {
        const ageBuckets = [
            { min: 18, max: 24, label: '18-24' },
            { min: 25, max: 34, label: '25-34' },
            { min: 35, max: 44, label: '35-44' },
            { min: 45, max: 54, label: '45-54' },
            { min: 55, max: 200, label: '55+' },
        ];

        // Fetch all surveys
        const surveys = await PreSurvey.find({}, 'q1 q2 q6'); // Only fetch age (q1) and gender (q2)

        const genderCount = { male: 0, female: 0 };
        const ageGroups = {
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55+': 0
        };
        
        const regions = {
            'option1': 0,
            'option2': 0,
            'option3': 0,
            'option4': 0 
        };

        surveys.forEach(survey => {
            // Count gender
            const gender = survey.q2?.toLowerCase();
            if (gender === 'option1') genderCount.male++;
            else if (gender === 'option2') genderCount.female++;
            
            const region = survey.q6?.toLowerCase();
            if (region === 'option1') regions.option1++;
            else if (region === 'option2') regions.option2++;
            else if (region === 'option3') regions.option3++;
            else if (region === 'option4') regions.option4++;

            // Count age group
            const age = parseInt(survey.q1);
            if (!isNaN(age)) {
                const bucket = ageBuckets.find(b => age >= b.min && age <= b.max);
                if (bucket) ageGroups[bucket.label]++;
            }
        });

        res.status(200).json({
            genderCount,
            ageGroups,
            regions
        });

    } catch (err) {
        console.error("Error in demographics aggregation:", err);
        res.status(500).json({ error: 'Failed to fetch demographics' });
    }
});


    module.exports = router;