const data = require('data/transformed_transcript.json');

export default function getCaptionData() {
    if(!data || !data.segments) return[];
    return data.transcripts
        .map(transcript => ({
            time: transcript.start,
            text: transcript.text,
            feedbacks: transcript.feedback_ids.map(id => data.feedbacks[id])
        }));
}
