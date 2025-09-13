const data = require('data/transcript.json');

export default function getCaptionData() {
    if(!data || !data.segments) return[];
    return data.segments
        .map(seg => ({
            time:seg.start,
            text:seg.text
        }));
}
