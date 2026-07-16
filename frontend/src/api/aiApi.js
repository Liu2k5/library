import API from './axiosConfig';

const BASE = '/api/ai';

/**
 * Gửi câu hỏi đến AI chatbot.
 * @param {string} question - Nội dung câu hỏi
 * @param {string} conversationId - ID cuộc hội thoại (để duy trì ngữ cảnh)
 * @param {Array} history - Lịch sử hội thoại [{author, content}, ...]
 * @returns {Promise<{conversationId: string, answer: string}>}
 */
export const sendChatMessage = (question, conversationId, history = []) =>
    API.post(`${BASE}/chat`, { question, conversationId, history });
