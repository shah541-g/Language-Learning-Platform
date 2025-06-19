import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers (req,res) {

    try {
        
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUSers = await User.find({
            $and: [
                {_id:{$ne:currentUserId}}, // exclude surrent user
                {$id: {$nin: currentUser.friends}}, // exclude current user's friends
                {isOnBoarded:true}
            ]
        });
        res.status(200).json({recommendedUSers});
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json("Internal Server Error");
    }
}
export async function getMyFriends (req,res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function sendFriendRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        // prevent sending request to yourself
        if(myId===recipientId){
            return res.status(400).json({message:"You can't send friend request to yourself"});
        }


        const recipient = await User.findById(recipientId);
        if(!recipient){
            res.status(404).json({message:"Recipient not Found"});
        }
        // check if user already friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friend with this User"});
        }


        // check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            $or:[
                {sender:myId, recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ],
        });

        if(existingRequest){
            return res.status(400).
            json({message:"A frien request already exists between you and this user"});
        }

        const frientRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        });

        res.status(201).json(frientRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).jason({message:"Internal Server Error"});
    }
}

export async function acceptFriendRequest(req,res){
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);


        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }

        // Verify the current user is the recipient
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({message:"You are not authorized to accept the request"});

        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user in other's friends list
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({message:"Friend request accepted"})
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).jason({message:"Internal Server Error"});
    }
}

export async function getFriendRequests(req,res){
    try {
        const incomingReqs = await FriendRequest.find({
            recipient:re.user.id,
            status:"pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({incomingReqs, acceptedReqs});
    } catch (error) {
        console.log("Error in getPendingFriendRequest constroller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export async function getOutgoingFriendRequests(req,res){
    try {
        const outGoingRequests = await FriendRequest.find({
            recipient:re.user.id,
            status:"pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json({outGoingRequests});
    } catch (error) {
        console.log("Error in getOutgoingFriendRequests controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}