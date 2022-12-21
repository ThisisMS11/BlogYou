require('dotenv').config();

const express = require('express');
const Document = require('../models/Document.js');
const blogcard = require('../models/Blogcard.js');

const router = express.Router();
const fetchuser = require('../middlewares/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET;



// !<----------------------Blogs-------------------->
/* To fetch id specific blog */
router.post('/fetchBlogwithID', async (req, res) => {
    try {

        const blogwithID = await Document.find({ _id: req.body.blogID })
        res.json(blogwithID)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

/* User Specific API Calls for entire blogs or cards*/
router.get('/fetchUserBlogs', fetchuser, async (req, res) => {
    // our middleware fetchuser has put req.user=data.user
    try {

        // this will give all the items corresponding tothe user.id
        const documents = await Document.find({ userID: req.user.id })
        res.json(documents)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})



//! <-----------------------Cards------------------------------> 

/*untied/unchained API calls (not user specific)*/
router.get('/fetchAllCards', async (req, res) => {
    // our middleware fetchuser has put req.user=data.user
    try {

        // this will give all the items corresponding tothe user.id
        const blogcards = await blogcard.find()
        res.json(blogcards)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})



router.get('/fetchUserBlogsCards', fetchuser, async (req, res) => {
    // our middleware fetchuser has put req.user=data.user
    try {

        // this will give all the items corresponding tothe user.id
        const UserBlogCards = await blogcard.find({ userID: req.user.id })
        res.json(UserBlogCards)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})



// to save the blog card of the newly added blog.
router.post('/saveblogcard', async (req, res) => {
    try {
        let BlogCard = await blogcard.findOne({ blogID: req.body.blogID });
        if (BlogCard) {
            res.status(404).send("try with another id blog with this id already exists.");
        }

        BlogCard = await blogcard.create({
            userID: req.body.userID,
            blogID: req.body.blogID,
            title: req.body.title,
            description: req.body.description,
            thumbnailurl: req.body.thumbnailurl,
            tag: req.body.tag
        });

        res.json({ success: true, BlogCardID: BlogCard.id });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

// To delete a blog and it's card Completely

router.delete('/deletecard/:id', async (req, res) => {
    let todelete = await blogcard.findById(req.params.id);
    console.log(todelete.userID.toString());

    if (!todelete) {
        res.status(404).send("Not found ");
    }

    try {
        //checking whether the user trying to update the note is the same as the one who created it.
        // if (doc.User.toString() !== req.user.id) {
        //     res.status(401).send("Not Allowed");
        // }

        todelete = await blogcard.findByIdAndDelete(req.params.id);

        const todeletedoc = await Document.findByIdAndDelete(todelete.blogID);

        res.json({ success: true, result: "blog + card successfully deleted", todelete, todeletedoc });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})


module.exports = router