import Poll from '../models/poll.model.js';

import { successResponse, errorResponse } from '../utils/response.utils.js';


export async function createPoll(req, res, next) {
  try {
    const { question, description, options, endsAt, isAnonymous, isMultipleChoice } = req.body;

    if (!question || !options || options.length < 2) {
      return errorResponse(res, 'Question and at least two options are required', 400);
    }

    const formattedOptions = options.map((opt) => ({ text: opt, votes: [] }));

    const poll = new Poll({
      createdBy: req.user.id,
      societyId: 'DEFAULT_SOCIETY', 
      question,
      description,
      options: formattedOptions,
      endsAt,
      isAnonymous,
      isMultipleChoice,
      status: 'active'
    });

    await poll.save();
    return successResponse(res, poll, 'Poll created successfully', 201);
  } catch (err) {
    next(err);
  }
}


export async function getPolls(req, res, next) {
  try {
    const polls = await Poll.find({ societyId: 'DEFAULT_SOCIETY' }).sort({ createdAt: -1 });

    
    const formattedPolls = polls.map((poll) => {
      const pollObj = poll.toObject();
      let hasVoted = false;
      let votedOptionIds = [];

      pollObj.options.forEach((opt) => {
        if (opt.votes.includes(req.user.id)) {
          hasVoted = true;
          votedOptionIds.push(opt._id.toString());
        }
        
        if (pollObj.isAnonymous && req.user.role !== 'committee') {
          opt.votes = opt.votes.length; 
        }
      });

      return {
        ...pollObj,
        hasVoted,
        votedOptionIds
      };
    });

    return successResponse(res, formattedPolls);
  } catch (err) {
    next(err);
  }
}


export async function votePoll(req, res, next) {
  try {
    const { id } = req.params;
    const { optionIds } = req.body; 

    if (!optionIds || optionIds.length === 0) {
      return errorResponse(res, 'Must select an option', 400);
    }

    const poll = await Poll.findById(id);
    if (!poll) return errorResponse(res, 'Poll not found', 404);

    if (poll.status !== 'active' || (poll.endsAt && new Date() > new Date(poll.endsAt))) {
      return errorResponse(res, 'This poll is no longer active', 400);
    }

    if (!poll.isMultipleChoice && optionIds.length > 1) {
      return errorResponse(res, 'This poll only allows a single choice', 400);
    }

    
    const hasVoted = poll.options.some((opt) => opt.votes.includes(req.user.id));
    if (hasVoted) {
      return errorResponse(res, 'You have already voted on this poll', 400);
    }

    
    let voteRecorded = false;
    poll.options.forEach((opt) => {
      if (optionIds.includes(opt._id.toString())) {
        opt.votes.push(req.user.id);
        voteRecorded = true;
      }
    });

    if (voteRecorded) {
      poll.totalVoters += 1;
      await poll.save();
    }

    return successResponse(res, poll, 'Vote cast successfully');
  } catch (err) {
    next(err);
  }
}


export async function deletePoll(req, res, next) {
  try {
    if (req.user.role !== 'committee') {
      return errorResponse(res, 'Only committee members can delete polls', 403);
    }
    const poll = await Poll.findById(req.params.id);
    if (!poll) return errorResponse(res, 'Poll not found', 404);

    await Poll.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Poll deleted successfully');
  } catch (err) {
    next(err);
  }
}
