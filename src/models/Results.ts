import mongoose from 'mongoose'


const Heuristics = new mongoose.Schema({
    minSum: Number,
    maxNumber: Number,
    set: Array,
    votingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voting' }
});

export default mongoose.models.Heuristics || mongoose.model('Heuristics', Heuristics);