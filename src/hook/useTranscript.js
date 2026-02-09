import { useState, useEffect, useMemo } from 'react';

// 直接從資料夾引入 JSON
const data = require('data/transcript.json');

/**
 * 內部資料處理函式 (原本的 getCaptionData 邏輯)
 * 負責將原始 JSON 轉換為包含 textSegments (highlights) 的格式
 */
function processTranscriptData() {
    if (!data) {
        return {
            date: null,
            practice_type: null,
            transcripts: [],
            notes: [],
        };
    }

    const date = data.date.replace(/[^0-9]/g, '/') || null;
    const practice_type = data.practice_type || null;

    // 初始化筆記陣列
    const notes = data.transcripts.map(() => '');

    const transcripts = data.transcripts.map((transcript, index) => {
        const feedbacks = (transcript.feedback_ids || []).map((id) => data.feedbacks[id]);
        let highlights = [];

        // 標記高亮區間邏輯
        feedbacks.forEach((fb) => {
            if (fb && fb.highlight_part) {
                const part = fb.highlight_part;
                let fromIndex = 0;
                let idx = transcript.text.indexOf(part, fromIndex);
                while (idx !== -1) {
                    const overlap = highlights.some(
                        (h) => idx < h.end && idx + part.length > h.start,
                    );
                    if (!overlap) {
                        highlights.push({
                            start: idx,
                            end: idx + part.length,
                            feedbackId: fb.id,
                        });
                        break;
                    }
                    fromIndex = idx + 1;
                    idx = transcript.text.indexOf(part, fromIndex);
                }
            }
        });

        highlights.sort((a, b) => a.start - b.start);

        // 建立文字片段 (textSegments)
        let segments = [];
        let lastIdx = 0;
        for (let i = 0; i < highlights.length; ++i) {
            const h = highlights[i];
            if (lastIdx < h.start) {
                segments.push({
                    text: transcript.text.slice(lastIdx, h.start),
                    highlight: false,
                    feedback: null,
                });
            }
            const matchingFeedback = feedbacks.find((fb) => fb.id === h.feedbackId);
            segments.push({
                text: transcript.text.slice(h.start, h.end),
                highlight: true,
                feedback: matchingFeedback ?? null,
            });
            lastIdx = h.end;
        }
        if (lastIdx < transcript.text.length) {
            segments.push({
                text: transcript.text.slice(lastIdx),
                highlight: false,
                feedback: null,
            });
        }

        return {
            id: index,
            time: transcript.start,
            textSegments: segments,
            speaker_id: transcript.speaker_id,
        };
    });

    return { date, practice_type, transcripts, notes };
}

/**
 * 合併後的 Custom Hook
 * @param {number} currentTime - 影片當前播放時間
 */
export default function useTranscript(currentTime) {
    // 1. 使用 useMemo 確保資料轉換只在初次或 data 改變時執行一次
    const initialData = useMemo(() => processTranscriptData(), []);

    // 2. 統一管理資料狀態與 UI 狀態
    const [transcriptData, setTranscriptData] = useState(initialData);
    const [selectedCaptionIndex, setSelectedCaptionIndex] = useState(-1);
    const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);

    // 3. 自動追蹤當前播放進度 (原本 useTranscript 的邏輯)
    useEffect(() => {
        let index = -1;
        const list = transcriptData.transcripts;

        for (let i = 0; i < list.length; i++) {
            if (currentTime >= list[i].time) {
                index = i;
            } else {
                break;
            }
        }

        if (index !== -1 && index !== currentCaptionIndex) {
            setCurrentCaptionIndex(index);
        }
    }, [currentTime, transcriptData.transcripts, currentCaptionIndex]);

    // 4. 更新筆記的方法
    const updateNote = (index, newText) => {
        setTranscriptData((prevData) => {
            const newNotes = [...prevData.notes];
            newNotes[index] = newText;
            return {
                ...prevData,
                notes: newNotes,
            };
        });
    };

    // 暴露統一的介面供 Main.js 或其他組件使用
    return {
        ...transcriptData, // 包含 date, practice_type, transcripts, notes
        currentCaptionIndex, // 當前播放到的字幕索引
        selectedCaptionIndex, // 使用者點選/選取的字幕索引
        setSelectedCaptionIndex, // 設定選取索引的函式
        updateNote, // 更新筆記的函式
    };
}
