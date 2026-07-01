import { validationResult } from "express-validator";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

const isAdmin = (group, userId) =>
  group.admins.some((id) => id.equals(userId));

const populateGroup = async (group) => {
  return await group.populate([
    { path: "members", select: "fullName profilePic email" },
    { path: "admins", select: "fullName profilePic" },
  ]);
};

// ---------------- CREATE GROUP ----------------
export const createGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errorResponse(res, errors.array()[0].msg, 400);

  try {
    const {
      name,
      description,
      memberIds = [],
      isPrivate = true,
      onlyAdminsCanMessage = false,
      avatar,
    } = req.body;

    const uniqueMemberIds = new Set(
      memberIds.map((id) => id.toString()).filter(Boolean)
    );
    uniqueMemberIds.add(req.user._id.toString());

    const members = Array.from(uniqueMemberIds);
    const admins = [req.user._id.toString()];

    const groupData = {
      name,
      description,
      members,
      admins,
      isPrivate,
      onlyAdminsCanMessage,
      createdBy: req.user._id,
    };

    if (avatar?.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(avatar, {
        folder: "group_avatars",
      });
      groupData.avatar = upload.secure_url;
    }

    let group = await Group.create(groupData);
    group = await populateGroup(group);

    return successResponse(res, { group }, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- GET MY GROUPS ----------------
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id });
    await Promise.all(groups.map(populateGroup));

    return successResponse(res, { groups });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- GET PUBLIC GROUPS ----------------
export const getPublicGroups = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const regex = new RegExp(search, "i");

    const groups = await Group.find({
      isPrivate: false,
      name: regex,
    })
      .skip(skip)
      .limit(limit)
      .populate("members", "fullName profilePic")
      .populate("createdBy", "fullName profilePic");

    const total = await Group.countDocuments({
      isPrivate: false,
      name: regex,
    });

    return successResponse(res, {
      groups,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- GET GROUP BY ID ----------------
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findOne({
      _id: req.params.id,
      $or: [{ members: req.user._id }, { isPrivate: false }],
    });

    if (!group)
      return errorResponse(res, "Group not found or access denied", 404);

    await populateGroup(group);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- UPDATE GROUP ----------------
export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);
    if (!isAdmin(group, req.user._id))
      return errorResponse(res, "Only admins can update group", 403);

    const { name, description, isPrivate, onlyAdminsCanMessage } = req.body;

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (isPrivate !== undefined) group.isPrivate = isPrivate;
    if (onlyAdminsCanMessage !== undefined)
      group.onlyAdminsCanMessage = onlyAdminsCanMessage;

    if (req.body.avatar?.startsWith("data:")) {
      const upload = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "group_avatars",
      });
      group.avatar = upload.secure_url;
    }

    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupUpdate", group);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- ADD MEMBER ----------------
export const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);

    if (group.isPrivate && !isAdmin(group, req.user._id)) {
      return errorResponse(
        res,
        "Only admins can add members to this group",
        403
      );
    }

    if (group.members.some((id) => id.equals(memberId))) {
      return errorResponse(res, "Member already in group", 400);
    }

    const member = await User.findById(memberId);
    if (!member) return errorResponse(res, "User not found", 404);

    group.members.push(memberId);
    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupMemberAdded", member);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- REMOVE MEMBER ----------------
export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);

    if (!isAdmin(group, req.user._id))
      return errorResponse(res, "Only admins can remove members", 403);

    if (!group.members.some((id) => id.equals(memberId))) {
      return errorResponse(res, "Member not in group", 400);
    }

    group.members = group.members.filter((id) => !id.equals(memberId));
    group.admins = group.admins.filter((id) => !id.equals(memberId));

    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupMemberRemoved", memberId);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- LEAVE GROUP ----------------
export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);

    if (!group.members.some((id) => id.equals(req.user._id))) {
      return errorResponse(res, "You are not a member", 400);
    }

    group.members = group.members.filter((id) => !id.equals(req.user._id));
    group.admins = group.admins.filter((id) => !id.equals(req.user._id));

    if (!group.members.length) {
      await Group.deleteOne({ _id: group._id });
      return successResponse(res, {
        message: "Group deleted because empty",
      });
    }

    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupMemberRemoved", req.user._id);

    return successResponse(res, {
      group,
      message: "Left group successfully",
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// ---------------- PROMOTE / DEMOTE / DELETE / JOIN ----------------
// (same pattern applied — keeping short, already fixed logic-wise)

export const promoteAdmin = async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);
    if (!isAdmin(group, req.user._id))
      return errorResponse(res, "Only admins", 403);

    if (!group.admins.some((id) => id.equals(memberId))) {
      group.admins.push(memberId);
    }

    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupUpdate", group);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const demoteAdmin = async (req, res) => {
  try {
    const { memberId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);
    if (!isAdmin(group, req.user._id))
      return errorResponse(res, "Only admins", 403);

    group.admins = group.admins.filter((id) => !id.equals(memberId));

    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupUpdate", group);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Group not found", 404);
    if (!isAdmin(group, req.user._id))
      return errorResponse(res, "Only admins", 403);

    await Group.deleteOne({ _id: group._id });

    io.to(group._id.toString()).emit("groupDeleted", group._id);

    return successResponse(res, { message: "Group deleted" });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const joinPublicGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return errorResponse(res, "Not found", 404);
    if (group.isPrivate)
      return errorResponse(res, "Private group", 403);

    group.members.push(req.user._id);

    await group.save();
    await populateGroup(group);

    io.to(group._id.toString()).emit("groupMemberAdded", req.user);

    return successResponse(res, { group });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};