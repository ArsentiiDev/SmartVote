import mongoose from "mongoose";

const Heuristics = new mongoose.Schema({
    sum: Number,
    placing: String,
    votingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voting' }
});

export default mongoose.models.Heuristics || mongoose.model('Heuristics', Heuristics);